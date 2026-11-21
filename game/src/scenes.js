// scenes.js — the three pictures of TWIN HARBOUR, each painted twice from one recipe:
// the ORIGINAL exactly as written, and THE COPY with a handful of quiet mutations
// applied. A scene is a painter function plus the list of its differences (centre and
// radius in scene pixels, and what changed, which the end-of-level recap reads aloud).
// Every scene is drawn from flat vector shapes with seeded detail — no photographs, no
// external art — so both panels are original work and pixel-stable between runs.

import { circle, cloud, ellipse, gull, lcg, line, pine, poly, rect, roundRect, sky, sparkle } from './art.js';

const S = 584; // scene edge, matches config.SCENE

/* ------------------------------------------------------------------ */
/* Level 1 — Harbour at Dusk                                           */
/* ------------------------------------------------------------------ */

function paintHarbour(ctx, mut) {
  sky(ctx, S, 384, [[0, '#26355e'], [0.55, '#8a4460'], [0.85, '#d97b4a'], [1, '#eda45f']]);
  // Early stars, faint in the upper sky.
  const stars = lcg(41);
  ctx.fillStyle = 'rgba(255,244,214,0.5)';
  for (let i = 0; i < 26; i += 1) ctx.fillRect(stars() * S, stars() * 130, 2, 2);
  // The sun, low over the water — the copy has let it set already.
  if (!mut.has('sun')) {
    const glow = ctx.createRadialGradient(430, 300, 8, 430, 300, 110);
    glow.addColorStop(0, 'rgba(255,214,138,0.85)');
    glow.addColorStop(1, 'rgba(255,214,138,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(310, 180, 240, 220);
    circle(ctx, 430, 300, 44, '#ffd98a');
    circle(ctx, 430, 300, 35, '#ffe7ae');
  }
  cloud(ctx, 118, 92, 1, 'rgba(250,199,160,0.9)');
  cloud(ctx, 300, 58, 0.8, 'rgba(240,180,150,0.8)');
  cloud(ctx, 486, 138, 0.9, 'rgba(250,199,160,0.75)');
  // Sea.
  rect(ctx, 0, 384, S, 200, '#2a4d68');
  const ripples = lcg(97);
  ctx.fillStyle = 'rgba(255,205,150,0.35)';
  for (let i = 0; i < 42; i += 1) {
    const y = 396 + ripples() * 176;
    ctx.fillRect(ripples() * S, y, 14 + ripples() * 30, 2);
  }
  // Sun glitter path on the water.
  if (!mut.has('sun')) {
    ctx.fillStyle = 'rgba(255,214,138,0.4)';
    for (let i = 0; i < 9; i += 1) ctx.fillRect(404 + (i % 3) * 18 - i * 1.5, 392 + i * 20, 44 - i * 3, 4);
  }
  // Rocks and the lighthouse on the left point.
  poly(ctx, [[0, 430], [40, 392], [96, 384], [150, 402], [168, 430], [168, 452], [0, 452]], '#3d3444');
  poly(ctx, [[0, 452], [168, 452], [168, 470], [0, 470]], '#2c2534');
  // Lighthouse tower: tapered, two red stripes — the copy lost the lower one.
  poly(ctx, [[64, 384], [72, 208], [108, 208], [116, 384]], '#f2ead8');
  poly(ctx, [[68, 292], [112, 292], [110, 268], [70, 268]], '#c8402f');
  if (!mut.has('stripe')) poly(ctx, [[71, 340], [109, 340], [107, 316], [73, 316]], '#c8402f');
  rect(ctx, 70, 196, 40, 14, '#333');
  rect(ctx, 78, 168, 24, 28, '#2b2b33');
  circle(ctx, 90, 182, 8, '#ffe9a3');
  poly(ctx, [[62, 168], [118, 168], [90, 146]], '#8c2f23');
  // Lamp beam sweeping right.
  const beam = ctx.createLinearGradient(102, 182, 300, 210);
  beam.addColorStop(0, 'rgba(255,233,163,0.5)');
  beam.addColorStop(1, 'rgba(255,233,163,0)');
  ctx.fillStyle = beam;
  poly(ctx, [[102, 174], [300, 196], [300, 226], [102, 190]]);
  // The big sailboat, centre-left. Its sail is white here, red in the copy.
  ctx.fillStyle = 'rgba(20,30,44,0.35)';
  ctx.fillRect(168, 486, 140, 6);
  poly(ctx, [[176, 452], [300, 452], [282, 480], [192, 480]], '#6e4525');
  rect(ctx, 182, 444, 112, 8, '#8a5a30');
  line(ctx, 238, 452, 238, 348, '#4a3220', 5);
  poly(ctx, [[244, 356], [244, 442], [196, 442]], mut.has('sail') ? '#d8402f' : '#f5efe0');
  poly(ctx, [[232, 368], [232, 442], [272, 442]], '#e8dfc8');
  poly(ctx, [[238, 348], [262, 356], [238, 364]], '#e8b53a');
  // A small blue boat to the right.
  poly(ctx, [[438, 478], [522, 478], [508, 498], [452, 498]], '#2f5d8a');
  line(ctx, 480, 478, 480, 428, '#4a3220', 4);
  poly(ctx, [[485, 434], [485, 472], [458, 472]], '#f5efe0');
  // Shore houses on the right, roofs against the dusk.
  const houses = [
    [404, 330, 56, 54, '#7a4a3a'],
    [452, 318, 64, 66, '#5d4a68'],
    [508, 334, 58, 50, '#74584a'],
  ];
  for (const [hx, hy, hw, hh, fill] of houses) {
    rect(ctx, hx, hy, hw, hh, fill);
    poly(ctx, [[hx - 6, hy], [hx + hw + 6, hy], [hx + hw / 2, hy - 26]], '#3a2c33');
  }
  rect(ctx, 0, 384, S, 4, 'rgba(0,0,0,0.18)');
  // House windows: the middle house glows — in the copy it has gone dark.
  rect(ctx, 418, 348, 12, 14, '#ffd98a');
  if (mut.has('window')) rect(ctx, 470, 340, 14, 16, '#241f2e');
  else rect(ctx, 470, 340, 14, 16, '#ffd98a');
  rect(ctx, 524, 352, 12, 14, '#ffd98a');
  rect(ctx, 476, 362, 4, 22, '#241f2e');
  // The pier, bottom centre.
  rect(ctx, 250, 520, 150, 10, '#5d4128');
  for (const px of [258, 300, 344, 386]) rect(ctx, px, 520, 8, 44, '#4a3220');
  // Seagulls — and one more of them in the copy.
  gull(ctx, 150, 152, 15, '#2e2a38');
  gull(ctx, 214, 122, 12, '#2e2a38');
  gull(ctx, 522, 92, 13, '#2e2a38');
  if (mut.has('gull')) gull(ctx, 350, 172, 14, '#2e2a38');
}

/* ------------------------------------------------------------------ */
/* Level 2 — Market Square                                             */
/* ------------------------------------------------------------------ */

function paintMarket(ctx, mut) {
  sky(ctx, S, 300, [[0, '#a8d8ee'], [1, '#dff2f7']]);
  cloud(ctx, 100, 56, 0.9, 'rgba(255,255,255,0.95)');
  cloud(ctx, 452, 40, 1.1, 'rgba(255,255,255,0.9)');
  // Back row of rooftops.
  poly(ctx, [[0, 210], [70, 160], [150, 210]], '#b06a4a');
  poly(ctx, [[420, 210], [500, 152], [584, 210]], '#9a5a44');
  rect(ctx, 0, 208, 150, 92, '#e3c9a2');
  rect(ctx, 434, 208, 150, 92, '#dec39e');
  // The clock tower, centre back.
  rect(ctx, 258, 96, 68, 204, '#cbb59a');
  rect(ctx, 258, 96, 68, 10, '#b39a78');
  poly(ctx, [[250, 96], [334, 96], [292, 52]], '#7a4a3a');
  circle(ctx, 292, 132, 33, '#f7f1de');
  ctx.strokeStyle = '#5d4a33';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(292, 132, 33, 0, Math.PI * 2);
  ctx.stroke();
  // Clock hands: three o'clock here; the copy's tower has let time slip to 5:25.
  const hands = mut.has('clock')
    ? [[292, 132, 292 + 15, 132 + 15], [292, 132, 292 - 6, 132 - 24]]
    : [[292, 132, 292 + 24, 132], [292, 132, 292, 132 - 17]];
  for (const [x1, y1, x2, y2] of hands) line(ctx, x1, y1, x2, y2, '#33302a', 4);
  circle(ctx, 292, 132, 4, '#33302a');
  rect(ctx, 280, 236, 24, 64, '#6e4525');
  // Bunting across the top: two swags of triangle flags.
  const flagCols = ['#d8402f', '#e8b53a', '#3f7fbf', '#4d9e57', '#e2703a'];
  const swag = (x0, x1, top, sag, phase) => {
    ctx.strokeStyle = 'rgba(70,55,40,0.65)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x0, top);
    ctx.quadraticCurveTo((x0 + x1) / 2, top + sag, x1, top);
    ctx.stroke();
    for (let i = 0; i < 9; i += 1) {
      const t = (i + 0.5) / 9;
      const fx = x0 + (x1 - x0) * t;
      const fy = top + 2 * sag * t * (1 - t) + 2;
      let col = flagCols[(i + phase) % flagCols.length];
      // One flag on the right swag changed colour in the copy.
      if (mut.has('flag') && phase === 3 && i === 5) col = '#e56aa0';
      poly(ctx, [[fx - 9, fy], [fx + 9, fy], [fx, fy + 18]], col);
    }
  };
  swag(16, 268, 18, 44, 0);
  swag(316, 568, 18, 44, 3);
  // Plaza cobbles.
  rect(ctx, 0, 300, S, 284, '#c9b18c');
  const cob = lcg(7);
  ctx.fillStyle = 'rgba(120,95,60,0.25)';
  for (let i = 0; i < 130; i += 1) {
    ellipse(ctx, cob() * S, 312 + cob() * 262, 12 + cob() * 12, 5 + cob() * 4, 'rgba(120,95,60,0.18)');
  }
  // The fountain, centre.
  ellipse(ctx, 292, 452, 104, 26, '#8fa8b5');
  ellipse(ctx, 292, 446, 104, 26, '#b9d2dc');
  ellipse(ctx, 292, 444, 88, 20, '#7fb6cf');
  rect(ctx, 284, 384, 16, 52, '#9db3ba');
  ellipse(ctx, 292, 384, 30, 10, '#b9d2dc');
  circle(ctx, 292, 362, 13, '#9db3ba');
  ctx.strokeStyle = 'rgba(190,225,240,0.9)';
  ctx.lineWidth = 3;
  for (const dx of [-20, 0, 20]) {
    ctx.beginPath();
    ctx.arc(292 + dx * 0.4, 408, 20, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }
  // Left stall, red-and-white awning, crates and a vendor.
  rect(ctx, 36, 300, 10, 108, '#6e4525');
  rect(ctx, 178, 300, 10, 108, '#6e4525');
  for (let i = 0; i < 6; i += 1) poly(ctx, [[30 + i * 27, 262], [57 + i * 27, 262], [63 + i * 27, 292], [24 + i * 27, 292]], i % 2 ? '#f5efe0' : '#d8402f');
  rect(ctx, 30, 292, 164, 8, '#8a5a30');
  circle(ctx, 112, 322, 13, '#e8b58c');
  rect(ctx, 99, 334, 26, 34, '#3f7fbf');
  for (const [cx, cy] of [[52, 388], [88, 392], [130, 386], [166, 392]]) circle(ctx, cx, cy, 10, '#e2703a');
  rect(ctx, 44, 402, 34, 28, '#a97c50');
  rect(ctx, 84, 406, 34, 24, '#96703f');
  // The cat asleep on a crate — the copy has woken it and it is gone.
  rect(ctx, 84, 388, 40, 18, '#a97c50');
  if (!mut.has('cat')) {
    ellipse(ctx, 105, 384, 17, 8, '#5a5a66');
    circle(ctx, 90, 378, 7, '#5a5a66');
    poly(ctx, [[85, 374], [89, 374], [87, 366]], '#5a5a66');
    poly(ctx, [[91, 374], [95, 374], [93, 366]], '#5a5a66');
    ctx.strokeStyle = '#5a5a66';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(122, 380, 7, Math.PI * 0.9, Math.PI * 1.9);
    ctx.stroke();
  }
  // Right stall: green awning here, purple in the copy.
  rect(ctx, 398, 300, 10, 108, '#6e4525');
  rect(ctx, 540, 300, 10, 108, '#6e4525');
  const awn = mut.has('awning') ? '#7a4a9e' : '#4d9e57';
  for (let i = 0; i < 6; i += 1) poly(ctx, [[392 + i * 27, 262], [419 + i * 27, 262], [425 + i * 27, 292], [386 + i * 27, 292]], i % 2 ? '#f5efe0' : awn);
  rect(ctx, 392, 292, 164, 8, '#8a5a30');
  for (const [cx, cy] of [[420, 388], [458, 392], [496, 386], [528, 392]]) circle(ctx, cx, cy, 10, '#7fb069');
  rect(ctx, 470, 402, 34, 28, '#a97c50');
  rect(ctx, 512, 406, 34, 24, '#96703f');
  // Flower pots along the front: the left pot blooms red here, blue in the copy.
  const pot = (x, flower) => {
    poly(ctx, [[x - 14, 486], [x + 14, 486], [x + 10, 512], [x - 10, 512]], '#b45a32');
    for (const [dx, dy] of [[-9, -8], [0, -13], [9, -8], [-4, -3], [5, -3]]) circle(ctx, x + dx, 482 + dy, 6, flower);
    circle(ctx, x, 486, 9, '#4d7c43');
  };
  pot(150, mut.has('flowers') ? '#3f7fbf' : '#d8402f');
  pot(434, '#e8b53a');
  // A café table, front right — with an umbrella here; the copy lost it.
  if (!mut.has('umbrella')) {
    line(ctx, 470, 470, 470, 402, '#5d4a33', 4);
    poly(ctx, [[424, 408], [516, 408], [470, 372]], '#e2703a');
    circle(ctx, 470, 372, 5, '#5d4a33');
  }
  ellipse(ctx, 470, 472, 34, 9, '#f0e6d2');
  rect(ctx, 466, 472, 8, 30, '#8a8a92');
  circle(ctx, 452, 466, 6, '#fff');
  circle(ctx, 488, 466, 6, '#c8402f');
  // Two lamp posts. The right one's globe has vanished in the copy.
  const lamp = (x, withGlobe) => {
    rect(ctx, x - 3, 300, 6, 108, '#3c4048');
    line(ctx, x, 300, x, 282, '#3c4048', 5);
    if (withGlobe) {
      circle(ctx, x, 272, 11, '#f7e8b0');
      ctx.strokeStyle = '#3c4048';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, 272, 11, 0, Math.PI * 2);
      ctx.stroke();
    }
  };
  lamp(60, true);
  lamp(524, !mut.has('lamp'));
}

/* ------------------------------------------------------------------ */
/* Level 3 — Night Observatory                                         */
/* ------------------------------------------------------------------ */

function paintObservatory(ctx, mut) {
  sky(ctx, S, S, [[0, '#070d24'], [0.6, '#14224a'], [1, '#1d2f57']]);
  // Stars, two seeded fields, and a faint milky-way band.
  const st = lcg(1234);
  for (let i = 0; i < 150; i += 1) {
    const a = 0.25 + st() * 0.75;
    ctx.fillStyle = `rgba(235,240,255,${a.toFixed(2)})`;
    ctx.fillRect(st() * S, st() * 400, st() > 0.9 ? 3 : 2, st() > 0.9 ? 3 : 2);
  }
  ctx.fillStyle = 'rgba(160,180,230,0.07)';
  for (let i = 0; i < 26; i += 1) ellipse(ctx, 60 + i * 20, 210 - i * 6, 42, 13, 'rgba(160,180,230,0.07)');
  // A bright little cluster — only the copy has it.
  if (mut.has('cluster')) {
    sparkle(ctx, 330, 140, 12, '#fff6d8');
    sparkle(ctx, 306, 122, 7, '#dfe9ff');
    sparkle(ctx, 354, 126, 7, '#dfe9ff');
    sparkle(ctx, 318, 162, 6, '#dfe9ff');
    sparkle(ctx, 346, 160, 6, '#fff6d8');
  }
  // A shooting star streaks the original; the copy's sky is still.
  if (!mut.has('comet')) {
    const g = ctx.createLinearGradient(96, 128, 196, 92);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(1, 'rgba(255,255,255,0.95)');
    ctx.strokeStyle = g;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(96, 128);
    ctx.lineTo(196, 92);
    ctx.stroke();
    circle(ctx, 198, 91, 3.5, '#fff');
  }
  // The moon: a crescent here; the copy shows it full.
  circle(ctx, 480, 96, 34, '#f2ecd8');
  if (!mut.has('moon')) circle(ctx, 464, 84, 30, '#0d1531');
  circle(ctx, 492, 106, 6, 'rgba(180,170,140,0.5)');
  circle(ctx, 472, 118, 4, 'rgba(180,170,140,0.5)');
  // Hills.
  poly(ctx, [[0, 420], [120, 372], [300, 402], [440, 378], [584, 418], [584, 584], [0, 584]], '#16263f');
  poly(ctx, [[0, 470], [180, 428], [380, 458], [584, 440], [584, 584], [0, 584]], '#101d33');
  // The observatory on the left hill: dome, and a telescope at its slit.
  rect(ctx, 84, 318, 152, 84, '#5a6a86');
  rect(ctx, 84, 318, 152, 10, '#47536b');
  ctx.fillStyle = '#8fa2c4';
  ctx.beginPath();
  ctx.arc(160, 318, 78, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.13)';
  ctx.beginPath();
  ctx.arc(160, 318, 78, Math.PI * 1.08, Math.PI * 1.55);
  ctx.lineTo(160, 318);
  ctx.fill();
  if (!mut.has('dome')) {
    rect(ctx, 152, 238, 15, 82, '#0a1122');
    line(ctx, 168, 262, 226, 224, '#c8d4ea', 11);
    line(ctx, 168, 262, 226, 224, '#5a6a86', 15);
    line(ctx, 174, 258, 224, 226, '#e8eefc', 8);
    circle(ctx, 228, 223, 7, '#9fb6dd');
  }
  rect(ctx, 146, 356, 28, 46, '#2c3850');
  circle(ctx, 166, 380, 3, '#e8b53a');
  // The winding path from the bottom to the observatory door.
  poly(ctx, [[272, 584], [316, 584], [306, 520], [262, 478], [238, 436], [196, 404], [176, 402], [206, 438], [232, 482], [258, 524]], '#3d4f6e');
  // Lanterns along the path, warm in the dark. One has gone out in the copy.
  const lantern = (x, y, lit) => {
    rect(ctx, x - 2, y - 16, 4, 34, '#232c40');
    if (lit) {
      const glow = ctx.createRadialGradient(x, y - 22, 2, x, y - 22, 26);
      glow.addColorStop(0, 'rgba(255,205,110,0.8)');
      glow.addColorStop(1, 'rgba(255,205,110,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(x - 26, y - 48, 52, 52);
      rect(ctx, x - 6, y - 30, 12, 15, '#ffca6a');
    } else {
      rect(ctx, x - 6, y - 30, 12, 15, '#39445e');
    }
    poly(ctx, [[x - 9, y - 30], [x + 9, y - 30], [x, y - 38]], '#232c40');
  };
  lantern(262, 470, true);
  lantern(318, 502, !mut.has('lantern'));
  lantern(276, 544, true);
  // The cottage on the right.
  rect(ctx, 402, 392, 138, 84, '#4c3a30');
  poly(ctx, [[392, 392], [550, 392], [476, 344]], '#2c2118');
  rect(ctx, 458, 428, 26, 48, '#241a12');
  // Its lit window glows here; in the copy the room is dark.
  if (mut.has('window')) rect(ctx, 424, 404, 26, 24, '#1a2438');
  else {
    rect(ctx, 424, 404, 26, 24, '#ffca6a');
    line(ctx, 437, 404, 437, 428, '#4c3a30', 3);
    line(ctx, 424, 416, 450, 416, '#4c3a30', 3);
  }
  rect(ctx, 492, 404, 26, 24, '#1a2438');
  // A satellite dish on the cottage roof — the copy's roof is bare.
  if (!mut.has('dish')) {
    line(ctx, 520, 362, 520, 378, '#8fa2c4', 4);
    ctx.fillStyle = '#c8d4ea';
    ctx.beginPath();
    ctx.arc(520, 356, 15, Math.PI * 0.95, Math.PI * 1.95);
    ctx.fill();
    line(ctx, 520, 356, 506, 340, '#c8d4ea', 3);
    circle(ctx, 505, 339, 3, '#e8eefc');
  }
  // Pine trees on the hills — one of them is missing in the copy.
  pine(ctx, 300, 448, 74, '#1d3a2a');
  if (!mut.has('tree')) pine(ctx, 352, 462, 62, '#1d3a2a');
  pine(ctx, 52, 500, 84, '#1a3325');
  pine(ctx, 556, 500, 70, '#1d3a2a');
  pine(ctx, 246, 428, 46, '#1a3325');
  // The owl on its branch, right side — flown away in the copy.
  line(ctx, 584, 176, 512, 196, '#3a2c1e', 8);
  line(ctx, 540, 188, 528, 210, '#3a2c1e', 5);
  if (!mut.has('owl')) {
    ellipse(ctx, 516, 172, 13, 18, '#8a6a48');
    circle(ctx, 516, 152, 11, '#a3805a');
    circle(ctx, 512, 152, 4.5, '#f2ecd8');
    circle(ctx, 520, 152, 4.5, '#f2ecd8');
    circle(ctx, 512, 152, 2, '#14100c');
    circle(ctx, 520, 152, 2, '#14100c');
    poly(ctx, [[513, 157], [519, 157], [516, 161]], '#e8b53a');
    poly(ctx, [[504, 140], [510, 144], [503, 148]], '#8a6a48');
    poly(ctx, [[522, 144], [528, 140], [529, 148]], '#8a6a48');
  }
  // Fireflies over the front grass, in both.
  const ff = lcg(55);
  for (let i = 0; i < 12; i += 1) circle(ctx, 30 + ff() * 524, 500 + ff() * 66, 2, 'rgba(255,230,140,0.75)');
}

/* ------------------------------------------------------------------ */

export const SCENES = [
  {
    id: 'harbour',
    name: 'Harbour at Dusk',
    sub: 'Level 1 of 3 · 5 differences',
    paint: paintHarbour,
    diffs: [
      { id: 'sun', x: 430, y: 300, r: 42, what: 'the sun has set' },
      { id: 'sail', x: 224, y: 400, r: 37, what: 'the big sail turned red' },
      { id: 'stripe', x: 90, y: 328, r: 29, what: "the lighthouse's lower stripe vanished" },
      { id: 'window', x: 477, y: 348, r: 23, what: 'a lit window went dark' },
      { id: 'gull', x: 350, y: 170, r: 25, what: 'one more seagull' },
    ],
  },
  {
    id: 'market',
    name: 'Market Square',
    sub: 'Level 2 of 3 · 7 differences',
    paint: paintMarket,
    diffs: [
      { id: 'clock', x: 292, y: 132, r: 37, what: 'the clock slipped from 3:00 to 5:25' },
      { id: 'awning', x: 474, y: 277, r: 44, what: 'the green awning turned purple' },
      { id: 'cat', x: 103, y: 380, r: 26, what: 'the sleeping cat is gone' },
      { id: 'flag', x: 470, y: 48, r: 23, what: 'a bunting flag turned pink' },
      { id: 'flowers', x: 150, y: 486, r: 26, what: 'the red flowers turned blue' },
      { id: 'umbrella', x: 470, y: 404, r: 37, what: "the café umbrella vanished" },
      { id: 'lamp', x: 524, y: 276, r: 24, what: "the lamp post's globe is missing" },
    ],
  },
  {
    id: 'observatory',
    name: 'Night Observatory',
    sub: 'Level 3 of 3 · 9 differences',
    paint: paintObservatory,
    diffs: [
      { id: 'moon', x: 480, y: 96, r: 38, what: 'the crescent moon is full' },
      { id: 'dome', x: 168, y: 288, r: 42, what: 'the dome closed over its telescope' },
      { id: 'owl', x: 516, y: 164, r: 28, what: 'the owl has flown away' },
      { id: 'comet', x: 152, y: 106, r: 32, what: 'the shooting star is gone' },
      { id: 'cluster', x: 330, y: 142, r: 32, what: 'a new star cluster appeared' },
      { id: 'window', x: 437, y: 416, r: 22, what: "the cottage's lit window went dark" },
      { id: 'tree', x: 352, y: 428, r: 32, what: 'a pine tree is missing' },
      { id: 'lantern', x: 318, y: 478, r: 24, what: 'a path lantern went out' },
      { id: 'dish', x: 518, y: 354, r: 24, what: "the cottage's satellite dish vanished" },
    ],
  },
];
