/**
 * CreatorIntel — Bi-Weekly Scrape Pipeline
 * pipeline/scrape.js
 *
 * What this does:
 * 1. Runs Apify Instagram Post Scraper on all watchlist accounts (25 posts each)
 * 2. Filters reels with spoken audio, runs Apify Reel Scraper for transcripts
 * 3. Runs Google Vision OCR on carousel cover slides + reel thumbnails
 * 4. Calculates per-creator engagement baselines (median across ALL posts in dataset)
 * 5. Scores each post against that creator's baseline, flags top performers (≥2.0x)
 * 6. Writes enriched-data.json for the Claude analysis session
 *
 * Baseline methodology:
 * - For each creator, collect all posts returned in this run (up to 25)
 * - Median of their interactions (likes + comments), excluding posts where likesCount = -1
 * - baselineMultiplier = post interactions ÷ creator median
 * - A post is a top performer if baselineMultiplier ≥ 2.0
 * - Single-post creators get multiplier = 1.0 and are NOT flagged as top performers
 */

const fs = require('fs');
const https = require('https');

const APIFY_TOKEN = process.env.APIFY_TOKEN;
const GOOGLE_VISION_KEY = process.env.GOOGLE_VISION_KEY;

// ── WATCHLIST ────────────────────────────────────────────────────────
const WATCHLIST = {
  photographers: [
    'novemberstudio.co', 'rocioprezg', '_lagiuditta', 'helloemilie',
    'raz_kind', 'jameslloydcole', 'nicolasqnphotography', 'dpc_photography_',
    'adriana_maria_', 'sliceofpai', 'hayleykelsingphotography', 'austinrutland',
    'creativebykera', 'leanderhoefler', 'birch'
  ],
  hospitality: [
    'relaischateaux', 'belmond', 'rosewoodcastigliondelbosco', 'aman',
    'thenewtinsomerset', 'thehoxtonhotel', 'domaines.de.chabran', 'estellemanor',
    'borgosantopietro', 'reschio', 'ritzparis', 'tenutadimurlo',
    'thelibraguide', 'thehero_w9'
  ],
  strategists: [
    'prettylittlemarketer', 'juliabroome', 'onbrandmag',
    'thecreative.social', 'seventhhousemarketing'
  ],
  travel: [
    'postcardsbyhannah', 'simplyslowtraveler', 'kelseyinlondon', 'therollinson',
    'theremoteconcept', 'augustopro', 'vanessadaylife', 'joselyn.hana'
  ]
};

const ALL_HANDLES = Object.values(WATCHLIST).flat();

// ── HELPERS ──────────────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function httpsPost(url, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(body);
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyStr)
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

// ── APIFY: START AN ACTOR RUN ─────────────────────────────────────────
async function startApifyRun(actorId, input) {
  console.log(`Starting Apify actor: ${actorId}`);
  const url = `https://api.apify.com/v2/acts/${actorId}/runs?token=${APIFY_TOKEN}`;
  const result = await httpsPost(url, input);
  if (!result.data || !result.data.id) {
    throw new Error(`Failed to start actor ${actorId}: ${JSON.stringify(result)}`);
  }
  return result.data.id;
}

// ── APIFY: POLL UNTIL FINISHED ────────────────────────────────────────
async function waitForRun(runId, maxWaitMs = 600000) {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    await sleep(10000);
    const url = `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`;
    const result = await httpsGet(url);
    const status = result.data.status;
    console.log(`  Run ${runId}: ${status}`);
    if (status === 'SUCCEEDED') return result.data.defaultDatasetId;
    if (status === 'FAILED' || status === 'ABORTED') {
      throw new Error(`Apify run ${runId} ended with status: ${status}`);
    }
  }
  throw new Error(`Apify run ${runId} timed out after ${maxWaitMs / 1000}s`);
}

// ── APIFY: FETCH DATASET ──────────────────────────────────────────────
async function fetchDataset(datasetId) {
  const url = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}&limit=2000`;
  const result = await httpsGet(url);
  return Array.isArray(result) ? result : (result.items || []);
}

// ── GOOGLE VISION OCR ─────────────────────────────────────────────────
async function extractTextFromImage(imageUrl) {
  if (!GOOGLE_VISION_KEY || !imageUrl) return null;
  try {
    const url = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_KEY}`;
    const body = {
      requests: [{
        image: { source: { imageUri: imageUrl } },
        features: [{ type: 'DOCUMENT_TEXT_DETECTION', maxResults: 1 }]
      }]
    };
    const result = await httpsPost(url, body);
    const text = result?.responses?.[0]?.fullTextAnnotation?.text;
    return text ? text.trim().replace(/\n/g, ' ') : null;
  } catch (e) {
    console.warn(`  Vision OCR failed for ${imageUrl}: ${e.message}`);
    return null;
  }
}

// ── CALCULATE ENGAGEMENT ──────────────────────────────────────────────
function getEngagement(post) {
  const likes    = post.likesCount    || post.likes_count    || 0;
  const comments = post.commentsCount || post.comments_count || 0;
  const views    = post.videoViewCount || post.video_view_count || post.videoPlayCount || post.video_play_count || 0;
  const followers = post.ownerFollowersCount || 1000;
  const interactions = likes + comments;
  const engRate = followers > 0 ? (interactions / followers) * 100 : 0;
  return { likes, comments, views, engRate, interactions };
}

// Median of an array of numbers
function median(arr) {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

// ── DETERMINE POST TYPE ───────────────────────────────────────────────
function getPostType(post) {
  const type = post.type || post.productType || '';
  if (type === 'Video' || type === 'Reel' || type === 'clips') return 'reel';
  if (type === 'Sidecar' || type === 'carousel') return 'carousel';
  return 'image';
}

// ── EXTRACT SHORTCODE FROM URL ────────────────────────────────────────
function extractShortcode(url) {
  if (!url) return null;
  const m = url.match(/\/p\/([A-Za-z0-9_-]+)/);
  return m ? m[1] : null;
}

// ── MAIN PIPELINE ─────────────────────────────────────────────────────
async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('CreatorIntel Bi-Weekly Pipeline — ' + new Date().toISOString());
  console.log(`Scraping ${ALL_HANDLES.length} accounts · 25 posts each`);
  console.log('═══════════════════════════════════════════');

  // ── STEP 1: POST SCRAPER ───────────────────────────────────────────
  console.log('\n[1/4] Running Instagram Post Scraper...');
  const postRunId = await startApifyRun('apify~instagram-post-scraper', {
    directUrls: ALL_HANDLES.map(h => `https://www.instagram.com/${h}/`),
    resultsLimit: 25,
    addParentData: false
  });
  const postDatasetId = await waitForRun(postRunId);
  const rawPosts = await fetchDataset(postDatasetId);
  console.log(`  Retrieved ${rawPosts.length} posts`);

  // Track which handles returned no data (private / restricted)
  const returnedHandles = new Set(rawPosts.map(p => p.ownerUsername || p.username).filter(Boolean));
  const missingHandles  = ALL_HANDLES.filter(h => !returnedHandles.has(h));
  if (missingHandles.length) {
    console.log(`  ⚠️  No data for: ${missingHandles.join(', ')}`);
  }

  // ── STEP 2: IDENTIFY REELS WITH AUDIO ─────────────────────────────
  const spokenReels = rawPosts.filter(p =>
    getPostType(p) === 'reel' && p.hasAudio !== false && (p.url || p.shortCode)
  );
  console.log(`\n[2/4] Found ${spokenReels.length} spoken-audio reels — running Reel Scraper...`);

  let reelTranscripts = {};
  if (spokenReels.length > 0) {
    const reelUrls = spokenReels
      .map(p => p.url || `https://www.instagram.com/p/${p.shortCode}/`)
      .slice(0, 200);

    const reelRunId = await startApifyRun('apify~instagram-reel-scraper', {
      directUrls: reelUrls,
      resultsLimit: 200
    });
    const reelDatasetId = await waitForRun(reelRunId);
    const reelData = await fetchDataset(reelDatasetId);

    reelData.forEach(r => {
      const key = r.shortCode || r.url;
      if (key && r.transcript) reelTranscripts[key] = r.transcript;
    });
    console.log(`  Got transcripts for ${Object.keys(reelTranscripts).length} reels`);
  }

  // ── STEP 3: GOOGLE VISION OCR ──────────────────────────────────────
  console.log('\n[3/4] Running Google Vision OCR on carousel covers + reel thumbnails...');
  let visionCount = 0;

  const enrichedPosts = [];
  for (const post of rawPosts) {
    const type       = getPostType(post);
    const eng        = getEngagement(post);
    const shortCode  = post.shortCode || extractShortcode(post.url) || post.id;
    const transcript = reelTranscripts[shortCode] || reelTranscripts[post.url] || null;

    // Skip posts with hidden likes
    if ((post.likesCount || 0) === -1) {
      enrichedPosts.push({
        id: shortCode, url: post.url || `https://www.instagram.com/p/${shortCode}/`,
        shortcode: shortCode,
        handle: post.ownerUsername || post.username,
        handle_url: `https://www.instagram.com/${post.ownerUsername || post.username}/`,
        category: getCategoryForHandle(post.ownerUsername || post.username),
        type, caption: post.caption || '', hookText: null, ocrText: null, transcript,
        timestamp: post.timestamp || post.takenAtTimestamp,
        likes: -1, comments: eng.comments, views: eng.views,
        engRate: 0, interactions: 0, followers: post.ownerFollowersCount || null,
        displayUrl: post.displayUrl || null, audio: null, hiddenLikes: true
      });
      continue;
    }

    let ocrText = null;
    if (GOOGLE_VISION_KEY && visionCount < 950) {
      const imageUrl = type === 'carousel'
        ? (post.images?.[0]?.url || post.displayUrl || null)
        : type === 'reel'
          ? (post.displayUrl || post.thumbnailUrl || null)
          : null;
      if (imageUrl) {
        ocrText = await extractTextFromImage(imageUrl);
        visionCount++;
        if (ocrText) await sleep(100);
      }
    }

    // Hook text priority: OCR → transcript first sentence → caption first line
    let hookText = null;
    if (ocrText && ocrText.length > 5) {
      hookText = ocrText.substring(0, 150);
    } else if (transcript) {
      hookText = transcript.split('.')[0].substring(0, 150);
    } else if (post.caption) {
      hookText = post.caption.split('\n')[0].substring(0, 150);
    }

    const audioName   = post.musicInfo?.musicName || post.audioTitle   || null;
    const audioArtist = post.musicInfo?.artistName || post.audioArtist || null;
    const audioId     = post.musicInfo?.musicId    || post.audioId     || null;
    const audioUses   = post.musicInfo?.usageCount || null;

    enrichedPosts.push({
      id: shortCode,
      url: post.url || `https://www.instagram.com/p/${shortCode}/`,
      shortcode: shortCode,
      handle: post.ownerUsername || post.username,
      handle_url: `https://www.instagram.com/${post.ownerUsername || post.username}/`,
      category: getCategoryForHandle(post.ownerUsername || post.username),
      type, caption: post.caption || '', hookText, ocrText, transcript,
      timestamp: post.timestamp || post.takenAtTimestamp,
      likes: eng.likes, comments: eng.comments, views: eng.views,
      engRate: eng.engRate, interactions: eng.interactions,
      followers: post.ownerFollowersCount || null,
      displayUrl: post.displayUrl || null,
      hiddenLikes: false,
      audio: audioName ? { name: audioName, artist: audioArtist, id: audioId, uses: audioUses } : null
    });
  }

  console.log(`  Vision OCR ran on ${visionCount} images`);

  // ── STEP 4: CALCULATE BASELINES + SCORES ──────────────────────────
  console.log('\n[4/4] Calculating engagement baselines and scoring posts...');

  // Group by creator, exclude hidden-likes posts from baseline
  const byCreator = {};
  enrichedPosts.forEach(p => {
    if (!byCreator[p.handle]) byCreator[p.handle] = [];
    byCreator[p.handle].push(p);
  });

  // Baseline = median interactions of all valid posts for that creator
  const baselines   = {};
  const postCounts  = {};
  Object.entries(byCreator).forEach(([handle, posts]) => {
    const valid = posts.filter(p => !p.hiddenLikes && p.interactions >= 0);
    const interactions = valid.map(p => p.interactions);
    baselines[handle]  = median(interactions);
    postCounts[handle] = valid.length;
  });

  // Score each post
  enrichedPosts.forEach(p => {
    if (p.hiddenLikes) { p.baselineMultiplier = null; p.isTopPerformer = false; return; }
    const baseline = baselines[p.handle] || 1;
    const count    = postCounts[p.handle] || 1;
    p.baselinePostCount   = count;
    p.baselineMultiplier  = baseline > 0
      ? Math.round((p.interactions / baseline) * 10) / 10
      : null;
    // Only flag as top performer if ≥2.0x AND creator has more than 1 post in dataset
    p.isTopPerformer = p.baselineMultiplier !== null
      && p.baselineMultiplier >= 2.0
      && count > 1;
  });

  // ── COMPILE OUTPUT ─────────────────────────────────────────────────
  const topPerformers = enrichedPosts
    .filter(p => p.isTopPerformer)
    .sort((a, b) => b.baselineMultiplier - a.baselineMultiplier)
    .slice(0, 15);

  // Audio trend analysis — track across creators
  const audioMap = {};
  enrichedPosts.forEach(p => {
    if (p.audio?.id) {
      if (!audioMap[p.audio.id]) audioMap[p.audio.id] = {
        name: p.audio.name, artist: p.audio.artist, uses: p.audio.uses, creators: new Set()
      };
      audioMap[p.audio.id].creators.add(p.handle);
    }
  });
  const trendingAudio = Object.values(audioMap)
    .filter(a => a.creators.size >= 2)
    .sort((a, b) => b.creators.size - a.creators.size)
    .slice(0, 8)
    .map(a => ({ ...a, creators: a.creators.size }));

  // Format counts
  const formatCounts = { reel: 0, carousel: 0, image: 0 };
  enrichedPosts.forEach(p => { formatCounts[p.type] = (formatCounts[p.type] || 0) + 1; });

  // Data quality notes for dashboard banner
  const dataNotes = [];
  if (missingHandles.length > 0) {
    dataNotes.push(`${missingHandles.length} accounts returned no data (private or restricted): ${missingHandles.slice(0, 5).join(', ')}${missingHandles.length > 5 ? '…' : ''}`);
  }
  const hiddenLikesCount = enrichedPosts.filter(p => p.hiddenLikes).length;
  if (hiddenLikesCount > 0) {
    dataNotes.push(`${hiddenLikesCount} posts excluded from baseline calculations (hidden likes).`);
  }
  const thinBaselineCreators = Object.entries(postCounts).filter(([, c]) => c <= 2).map(([h]) => h);
  if (thinBaselineCreators.length > 0) {
    dataNotes.push(`${thinBaselineCreators.length} creators have ≤2 posts in dataset — multipliers for these are directional only.`);
  }

  const output = {
    meta: {
      generated: new Date().toISOString(),
      cycle: getCycleDates(),
      watchlist_count: ALL_HANDLES.length,
      posts_analysed: enrichedPosts.length,
      creators_active: Object.keys(byCreator).length,
      top_performers_found: topPerformers.length,
      ocr_images_processed: visionCount,
      missing_handles: missingHandles,
      data_notes: dataNotes
    },
    baselines,
    post_counts: postCounts,
    format_counts: formatCounts,
    trending_audio: trendingAudio,
    top_performers: topPerformers,
    all_posts: enrichedPosts,
    _next_step: [
      "1. Download enriched-data.json from GitHub (or copy its contents)",
      "2. Open Claude chat and paste the JSON",
      "3. Type: run weekly analysis",
      "4. Copy the structured JSON output Claude returns",
      "5. Paste it into analysis.json in GitHub, commit",
      "6. Vercel redeploys automatically — dashboard is updated"
    ]
  };

  fs.writeFileSync('enriched-data.json', JSON.stringify(output, null, 2));
  console.log('\n═══════════════════════════════════════════');
  console.log(`Pipeline complete.`);
  console.log(`Posts processed:      ${enrichedPosts.length}`);
  console.log(`Top performers found: ${topPerformers.length}`);
  console.log(`Trending audio:       ${trendingAudio.length}`);
  console.log(`OCR images processed: ${visionCount}`);
  console.log(`Missing handles:      ${missingHandles.length}`);
  console.log('Output: enriched-data.json');
  console.log('═══════════════════════════════════════════');
}

function getCategoryForHandle(handle) {
  if (!handle) return 'unknown';
  return Object.entries(WATCHLIST).find(([, handles]) => handles.includes(handle))?.[0] || 'unknown';
}

function getCycleDates() {
  const now = new Date();
  // Bi-weekly: last run was on the 1st or 15th
  const day = now.getDate();
  const cycleStart = new Date(now);
  cycleStart.setDate(day < 15 ? 1 : 15);
  const cycleEnd = new Date(now);
  const fmt = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${fmt(cycleStart)} – ${fmt(cycleEnd)}`;
}

main().catch(err => {
  console.error('Pipeline failed:', err);
  process.exit(1);
});
