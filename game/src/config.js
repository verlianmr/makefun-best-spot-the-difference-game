// config.js — the stage TWIN HARBOUR plays on: one fixed logical field, two picture
// panels side by side, and the scoring every rule agrees on. Nothing here knows how a
// scene is painted or how a click lands; it is the shared ruler for render and input.

export const FIELD = { width: 1280, height: 720 };

/** The HUD strip across the top: title, level, the to-find counter, timer, score. */
export const HUD = { height: 64 };

/** Each picture is a square scene; the two panels sit under the HUD with a gap between. */
export const SCENE = 584;
export const PANELS = [
  { x: 32, y: 104, label: 'ORIGINAL' },
  { x: 664, y: 104, label: 'THE COPY' },
];
export const PANEL_LABEL_Y = 92;

/** Scoring: a find pays, a miss and a hint cost, a fast level pays a time bonus. */
export const SCORE = {
  find: 100,
  miss: -25,
  hint: -75,
  timeBonusMax: 300,
};

/** How near a click must land to a difference's centre, in scene pixels, to count. */
export const CLICK_RADIUS_PAD = 6;

/** The hint button drawn in the HUD (render.js draws it, input.js hits it). */
export const HINT_BUTTON = { x: 1152, y: 14, width: 104, height: 36 };

/** Grades for the final tally, best first: [minimum total score, letter]. */
export const GRADES = [
  [2300, 'S'],
  [1800, 'A'],
  [1250, 'B'],
  [0, 'C'],
];
