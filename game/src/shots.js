// shots.js — the deterministic scenes behind screenshots/. Each one stages the real
// game state (same rules, same found-sets a player would have mid-level) and freezes
// the clock, so the frame is exactly what play looks like and the same scene always
// renders the same frame: two pictures side by side, rings on the differences already
// found, the TO FIND counter still counting the rest.
//
//   play   — Harbour at Dusk, two of five found, counter reads 3 TO FIND (the cover)
//   market — Market Square, three of seven found
//   night  — Night Observatory, five of nine found
//   end    — the final tally over the completed observatory, every ring showing

import { SCREEN_GAME_END, SCREEN_PLAY } from './game.js';

function stage(game, levelIndex, foundIds, { score, seconds, mistakes = 0, hints = 0 }) {
  game.reset();
  game.loadLevel(levelIndex);
  game.found = new Set(foundIds);
  game.score = score;
  game.levelSeconds = seconds;
  game.totalSeconds = seconds;
  game.mistakes = mistakes;
  game.hintsUsed = hints;
  game.frozen = true;
  game.screen = SCREEN_PLAY;
}

export function stageShot(name, game) {
  if (name === 'market') {
    stage(game, 1, ['clock', 'cat', 'flowers'], { score: 655, seconds: 96, mistakes: 1, hints: 0 });
    game.totalSeconds = 61 + 96;
    game.levelSeconds = 96;
  } else if (name === 'night') {
    stage(game, 2, ['moon', 'owl', 'comet', 'window', 'lantern'], { score: 1480, seconds: 118, mistakes: 2, hints: 1 });
    game.totalSeconds = 61 + 96 + 118;
    game.levelSeconds = 118;
  } else if (name === 'end') {
    stage(game, 2, ['moon', 'dome', 'owl', 'comet', 'cluster', 'window', 'tree', 'lantern', 'dish'], {
      score: 2475,
      seconds: 163,
      mistakes: 3,
      hints: 1,
    });
    game.totalSeconds = 61 + 96 + 163;
    game.levelSeconds = 163;
    game.screen = SCREEN_GAME_END;
  } else {
    // 'play' and anything else: the cover scene.
    stage(game, 0, ['sun', 'stripe'], { score: 255, seconds: 47, mistakes: 1, hints: 0 });
  }
  return game;
}
