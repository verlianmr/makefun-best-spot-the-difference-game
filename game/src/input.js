// input.js — turns raw pointer and keyboard events into game verbs. A pointer position
// is converted from CSS pixels to the logical field, then — if it lands in a picture
// panel — to scene coordinates, which is the only language game.js speaks. The HUD's
// hint button and the overlay screens get their clicks here too.

import { FIELD, HINT_BUTTON, PANELS, SCENE } from './config.js';
import { SCREEN_PLAY, SCREEN_TITLE } from './game.js';

export function toField(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * FIELD.width,
    y: ((event.clientY - rect.top) / rect.height) * FIELD.height,
  };
}

/** Which panel a field point is in, and where in scene coordinates; null outside both. */
export function panelAt(x, y) {
  for (let i = 0; i < PANELS.length; i += 1) {
    const p = PANELS[i];
    if (x >= p.x && x < p.x + SCENE && y >= p.y && y < p.y + SCENE) {
      return { panel: i, x: x - p.x, y: y - p.y };
    }
  }
  return null;
}

function inRect(x, y, r) {
  return x >= r.x && x < r.x + r.width && y >= r.y && y < r.y + r.height;
}

/**
 * Wire a canvas to a game. Callbacks let main.js make sounds without input.js knowing
 * about audio: onFind/onMiss/onLevel fire after the matching game event.
 */
export function wireInput(canvas, game, sound, hooks = {}) {
  canvas.addEventListener('pointerdown', (event) => {
    sound.unlock();
    const { x, y } = toField(canvas, event);
    if (game.screen === SCREEN_TITLE) {
      game.start();
      return;
    }
    if (game.screen !== SCREEN_PLAY) {
      game.advance();
      return;
    }
    if (inRect(x, y, HINT_BUTTON)) {
      if (game.hint()) sound.tone?.(1200, 0, 0.1);
      return;
    }
    const hit = panelAt(x, y);
    if (!hit) return;
    const before = game.screen;
    const result = game.click(hit.panel, hit.x, hit.y);
    if (result === 'found') {
      sound.find();
      hooks.onFind?.();
      if (game.screen !== before) sound.level();
    } else if (result === 'miss') {
      sound.miss();
      hooks.onMiss?.();
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      sound.unlock();
      if (game.screen === SCREEN_TITLE) game.start();
      else game.advance();
    } else if ((event.key === 'h' || event.key === 'H') && game.screen === SCREEN_PLAY) {
      sound.unlock();
      game.hint();
    }
  });
}
