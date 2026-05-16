/* ============================================================
   CreatorIntel — Natalie Rushman Photography
   app.js v2 — bi-weekly cadence, clickable links throughout,
   hook examples with quotes, oEmbed fix, additional metrics
   ============================================================ */

const SAMPLE_DATA = {
  meta: {
    generated: "2026-05-11T00:00:00Z",
    cycle: "Apr 28 – May 11, 2026",
    watchlist_count: 42,
    posts_analysed: 1047,
    creators_active: 38,
    engagement_avg: "4.2x median baseline",
    data_notes: []
  },
  stats: [
    { num: "1,047", sup: null, label: "Posts tracked" },
    { num: "19",    sup: null, label: "Creators above baseline" },
    { num: "4.2x",  sup: null, label: "Avg engagement rate" },
    { num: "12",    sup: null, label: "Trend clusters" }
  ],
  top_themes: [
    { label: "Travel destination storytelling", count: 87, pct: 100,
      posts: [
        { url: "https://www.instagram.com/p/example1/", handle: "@kelseyinlondon",     caption: "London isn't the city people say it is" },
        { url: "https://www.instagram.com/p/example2/", handle: "@adriana_maria_",     caption: "Evening walks in Vienna" }
      ]
    },
    { label: "Hotel & property experience", count: 64, pct: 74,
      posts: [
        { url: "https://www.instagram.com/p/DYKXSVljEmX/", handle: "@rocioprezg", caption: "Mediterranean blues" }
      ]
    },
    { label: "Natural light technique",     count: 52, pct: 60, posts: [] },
    { label: "Slow travel & lifestyle",      count: 48, pct: 55, posts: [] },
    { label: "Behind-the-scenes / shoot",   count: 41, pct: 47, posts: [] },
    { label: "Visual identity for brands",  count: 39, pct: 45, posts: [] }
  ],
  hook_types: [
    { name: "POV / Scene-setting",    count: 214, pct: 100,
      examples: [
        { text: "POV: your camera roll after a new hotel opening", url: "https://www.instagram.com/p/DYR90fUsRaU/", handle: "@rocioprezg" }
      ]
    },
    { name: "Contrarian / Hot take",  count: 178, pct: 83,
      examples: [
        { text: "THE ERA OF PERFORMATIVE INFLUENCING",  url: "https://www.instagram.com/p/DX7G1lkxS4A/", handle: "@juliabroome" },
        { text: "0% followers lost, 100% haters confirmed", url: "https://www.instagram.com/p/DYDqkRXsFRd/", handle: "@juliabroome" }
      ]
    },
    { name: "Curiosity gap / Withhold", count: 119, pct: 56,
      examples: [
        { text: "One of the finest examples of a private English country garden", url: "https://www.instagram.com/p/DYPyCJFsR0R/", handle: "@jameslloydcole" }
      ]
    },
    { name: "Authority / Expertise",   count: 87, pct: 41, examples: [] },
    { name: "Direct address",          count: 72, pct: 34, examples: [] },
    { name: "Relatability",            count: 58, pct: 27, examples: [] }
  ],
  formats: [
    { name: "Reel",         pill: "pill-reel",      count: 489 },
    { name: "Carousel",     pill: "pill-carousel",  count: 341 },
    { name: "Single Image", pill: "pill-image",     count: 217 }
  ],
  top_performers: [
    {
      handle: "@rocioprezg", handle_url: "https://www.instagram.com/rocioprezg/",
      post_url: "https://www.instagram.com/p/DYKXSVljEmX/",
      caption: "\"Mediterranean blues 🌊🌞\"",
      type: "Carousel", type_pill: "pill-carousel",
      likes: 2488, comments: 93,
      multiplier: "5.52x baseline", baseline_post_count: 7
    },
    {
      handle: "@rocioprezg", handle_url: "https://www.instagram.com/rocioprezg/",
      post_url: "https://www.instagram.com/p/DYR90fUsRaU/",
      caption: "\"POV: your camera roll after a new hotel opening 📸\"",
      type: "Reel", type_pill: "pill-reel",
      likes: 1308, views: 23633, comments: 23,
      multiplier: "2.90x baseline", baseline_post_count: 7
    },
    {
      handle: "@juliabroome", handle_url: "https://www.instagram.com/juliabroome/",
      post_url: "https://www.instagram.com/p/DX7G1lkxS4A/",
      caption: "\"THE ERA OF PERFORMATIVE INFLUENCING\"",
      type: "Reel", type_pill: "pill-reel",
      likes: 9345, comments: 224,
      multiplier: "2.51x baseline", baseline_post_count: 7
    }
  ],
  saturated: [
    { text: "Generic travel destination reels",          sub: "High volume, flat engagement — scenic clips without narrative are tuning audiences out." },
    { text: "IG growth tips and posting schedules",       sub: "Julia Broome owns this lane; competing against 7K–9K like posts is not viable." },
    { text: "Slow living mood clips with minimal copy",   sub: "Atmosphere-only reels produce the lowest engagement in the dataset." },
    { text: "UGC hotel showcase reels without story",     sub: "Short hotel clips without a human POV are returning near-zero likes." }
  ],
  underused: [
    { text: "Behind-the-scenes of a real client shoot",   sub: "Significant open signal for a photographer with Natalie's hospitality access." },
    { text: "Named-property deep dives with history",     sub: "Place-specific narratives consistently outperform generic landscape content by 2x." },
    { text: "Contrarian takes on photography norms",      sub: "Hot-take formats drive 2x+ multipliers and no hospitality photographer is using them." },
    { text: "Natural light as deliberate craft on camera", sub: "No watchlist creator explains the why behind their lighting — the authority gap is open." }
  ],
  effectiveness: [
    { rank: 1, label: "Contrarian / Hot take",  score: "2.34x", pct: 100 },
    { rank: 2, label: "POV / Scene-setting",    score: "2.15x", pct: 92  },
    { rank: 3, label: "Curiosity gap",          score: "1.98x", pct: 85  },
    { rank: 4, label: "Direct address",         score: "1.72x", pct: 74  },
    { rank: 5, label: "Authority / Expertise",  score: "1.54x", pct: 66  },
    { rank: 6, label: "Relatability",           score: "1.12x", pct: 48  }
  ],
  trend_tracker: [
    { label: "Garden / estate access content",       delta: "+38%", dir: "up"   },
    { label: "Contrarian creator strategy takes",    delta: "+29%", dir: "up"   },
    { label: "Named-property place storytelling",    delta: "+22%", dir: "up"   },
    { label: "Generic slow-life mood clips",         delta: "-18%", dir: "down" },
    { label: "UGC hotel showcase reels",             delta: "-24%", dir: "down" },
    { label: "European summer destination content",  delta: "flat", dir: "flat" }
  ],
  your_account: [
    { num: "—", label: "Followers" },
    { num: "—", label: "Avg reach" },
    { num: "—", label: "Posts this cycle" },
    { num: "—", label: "Top post ×" }
  ],
  opening_formulas: [
    { quote: "\"Mediterranean blues 🌊🌞\"",
      type: "POV / Scene-setting", type_color: "badge-purple", score: "5.52x avg baseline",
      handle: "@rocioprezg", handle_url: "https://www.instagram.com/rocioprezg/",
      post_url: "https://www.instagram.com/p/DYKXSVljEmX/" },
    { quote: "\"THE ERA OF PERFORMATIVE INFLUENCING\"",
      type: "Contrarian / Hot take", type_color: "badge-red", score: "2.51x avg baseline",
      handle: "@juliabroome", handle_url: "https://www.instagram.com/juliabroome/",
      post_url: "https://www.instagram.com/p/DX7G1lkxS4A/" },
    { quote: "\"POV: your camera roll after a new hotel opening 📸\"",
      type: "POV / Scene-setting", type_color: "badge-purple", score: "2.90x avg baseline",
      handle: "@rocioprezg", handle_url: "https://www.instagram.com/rocioprezg/",
      post_url: "https://www.instagram.com/p/DYR90fUsRaU/" },
    { quote: "\"One of the finest examples of a private English country garden\"",
      type: "Curiosity gap", type_color: "badge-blue", score: "2.39x avg baseline",
      handle: "@jameslloydcole", handle_url: "https://www.instagram.com/jameslloydcole/",
      post_url: "https://www.instagram.com/p/DYPyCJFsR0R/" },
    { quote: "\"0% followers lost, 100% haters confirmed\"",
      type: "Contrarian / Hot take", type_color: "badge-red", score: "2.16x avg baseline",
      handle: "@juliabroome", handle_url: "https://www.instagram.com/juliabroome/",
      post_url: "https://www.instagram.com/p/DYDqkRXsFRd/" }
  ],
  hooks: [
    {
      text: "\"Hotels hire me to make their spaces look inevitable. Most of them have no idea what that actually takes.\"",
      rationale: "Models the contrarian hot-take pattern driving 2.51x for @juliabroome. Natalie's Forbes Five-Star training gives her the standing to own this claim without it reading as arrogant.",
      pattern: "Contrarian + Proof"
    },
    {
      text: "\"POV: 6am, a suite no one has slept in yet, and the light is doing something I have never seen before.\"",
      rationale: "Models the scene-setting POV format behind @rocioprezg's 2.90x hotel-opening reel. Sensory and time-specific — it sells access and presence without naming a property.",
      pattern: "POV + Scene-setting"
    },
    {
      text: "\"The England most people never see — a Cotswolds garden in the hour before guests arrive.\"",
      rationale: "Adapts the named-place curiosity-gap formula from @jameslloydcole's 2.39x Gresgarth Hall post. Layering geography with a restricted time window creates aspiration and access signal.",
      pattern: "Curiosity gap + Access signal"
    }
  ],
  top_posts: [
    {
      handle: "@rocioprezg", handle_url: "https://www.instagram.com/rocioprezg/",
      url: "https://www.instagram.com/p/DYKXSVljEmX/", shortcode: "DYKXSVljEmX",
      multiplier: "5.52x", caption: "Mediterranean blues — Malaga hotel photography",
      likes: 2488, views: "23.6K", comments: 93
    },
    {
      handle: "@rocioprezg", handle_url: "https://www.instagram.com/rocioprezg/",
      url: "https://www.instagram.com/p/DYR90fUsRaU/", shortcode: "DYR90fUsRaU",
      multiplier: "2.90x", caption: "POV camera roll after a new hotel opening",
      likes: 1308, views: "23.6K", comments: 23
    },
    {
      handle: "@jameslloydcole", handle_url: "https://www.instagram.com/jameslloydcole/",
      url: "https://www.instagram.com/p/DYPyCJFsR0R/", shortcode: "DYPyCJFsR0R",
      multiplier: "2.39x", caption: "Gresgarth Hall — private English country garden",
      likes: 51047, views: "34.9K", comments: 318
    }
  ],
  audio_trends: [
    { title: "Dracula", artist: "Tame Impala", uses: "7,505 reels", creators: 1, rising: true,
      search_url: "https://open.spotify.com/search/Dracula%20Tame%20Impala" },
    { title: "Calm",    artist: "Vex King",    uses: "327 reels",   creators: 1, rising: false,
      search_url: "https://open.spotify.com/search/Calm%20Vex%20King" }
  ],
  citations: [
    { num: 1, text: "Instagram Post Scraper — Apify. Public post data for all watchlist accounts.", url: "https://apify.com/apify/instagram-post-scraper" },
    { num: 2, text: "Instagram Reel Scraper — Apify. Transcript and audio metadata for spoken-audio reels.", url: "https://apify.com/apify/instagram-reel-scraper" },
    { num: 3, text: "Document Text Detection — Google Cloud Vision API.", url: "https://cloud.google.com/vision/docs/ocr" },
    { num: 4, text: "Engagement baseline: median interactions across all posts per creator in the bi-weekly dataset. Multiplier = post interactions ÷ creator median.", url: null },
    { num: 5, text: "Analysis: Claude (Anthropic). Hook classification, theme clustering, open lane identification, hook generation.", url: "https://claude.ai" }
  ]
};

/* ------------------------------------------------------------------
   LOAD DATA
   ------------------------------------------------------------------ */
async function loadData() {
  try {
    const res = await fetch('./analysis.json?t=' + Date.now());
    if (!res.ok) throw new Error('fetch failed');
    const data = await res.json();
    if (!data.meta || !data.stats || data._status === 'sample_data') throw new Error('placeholder');
    return data;
  } catch {
    console.log('Using sample data — run the pipeline to generate analysis.json');
    return SAMPLE_DATA;
  }
}

/* ------------------------------------------------------------------
   HELPERS
   ------------------------------------------------------------------ */
function fmt(n) {
  if (n === undefined || n === null) return '—';
  if (typeof n === 'string') return n;
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000)    return (n / 1000).toFixed(1) + 'K';
  return n.toLocaleString();
}

function extractShortcode(url) {
  if (!url) return null;
  const m = url.match(/\/p\/([A-Za-z0-9_-]+)/);
  return m ? m[1] : null;
}

/* ------------------------------------------------------------------
   RENDERERS
   ------------------------------------------------------------------ */

function renderMeta(data) {
  const d = new Date(data.meta.generated);
  const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('date-chip').textContent = 'Generated ' + d.toLocaleDateString('en-US', opts);
  document.getElementById('live-label').textContent = 'Live · cycle ' + data.meta.cycle;
  document.getElementById('creator-count').textContent = data.meta.watchlist_count;
  document.getElementById('footer-date').textContent = 'Cycle: ' + data.meta.cycle;

  const notes = data.meta.data_notes || [];
  const banner = document.getElementById('data-quality-banner');
  if (banner) {
    if (notes.length) {
      banner.innerHTML = `<span class="dq-icon">⚠️</span> <span><strong>Data notes this cycle:</strong> ${notes.join(' · ')}</span>`;
      banner.style.display = 'flex';
    } else {
      banner.style.display = 'none';
    }
  }
}

function renderStats(data) {
  const row = document.getElementById('stat-row');
  row.innerHTML = '';
  data.stats.forEach(s => {
    row.insertAdjacentHTML('beforeend', `
      <div class="stat-item">
        <div class="stat-num">${s.num}${s.sup ? '<sup>' + s.sup + '</sup>' : ''}</div>
        <div class="stat-label">${s.label}</div>
      </div>`);
  });
}

function renderTopThemes(data) {
  const container = document.getElementById('top-themes-list');
  container.innerHTML = '';
  const max = data.top_themes[0]?.count || 1;
  data.top_themes.forEach(t => {
    const pct = Math.round((t.count / max) * 100);
    const posts = t.posts || [];
    const postChips = posts.length
      ? `<div class="theme-post-links">${posts.map(p =>
          `<a href="${p.url}" target="_blank" rel="noopener" class="post-link-chip" title="${p.caption}">${p.handle}</a>`
        ).join('')}</div>`
      : '';
    container.insertAdjacentHTML('beforeend', `
      <div class="theme-row">
        <div class="theme-label-col">
          <div class="theme-label">${t.label}</div>
          ${postChips}
        </div>
        <div class="theme-bar-wrap"><div class="theme-bar" style="width:${pct}%"></div></div>
        <div class="theme-count">${t.count}</div>
      </div>`);
  });
}

function renderHookTypes(data) {
  const container = document.getElementById('hook-types-list');
  container.innerHTML = '';
  data.hook_types.forEach(h => {
    const examples = h.examples || [];
    const exHtml = examples.length
      ? `<div class="hook-examples">${examples.map(e =>
          `<a href="${e.url}" target="_blank" rel="noopener" class="hook-example-chip">
            <span class="hook-example-handle">${e.handle}</span>
            <span class="hook-example-text">"${e.text}"</span>
            <span class="hook-example-arrow">↗</span>
          </a>`
        ).join('')}</div>`
      : '';
    container.insertAdjacentHTML('beforeend', `
      <div class="hook-row">
        <div class="hook-name-row">
          <div class="hook-name">${h.name}</div>
          <div class="hook-bar-wrap"><div class="hook-bar" style="width:${h.pct}%"></div></div>
          <div class="hook-count">${h.count}</div>
        </div>
        ${exHtml}
      </div>`);
  });
}

function renderFormats(data) {
  const container = document.getElementById('formats-list');
  container.innerHTML = '';
  const total = data.formats.reduce((a, f) => a + f.count, 0);
  data.formats.forEach(f => {
    const pct = Math.round((f.count / total) * 100);
    container.insertAdjacentHTML('beforeend', `
      <div class="format-row">
        <span class="format-pill ${f.pill}">${f.name}</span>
        <div class="format-pct">${pct}%</div>
        <div class="format-count">${f.count}</div>
      </div>`);
  });
}

function renderTopPerformers(data) {
  const container = document.getElementById('top-performers-list');
  container.innerHTML = '';
  data.top_performers.forEach(p => {
    const stats = [];
    if (p.likes)    stats.push('♥ ' + fmt(p.likes));
    if (p.views)    stats.push('▶ ' + fmt(p.views));
    if (p.comments) stats.push('💬 ' + fmt(p.comments));

    const baselineNote = p.baseline_post_count
      ? `<div class="baseline-note">Baseline from ${p.baseline_post_count} posts</div>`
      : '';

    const handleHtml = p.handle_url
      ? `<a href="${p.handle_url}" target="_blank" rel="noopener" class="performer-handle">${p.handle}</a>`
      : `<span class="performer-handle">${p.handle}</span>`;

    const captionHtml = p.post_url
      ? `<a href="${p.post_url}" target="_blank" rel="noopener" class="performer-caption-link">${p.caption} <span class="link-arrow">↗</span></a>`
      : `<div class="performer-caption">${p.caption}</div>`;

    container.insertAdjacentHTML('beforeend', `
      <div class="performer-row">
        <div class="performer-left">
          ${handleHtml}
          ${captionHtml}
          <div class="performer-stats">${stats.join(' · ')}</div>
        </div>
        <div class="performer-right">
          <span class="performer-multiplier">${p.multiplier}</span>
          <span class="performer-type ${p.type_pill}">${p.type}</span>
          ${baselineNote}
        </div>
      </div>`);
  });
}

function renderLanes(data) {
  const sat = document.getElementById('saturated-list');
  const und = document.getElementById('underused-list');
  sat.innerHTML = ''; und.innerHTML = '';
  data.saturated.forEach(s => {
    sat.insertAdjacentHTML('beforeend', `
      <div class="lane-item lane-sat">
        <div class="lane-dot"></div>
        <div><div class="lane-text">${s.text}</div><div class="lane-sub">${s.sub}</div></div>
      </div>`);
  });
  data.underused.forEach(u => {
    und.insertAdjacentHTML('beforeend', `
      <div class="lane-item lane-open">
        <div class="lane-dot"></div>
        <div><div class="lane-text">${u.text}</div><div class="lane-sub">${u.sub}</div></div>
      </div>`);
  });
}

function renderEffectiveness(data) {
  const container = document.getElementById('effectiveness-list');
  container.innerHTML = '';
  data.effectiveness.forEach(e => {
    container.insertAdjacentHTML('beforeend', `
      <div class="eff-row">
        <div class="eff-rank">${e.rank}</div>
        <div class="eff-label">${e.label}</div>
        <div class="eff-bar-wrap"><div class="eff-bar" style="width:${e.pct}%"></div></div>
        <div class="eff-score">${e.score}</div>
      </div>`);
  });
}

function renderTrendTracker(data) {
  const container = document.getElementById('trend-tracker-list');
  container.innerHTML = '';
  data.trend_tracker.forEach(t => {
    const cls   = t.dir === 'up' ? 'trend-up' : t.dir === 'down' ? 'trend-down' : 'trend-flat';
    const arrow = t.dir === 'up' ? '↑ ' : t.dir === 'down' ? '↓ ' : '→ ';
    container.insertAdjacentHTML('beforeend', `
      <div class="trend-row">
        <div class="trend-label">${t.label}</div>
        <div class="trend-delta ${cls}">${arrow}${t.delta}</div>
      </div>`);
  });
}

function renderYourAccount(data) {
  const grid = document.getElementById('your-account-grid');
  grid.innerHTML = '';
  data.your_account.forEach(s => {
    grid.insertAdjacentHTML('beforeend', `
      <div class="account-stat-box">
        <div class="account-stat-num">${s.num}</div>
        <div class="account-stat-lbl">${s.label}</div>
      </div>`);
  });
}

function renderOpeningFormulas(data) {
  const container = document.getElementById('opening-formulas-list');
  container.innerHTML = '';
  data.opening_formulas.forEach(f => {
    const handleHtml = f.handle_url
      ? `<a href="${f.handle_url}" target="_blank" rel="noopener" class="formula-handle">${f.handle}</a>`
      : (f.handle ? `<span class="formula-handle">${f.handle}</span>` : '');
    const postHtml = f.post_url
      ? `<a href="${f.post_url}" target="_blank" rel="noopener" class="formula-post-link">View post ↗</a>`
      : '';
    container.insertAdjacentHTML('beforeend', `
      <div class="formula-row">
        <div class="formula-quote">${f.quote}</div>
        <div class="formula-meta">
          <span class="badge ${f.type_color} formula-type">${f.type}</span>
          <span class="formula-score">${f.score}</span>
          ${handleHtml}
          ${postHtml}
        </div>
      </div>`);
  });
}

function renderHooks(data) {
  const grid = document.getElementById('three-hooks-grid');
  grid.innerHTML = '';
  data.hooks.forEach((h, i) => {
    grid.insertAdjacentHTML('beforeend', `
      <div class="hook-card">
        <div class="hook-card-num">Hook ${i + 1}</div>
        <div class="hook-card-star">✦</div>
        <div class="hook-card-text">${h.text}</div>
        <div class="hook-card-rationale">${h.rationale}</div>
        <div class="hook-card-pattern">${h.pattern}</div>
      </div>`);
  });
}

function renderTopPosts(data) {
  const grid = document.getElementById('posts-grid');
  grid.innerHTML = '';

  data.top_posts.forEach(p => {
    const stats = [];
    if (p.likes)    stats.push('♥ ' + fmt(p.likes));
    if (p.views)    stats.push('▶ ' + p.views);
    if (p.comments) stats.push('💬 ' + fmt(p.comments));

    const shortcode = p.shortcode || extractShortcode(p.url);

    // Instagram oEmbed blockquote — processed by embed.js
    const embedHtml = shortcode
      ? `<blockquote class="instagram-media"
           data-instgrm-permalink="https://www.instagram.com/p/${shortcode}/?utm_source=ig_embed"
           data-instgrm-version="14"
           style="background:#FFF;border:0;border-radius:3px;
                  box-shadow:0 0 1px 0 rgba(0,0,0,.5),0 1px 10px 0 rgba(0,0,0,.15);
                  margin:1px;max-width:540px;min-width:326px;padding:0;width:calc(100% - 2px);">
           <div style="padding:16px;">
             <a href="https://www.instagram.com/p/${shortcode}/" target="_blank" rel="noopener"
                style="font-size:14px;color:#000;text-decoration:none;">
               Loading post…
             </a>
           </div>
         </blockquote>`
      : `<div class="post-embed-placeholder">
           <div class="embed-icon">📸</div>
           <div class="embed-caption">${p.caption}</div>
           <a href="${p.url}" target="_blank" rel="noopener" class="embed-link">View on Instagram ↗</a>
           <div class="embed-note">Add shortcode to analysis.json to enable embed</div>
         </div>`;

    const handleHtml = p.handle_url
      ? `<a href="${p.handle_url}" target="_blank" rel="noopener" class="post-handle">${p.handle}</a>`
      : `<span class="post-handle">${p.handle}</span>`;

    grid.insertAdjacentHTML('beforeend', `
      <div class="post-card">
        <div class="post-card-header">
          ${handleHtml}
          <div class="post-multiplier">${p.multiplier} baseline</div>
        </div>
        <div class="post-embed-wrap">${embedHtml}</div>
        <div class="post-card-footer">
          <div class="post-caption">${p.caption}</div>
          <div class="post-footer-row">
            <div class="post-stats">${stats.join(' · ')}</div>
            ${p.url ? `<a href="${p.url}" target="_blank" rel="noopener" class="post-view-link">View post ↗</a>` : ''}
          </div>
        </div>
      </div>`);
  });

  // Load / refresh Instagram embed script
  const old = document.getElementById('ig-embed-script');
  if (old) old.remove();
  const s = document.createElement('script');
  s.id = 'ig-embed-script';
  s.src = 'https://www.instagram.com/embed.js';
  s.async = true;
  s.onload = () => { if (window.instgrm) window.instgrm.Embeds.process(); };
  document.body.appendChild(s);
}

function renderAudio(data) {
  const container = document.getElementById('audio-trends-list');
  container.innerHTML = '';

  if (!data.audio_trends || data.audio_trends.length === 0) {
    container.innerHTML = `<div class="empty-state">
      <strong>No audio trend data this cycle</strong>
      Trending audio appears when 2+ watchlist creators use the same track.
    </div>`;
    return;
  }

  data.audio_trends.forEach((a, i) => {
    const num = String(i + 1).padStart(2, '0');
    const musicUrl = a.search_url ||
      `https://open.spotify.com/search/${encodeURIComponent((a.title || '') + ' ' + (a.artist || ''))}`;

    container.insertAdjacentHTML('beforeend', `
      <div class="audio-row">
        <div class="audio-rank">${num}</div>
        <div class="audio-info">
          <div class="audio-title">
            <a href="${musicUrl}" target="_blank" rel="noopener" class="audio-title-link">${a.title} ↗</a>
          </div>
          <div class="audio-artist">${a.artist}</div>
          <div class="audio-meta">
            ${a.uses && a.uses !== '—' ? `<span class="audio-uses">${a.uses}</span>` : ''}
            <span class="audio-creators">${a.creators} creator${a.creators !== 1 ? 's' : ''} on watchlist</span>
            ${a.rising
              ? '<span class="audio-trend-up">↑ Rising</span>'
              : '<span class="audio-trend-flat">Established</span>'}
          </div>
        </div>
      </div>`);
  });
}

function renderAdditionalMetrics(data) {
  const container = document.getElementById('additional-metrics');
  if (!container) return;

  const performers = data.top_performers || [];
  const formats    = data.formats    || [];
  const hooks      = data.hook_types || [];

  const topCreator    = performers[0] ? performers[0].handle    : '—';
  const topMultiplier = performers[0] ? performers[0].multiplier : '—';
  const topFormat     = formats.length ? formats.reduce((a, b) => a.count > b.count ? a : b).name : '—';
  const topHook       = hooks.length   ? hooks[0].name : '—';

  const avgMult = performers.length
    ? (performers.reduce((sum, p) => {
        const n = parseFloat(p.multiplier); return sum + (isNaN(n) ? 0 : n);
      }, 0) / performers.length).toFixed(1) + 'x'
    : '—';

  container.innerHTML = `
    <div class="add-metric">
      <div class="add-metric-val">${topCreator}</div>
      <div class="add-metric-lbl">Top creator this cycle</div>
      <div class="add-metric-sub">${topMultiplier}</div>
    </div>
    <div class="add-metric">
      <div class="add-metric-val">${avgMult}</div>
      <div class="add-metric-lbl">Avg top-performer multiplier</div>
      <div class="add-metric-sub">Top ${performers.length} posts</div>
    </div>
    <div class="add-metric">
      <div class="add-metric-val">${topFormat}</div>
      <div class="add-metric-lbl">Dominant format</div>
      <div class="add-metric-sub">By post count</div>
    </div>
    <div class="add-metric">
      <div class="add-metric-val">${topHook.split('/')[0].trim()}</div>
      <div class="add-metric-lbl">Top hook type</div>
      <div class="add-metric-sub">By frequency across dataset</div>
    </div>`;
}

function renderCitations(data) {
  const container = document.getElementById('citations-list');
  container.innerHTML = '';
  data.citations.forEach(c => {
    container.insertAdjacentHTML('beforeend', `
      <div class="citation-item">
        <div class="citation-num">${c.num}</div>
        <div class="citation-text">
          ${c.text}
          ${c.url ? `<br><a class="citation-url" href="${c.url}" target="_blank" rel="noopener">${c.url}</a>` : ''}
        </div>
      </div>`);
  });
}

/* ------------------------------------------------------------------
   MAIN
   ------------------------------------------------------------------ */
async function init() {
  const data = await loadData();
  renderMeta(data);
  renderStats(data);
  renderTopThemes(data);
  renderHookTypes(data);
  renderFormats(data);
  renderTopPerformers(data);
  renderLanes(data);
  renderEffectiveness(data);
  renderTrendTracker(data);
  renderYourAccount(data);
  renderOpeningFormulas(data);
  renderHooks(data);
  renderTopPosts(data);
  renderAudio(data);
  renderAdditionalMetrics(data);
  renderCitations(data);
}

document.addEventListener('DOMContentLoaded', init);
