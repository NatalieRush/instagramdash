/* ============================================================
   CreatorIntel — Natalie Rushman Photography
   app.js — reads analysis.json (or falls back to SAMPLE_DATA)
   ============================================================ */

/* ------------------------------------------------------------------
   SAMPLE DATA
   Replace with real data by running the weekly analysis pipeline
   and saving output to analysis.json in the repo root.
   ------------------------------------------------------------------ */
const SAMPLE_DATA = {
  meta: {
    generated: "2026-05-11T00:00:00Z",
    cycle: "May 5 – May 11, 2026",
    watchlist_count: 42,
    posts_analysed: 1047,
    creators_active: 38,
    engagement_avg: "4.2%"
  },
  stats: [
    { num: "1,047", sup: null, label: "Posts tracked" },
    { num: "19", sup: null, label: "Creators above baseline" },
    { num: "4.2%", sup: null, label: "Avg engagement rate" },
    { num: "12", sup: null, label: "Trend clusters" }
  ],
  top_themes: [
    { label: "Travel destination storytelling", count: 87, pct: 95 },
    { label: "Behind-the-scenes / shoot day", count: 71, pct: 78 },
    { label: "Hotel & property experience", count: 64, pct: 70 },
    { label: "Natural light technique", count: 52, pct: 57 },
    { label: "Slow travel & digital nomad life", count: 48, pct: 53 },
    { label: "Visual identity for brands", count: 41, pct: 45 },
    { label: "Seasonal / location mood", count: 39, pct: 43 },
    { label: "Client results / transformation", count: 28, pct: 31 }
  ],
  hook_types: [
    { name: "POV / Scene-setting", count: 214, pct: 100 },
    { name: "Contrarian / Hot take", count: 178, pct: 83 },
    { name: "Authority / Expertise", count: 156, pct: 73 },
    { name: "Relatability / Shared experience", count: 142, pct: 66 },
    { name: "Curiosity gap / Withhold", count: 119, pct: 56 },
    { name: "Before / After reveal", count: 94, pct: 44 },
    { name: "Direct address / You-framing", count: 87, pct: 41 }
  ],
  formats: [
    { name: "Reel", pill: "pill-reel", count: 489 },
    { name: "Carousel", pill: "pill-carousel", count: 341 },
    { name: "Single Image", pill: "pill-image", count: 217 }
  ],
  top_performers: [
    {
      handle: "@novemberstudio.co",
      caption: "\"Nobody told me a 35mm film look would book me 3 luxury hotels in one month.\"",
      type: "Reel", type_pill: "pill-reel",
      likes: 3847, views: 91200, comments: 142,
      multiplier: "4.1x baseline"
    },
    {
      handle: "@helloemilie",
      caption: "\"I fired my highest-paying client. Here's what happened to my income.\"",
      type: "Carousel", type_pill: "pill-carousel",
      likes: 2934, comments: 198,
      multiplier: "3.8x baseline"
    },
    {
      handle: "@kelseyinlondon",
      caption: "\"London isn't the city people say it is. It's better — you just have to know where.\"",
      type: "Reel", type_pill: "pill-reel",
      likes: 5621, views: 134000, comments: 311,
      multiplier: "3.2x baseline"
    },
    {
      handle: "@rocioprezg",
      caption: "\"POV: You show up to a Relais & Châteaux property with a mirrorless and a 50mm.\"",
      type: "Reel", type_pill: "pill-reel",
      likes: 2108, views: 67400, comments: 89,
      multiplier: "2.9x baseline"
    },
    {
      handle: "@prettylittlemarketer",
      caption: "\"Your hotel isn't losing bookings because your product is bad. It's this.\"",
      type: "Carousel", type_pill: "pill-carousel",
      likes: 4102, comments: 267,
      multiplier: "2.7x baseline"
    }
  ],
  saturated: [
    { text: "\"Travel tips\" list carousels", sub: "Overused format across all 4 creator categories this cycle" },
    { text: "Sunrise / golden hour solo shots with no narrative", sub: "High volume, declining engagement — audiences tuning out" },
    { text: "Gear unboxing / what's in my bag reels", sub: "Photographer niche specific — saturation at peak" },
    { text: "\"Day in my life\" vlog-style reels without strong hook", sub: "Needs a contrarian or POV angle to break through now" }
  ],
  underused: [
    { text: "Hotel experience from the guest POV (not photographer)", sub: "Only 3 creators doing this — engagement 2.4x above niche average" },
    { text: "Contrarian takes on luxury hospitality marketing", sub: "High engagement ceiling, almost no competition in your watchlist" },
    { text: "Before/after: client's old visuals vs. yours", sub: "Proof-of-concept format — undersupplied vs. demand signal" },
    { text: "Slow travel + remote work lifestyle (non-aesthetic)", sub: "Authenticity angle cutting through in travel creator segment" }
  ],
  effectiveness: [
    { rank: 1, label: "Contrarian / Hot take", score: "5.41", pct: 100 },
    { rank: 2, label: "POV / Scene-setting", score: "4.28", pct: 79 },
    { rank: 3, label: "Curiosity gap", score: "4.21", pct: 78 },
    { rank: 4, label: "Authority", score: "4.01", pct: 74 },
    { rank: 5, label: "Before / After", score: "3.88", pct: 72 },
    { rank: 6, label: "Direct address", score: "3.45", pct: 64 }
  ],
  trend_tracker: [
    { label: "Hotel interior storytelling", delta: "+14%", dir: "up" },
    { label: "Contrarian creator economy takes", delta: "+11%", dir: "up" },
    { label: "Natural light education", delta: "+6%", dir: "up" },
    { label: "Generic travel inspiration", delta: "-9%", dir: "down" },
    { label: "Gear & tech content", delta: "-12%", dir: "down" },
    { label: "Day-in-the-life vlogs", delta: "flat", dir: "flat" }
  ],
  your_account: [
    { num: "—", label: "Followers" },
    { num: "—", label: "Avg reach" },
    { num: "—", label: "Posts this week" },
    { num: "—", label: "Top post ×" }
  ],
  opening_formulas: [
    {
      quote: "\"Nobody told me [contrarian truth about your niche]...\"",
      type: "Contrarian", type_color: "badge-red",
      score: "5.4x avg baseline"
    },
    {
      quote: "\"POV: your [client type] wants to [desirable outcome]\"",
      type: "POV", type_color: "badge-purple",
      score: "4.3x avg baseline"
    },
    {
      quote: "\"I fired my [highest-paying / most prestigious] client. Here's why.\"",
      type: "Contrarian", type_color: "badge-red",
      score: "3.8x avg baseline"
    },
    {
      quote: "\"There are two types of [photographers / hotels / brands]. Most only have one.\"",
      type: "Curiosity gap", type_color: "badge-blue",
      score: "3.6x avg baseline"
    },
    {
      quote: "\"[Number] things I wish I knew before [pivotal career/travel moment]\"",
      type: "Authority", type_color: "badge-green",
      score: "3.2x avg baseline"
    }
  ],
  hooks: [
    {
      text: "\"Nobody told me shooting natural light in a £700/night hotel room would close more clients than any pitch deck I've ever sent.\"",
      rationale: "Contrarian authority hybrid — uses the top-performing formula from this cycle, grounds it in your Forbes Five-Star background, and directly addresses your target client's world. Modelled on @novemberstudio.co's 4.1x baseline reel.",
      pattern: "Contrarian + Proof"
    },
    {
      text: "\"POV: You've just checked into a Relais & Châteaux property and your photographer knows exactly what the light is doing at 4pm.\"",
      rationale: "POV scene-setting — pulls the viewer into the client experience rather than the photographer's. Trending format with 3.2x baseline ceiling in hospitality segment this cycle. Works as reel opening text or carousel cover.",
      pattern: "POV + Scene"
    },
    {
      text: "\"Your hotel's visuals are speaking. The question is whether they're saying 'book now' or 'maybe later.'\"",
      rationale: "Direct address curiosity gap — opens with tension without giving the answer. Strong carousel cover format. Positions you as strategic partner, not just shooter. Aligned with your 'pretty doesn't sell, strategy does' content pillar.",
      pattern: "Curiosity gap + Direct address"
    }
  ],
  top_posts: [
    {
      handle: "@novemberstudio.co",
      url: "https://www.instagram.com/novemberstudio.co/",
      multiplier: "4.1x",
      caption: "35mm film look for luxury hotel work",
      likes: 3847, views: "91.2K", comments: 142
    },
    {
      handle: "@helloemilie",
      url: "https://www.instagram.com/helloemilie/",
      multiplier: "3.8x",
      caption: "Fired my highest-paying client",
      likes: 2934, comments: 198
    },
    {
      handle: "@kelseyinlondon",
      url: "https://www.instagram.com/kelseyinlondon/",
      multiplier: "3.2x",
      caption: "London — where you actually need to go",
      likes: 5621, views: "134K", comments: 311
    }
  ],
  audio_trends: [
    {
      title: "Espresso",
      artist: "Sabrina Carpenter",
      uses: "14,200 reels",
      creators: 6,
      rising: true
    },
    {
      title: "Golden Hour (Slowed)",
      artist: "JVKE",
      uses: "8,900 reels",
      creators: 5,
      rising: true
    },
    {
      title: "La Vie en Rose (Piano Cover)",
      artist: "Various",
      uses: "21,400 reels",
      creators: 9,
      rising: false
    },
    {
      title: "Original Audio — voiceover only",
      artist: "Multiple creators",
      uses: "—",
      creators: 11,
      rising: true
    },
    {
      title: "Clair de Lune (Debussy)",
      artist: "Various",
      uses: "6,200 reels",
      creators: 4,
      rising: true
    }
  ],
  citations: [
    {
      num: 1,
      text: "Instagram Post Scraper — Apify. Public post data for all watchlist accounts.",
      url: "https://apify.com/apify/instagram-post-scraper"
    },
    {
      num: 2,
      text: "Instagram Reel Scraper — Apify. Transcript and audio metadata for spoken-audio reels.",
      url: "https://apify.com/apify/instagram-reel-scraper"
    },
    {
      num: 3,
      text: "Document Text Detection — Google Cloud Vision API. On-screen text from carousel covers and reel thumbnails.",
      url: "https://cloud.google.com/vision/docs/ocr"
    },
    {
      num: 4,
      text: "Engagement baseline methodology: each creator's median engagement over their last 25 posts. Multiplier = post engagement ÷ creator median.",
      url: null
    },
    {
      num: 5,
      text: "Analysis layer: Claude (Anthropic). Hook classification, theme clustering, open lane identification, and hook generation.",
      url: "https://claude.ai"
    }
  ]
};

/* ------------------------------------------------------------------
   INIT — load analysis.json if available, fall back to sample data
   ------------------------------------------------------------------ */
async function loadData() {
  try {
    const res = await fetch('./analysis.json?t=' + Date.now());
    if (!res.ok) throw new Error('No analysis.json found');
    return await res.json();
  } catch {
    console.log('Using sample data — run the pipeline to generate analysis.json');
    return SAMPLE_DATA;
  }
}

/* ------------------------------------------------------------------
   RENDER HELPERS
   ------------------------------------------------------------------ */
function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

function fmt(n) {
  if (n === undefined || n === null) return '—';
  if (typeof n === 'string') return n;
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toLocaleString();
}

/* ------------------------------------------------------------------
   SECTION RENDERERS
   ------------------------------------------------------------------ */
function renderMeta(data) {
  const d = new Date(data.meta.generated);
  const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('date-chip').textContent =
    'Generated ' + d.toLocaleDateString('en-US', opts);
  document.getElementById('live-label').textContent =
    'Live · cycle ' + data.meta.cycle;
  document.getElementById('creator-count').textContent =
    data.meta.watchlist_count;
  document.getElementById('footer-date').textContent =
    'Cycle: ' + data.meta.cycle;
}

function renderStats(data) {
  const row = document.getElementById('stat-row');
  row.innerHTML = '';
  data.stats.forEach(s => {
    const item = el('div', 'stat-item');
    item.innerHTML = `
      <div class="stat-num">${s.num}${s.sup ? '<sup>' + s.sup + '</sup>' : ''}</div>
      <div class="stat-label">${s.label}</div>`;
    row.appendChild(item);
  });
}

function renderTopThemes(data) {
  const el2 = document.getElementById('top-themes-list');
  el2.innerHTML = '';
  const max = data.top_themes[0].count;
  data.top_themes.forEach(t => {
    const pct = Math.round((t.count / max) * 100);
    el2.insertAdjacentHTML('beforeend', `
      <div class="theme-row">
        <div class="theme-label">${t.label}</div>
        <div class="theme-bar-wrap"><div class="theme-bar" style="width:${pct}%"></div></div>
        <div class="theme-count">${t.count}</div>
      </div>`);
  });
}

function renderHookTypes(data) {
  const el2 = document.getElementById('hook-types-list');
  el2.innerHTML = '';
  data.hook_types.forEach(h => {
    el2.insertAdjacentHTML('beforeend', `
      <div class="hook-row">
        <div class="hook-name">${h.name}</div>
        <div class="hook-bar-wrap"><div class="hook-bar" style="width:${h.pct}%"></div></div>
        <div class="hook-count">${h.count}</div>
      </div>`);
  });
}

function renderFormats(data) {
  const el2 = document.getElementById('formats-list');
  el2.innerHTML = '';
  const total = data.formats.reduce((a, f) => a + f.count, 0);
  data.formats.forEach(f => {
    const pct = Math.round((f.count / total) * 100);
    el2.insertAdjacentHTML('beforeend', `
      <div class="format-row">
        <span class="format-pill ${f.pill}">${f.name}</span>
        <div class="format-name">${pct}%</div>
        <div class="format-count">${f.count}</div>
      </div>`);
  });
}

function renderTopPerformers(data) {
  const el2 = document.getElementById('top-performers-list');
  el2.innerHTML = '';
  data.top_performers.forEach(p => {
    const stats = [];
    if (p.likes) stats.push('♥ ' + fmt(p.likes));
    if (p.views) stats.push('▶ ' + fmt(p.views));
    if (p.comments) stats.push('💬 ' + fmt(p.comments));
    el2.insertAdjacentHTML('beforeend', `
      <div class="performer-row">
        <div class="performer-handle">${p.handle}</div>
        <div class="performer-caption">${p.caption}</div>
        <div class="performer-meta">
          <span class="performer-multiplier">${p.multiplier}</span>
          <span class="performer-type ${p.type_pill}">${p.type}</span>
          <div style="margin-top:5px">${stats.join(' · ')}</div>
        </div>
      </div>`);
  });
}

function renderLanes(data) {
  const sat = document.getElementById('saturated-list');
  const und = document.getElementById('underused-list');
  sat.innerHTML = '';
  und.innerHTML = '';
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
  const el2 = document.getElementById('effectiveness-list');
  el2.innerHTML = '';
  data.effectiveness.forEach(e2 => {
    el2.insertAdjacentHTML('beforeend', `
      <div class="eff-row">
        <div class="eff-rank">${e2.rank}</div>
        <div class="eff-label">${e2.label}</div>
        <div class="eff-bar-wrap"><div class="eff-bar" style="width:${e2.pct}%"></div></div>
        <div class="eff-score">${e2.score}</div>
      </div>`);
  });
}

function renderTrendTracker(data) {
  const el2 = document.getElementById('trend-tracker-list');
  el2.innerHTML = '';
  data.trend_tracker.forEach(t => {
    const cls = t.dir === 'up' ? 'trend-up' : t.dir === 'down' ? 'trend-down' : 'trend-flat';
    const arrow = t.dir === 'up' ? '↑ ' : t.dir === 'down' ? '↓ ' : '→ ';
    el2.insertAdjacentHTML('beforeend', `
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
  const el2 = document.getElementById('opening-formulas-list');
  el2.innerHTML = '';
  data.opening_formulas.forEach(f => {
    el2.insertAdjacentHTML('beforeend', `
      <div class="formula-row">
        <div class="formula-quote">${f.quote}</div>
        <div class="formula-meta">
          <span class="badge ${f.type_color} formula-type">${f.type}</span>
          <span class="formula-score">${f.score}</span>
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
    if (p.likes) stats.push('♥ ' + fmt(p.likes));
    if (p.views) stats.push('▶ ' + p.views);
    if (p.comments) stats.push('💬 ' + fmt(p.comments));

    // Build Instagram oEmbed or fallback link
    const embedHtml = `
      <div class="post-embed-placeholder">
        <div style="font-size:32px;margin-bottom:10px">📸</div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:12px;font-style:italic">${p.caption}</div>
        <a href="${p.url}" target="_blank" rel="noopener">View on Instagram ↗</a>
        <div style="font-size:10px;color:var(--muted-2);margin-top:8px">
          Embed loads when post URL is added to analysis.json
        </div>
      </div>`;

    grid.insertAdjacentHTML('beforeend', `
      <div class="post-card">
        <div class="post-card-header">
          <div class="post-handle">${p.handle}</div>
          <div class="post-multiplier">${p.multiplier} baseline</div>
        </div>
        <div class="post-embed-wrap">${embedHtml}</div>
        <div class="post-card-footer">
          ${p.caption}
          <div class="post-stats">${stats.join('<span class="post-stat"> · </span>')}</div>
        </div>
      </div>`);
  });

  // Load Instagram embed script for any real embeds added later
  if (!document.getElementById('ig-embed-script')) {
    const s = document.createElement('script');
    s.id = 'ig-embed-script';
    s.src = 'https://www.instagram.com/embed.js';
    s.async = true;
    document.body.appendChild(s);
  }
}

function renderAudio(data) {
  const el2 = document.getElementById('audio-trends-list');
  el2.innerHTML = '';
  data.audio_trends.forEach((a, i) => {
    el2.insertAdjacentHTML('beforeend', `
      <div class="audio-row">
        <div class="audio-rank">0${i + 1}</div>
        <div class="audio-info">
          <div class="audio-title">${a.title}</div>
          <div class="audio-artist">${a.artist}</div>
          <div class="audio-meta">
            ${a.uses !== '—' ? `<span class="audio-uses">${a.uses}</span>` : ''}
            <span class="audio-creators">${a.creators} creators on your watchlist</span>
            ${a.rising ? '<span class="audio-trend-up">↑ Rising</span>' : ''}
          </div>
        </div>
      </div>`);
  });
}

function renderCitations(data) {
  const el2 = document.getElementById('citations-list');
  el2.innerHTML = '';
  data.citations.forEach(c => {
    el2.insertAdjacentHTML('beforeend', `
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
  renderCitations(data);
}

document.addEventListener('DOMContentLoaded', init);
