const data = {
  overview: {
    creatorsTracked: 35,
    postsLast48h: 0,
    topThemes: ["Luxury stillness", "Destination fantasy", "Design detail", "Behind-the-scenes"],
    topFormats: ["Reels", "Carousels", "Single images"]
  },
  watchlist: [
    "@novemberstudio.co", "@rocioprezg", "@_lagiuditta", "@helloemilie", "@raz_kind",
    "@jameslloydcole", "@nicolasqnphotography", "@dpc_photography_", "@adriana_maria_",
    "@sliceofpai", "@hayleykelsingphotography", "@austinrutland", "@creativebykera",
    "@leanderhoefler", "@birch", "@relaischateaux", "@belmond", "@rosewoodcastigliondelbosco",
    "@aman", "@thenewtinsomerset", "@thehoxtonhotel", "@domaines.de.chabran", "@estellemanor",
    "@borgosantopietro", "@reschio", "@ritzparis", "@tenutadimurlo", "@thelibraguide",
    "@thehero_w9", "@prettylittlemarketer", "@juliabroome", "@onbrandmag", "@thecreative.social",
    "@seventhhousemarketing", "@postcardsbyhannah", "@simplyslowtraveler", "@kelseyinlondon",
    "@therollinson", "@theremoteconcept", "@augustopro", "@vanessadaylife", "@joselyn.hana"
  ],
  performers: [
    { name: "@belmond", signal: "High emotional resonance + premium visual consistency" },
    { name: "@relaischateaux", signal: "Strong storytelling across property and experience" },
    { name: "@rosewoodcastigliondelbosco", signal: "Elegant format discipline and clear luxury cues" }
  ],
  converters: [
    { name: "@aman", signal: "High-intent brand positioning and destination desirability" },
    { name: "@thenewtinsomerset", signal: "Strong conversion-friendly experiential storytelling" },
    { name: "@ritzparis", signal: "Authority, prestige, and recognizable booking intent" }
  ],
  themes: ["Luxury stillness", "Slow travel", "Sensory dining", "Architectural detail", "Guest experience", "Cinematic transitions"],
  hooks: ["Curiosity", "Aspiration", "Transformation", "Behind-the-scenes", "Authority", "Sensory immersion"],
  formats: ["Reels 46%", "Carousels 31%", "Single images 18%", "Other 5%"],
  saturated: ["Sunset-luxury reels", "Generic 'hidden gem' hooks", "Overly polished room tours", "Travel montage with no narrative"],
  underused: ["Guest journey POV", "Editorial micro-stories", "Staff-led storytelling", "Quiet luxury details", "Cultural ritual framing"],
  posts: [
    { creator: "@belmond", title: "Luxury story format", meta: "Cinematic, emotional, place-led, high share potential" },
    { creator: "@aman", title: "Destination fantasy", meta: "Strong aspiration and booking intent" },
    { creator: "@thenewtinsomerset", title: "Experiential sequence", meta: "High brand depth and sensory framing" },
    { creator: "@relaischateaux", title: "Property narrative", meta: "Rich in scene-setting and hospitality detail" }
  ],
  opportunity: "Your strongest lane is editorial hospitality storytelling that feels intimate, cinematic, and design-literate without becoming generic or overly promotional. The most underused opportunities are guest-journey POV, staff-led narrative, and quiet-luxury detail sequences that build desire without sounding like ads."
};

const el = id => document.getElementById(id);

function metric(label, value, desc){
  return `<div class="metric"><div class="label">${label}</div><div class="value">${value}</div><div class="desc">${desc}</div></div>`;
}

el("overview-metrics").innerHTML = [
  metric("Creators tracked", data.overview.creatorsTracked, "Selected creators across photography, hospitality, strategy, and travel."),
  metric("Posts last 48h", data.overview.postsLast48h, "Live count once data is connected."),
  metric("Top themes", data.overview.topThemes.length, data.overview.topThemes.join(" · ")),
  metric("Top formats", data.overview.topFormats.length, data.overview.topFormats.join(" · "))
].join("");

el("watchlist-summary").innerHTML = `
  <p>This watchlist includes ${data.watchlist.length} creators across your core niche. The dashboard is designed to compare emotional tone, visual cadence, hook style, and commercial signal across the set.</p>
  <p class="tag">Luxury hospitality</p><p class="tag">Travel</p><p class="tag">Lifestyle</p><p class="tag">Creative brands</p>
`;

el("top-performers").innerHTML = `<ul class="list">${data.performers.map(p => `<li><strong>${p.name}</strong><br>${p.signal}</li>`).join("")}</ul>`;
el("top-converters").innerHTML = `<ul class="list">${data.converters.map(p => `<li><strong>${p.name}</strong><br>${p.signal}</li>`).join("")}</ul>`;
el("dominant-themes").innerHTML = `<ul class="list">${data.themes.map(t => `<li>${t}</li>`).join("")}</ul>`;
el("hook-types").innerHTML = `<ul class="list">${data.hooks.map(t => `<li>${t}</li>`).join("")}</ul>`;
el("format-mix").innerHTML = `<ul class="list">${data.formats.map(t => `<li>${t}</li>`).join("")}</ul>`;
el("saturated-lanes").innerHTML = `<ul class="list">${data.saturated.map(t => `<li>${t}</li>`).join("")}</ul>`;
el("underused-lanes").innerHTML = `<ul class="list">${data.underused.map(t => `<li>${t}</li>`).join("")}</ul>`;
el("post-gallery").innerHTML = data.posts.map(p => `
  <div class="post">
    <div class="title">${p.creator}</div>
    <div class="meta"><strong>${p.title}</strong><br>${p.meta}</div>
  </div>
`).join("");
el("opportunity-brief").innerHTML = `<p>${data.opportunity}</p>`;
