// art.js — the shared paint box: small deterministic drawing helpers every scene in
// scenes.js reaches for. No state lives here; each helper takes the canvas context and
// plain numbers, so a scene painted twice with the same inputs is pixel-identical —
// which is what makes the two panels honestly comparable and the screenshots stable.

/** A tiny seeded random source (LCG), so star fields and cobbles never change between runs. */
export function lcg(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

export function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

export function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

export function roundRect(ctx, x, y, w, h, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

export function poly(ctx, points, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

export function line(ctx, x1, y1, x2, y2, stroke, width) {
  ctx.strokeStyle = stroke;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

/** A soft cartoon cloud: three overlapping ellipses on a flat base. */
export function cloud(ctx, x, y, scale, fill) {
  ellipse(ctx, x, y, 46 * scale, 17 * scale, fill);
  ellipse(ctx, x - 26 * scale, y + 4 * scale, 28 * scale, 12 * scale, fill);
  ellipse(ctx, x + 28 * scale, y + 4 * scale, 30 * scale, 13 * scale, fill);
  ellipse(ctx, x + 2 * scale, y - 10 * scale, 26 * scale, 14 * scale, fill);
}

/** A four-point sparkle star, the kind a night sky wants. */
export function sparkle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}

/** A seagull as two arcs — the harbour's shorthand for a bird. */
export function gull(ctx, x, y, size, stroke) {
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2.4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(x - size * 0.55, y, size * 0.55, Math.PI * 1.15, Math.PI * 1.95);
  ctx.arc(x + size * 0.55, y, size * 0.55, Math.PI * 1.05, Math.PI * 1.85);
  ctx.stroke();
}

/** A pine tree: three stacked triangles on a short trunk, centred on x, base at y. */
export function pine(ctx, x, y, h, fill, trunk = '#4a3220') {
  const w = h * 0.36;
  rect(ctx, x - h * 0.03, y - h * 0.12, h * 0.06, h * 0.12, trunk);
  poly(ctx, [[x - w / 2, y - h * 0.08], [x + w / 2, y - h * 0.08], [x, y - h * 0.55]], fill);
  poly(ctx, [[x - w * 0.4, y - h * 0.38], [x + w * 0.4, y - h * 0.38], [x, y - h * 0.8]], fill);
  poly(ctx, [[x - w * 0.28, y - h * 0.64], [x + w * 0.28, y - h * 0.64], [x, y - h]], fill);
}

/** Vertical gradient sky from top colour to horizon colour, over the top `h` pixels. */
export function sky(ctx, w, h, stops) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  for (const [at, colour] of stops) g.addColorStop(at, colour);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}
