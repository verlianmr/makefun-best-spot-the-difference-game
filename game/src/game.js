// game.js — the rules of TWIN HARBOUR, with no idea how anything is drawn: which level
// is on, which differences are found, what a click earns or costs, and when a level —
// and the game — is over. Render reads this state; input feeds it clicks. Time only
// advances through tick(), and never while a screenshot scene is staged (frozen), so a
// staged frame is the same frame forever.

import { CLICK_RADIUS_PAD, GRADES, SCORE } from './config.js';
import { SCENES } from './scenes.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_LEVEL_END = 'levelEnd';
export const SCREEN_GAME_END = 'gameEnd';

export class Game {
  constructor() {
    this.reset();
  }

  reset() {
    this.screen = SCREEN_TITLE;
    this.levelIndex = 0;
    this.score = 0;
    this.mistakes = 0;
    this.hintsUsed = 0;
    this.totalSeconds = 0;
    this.frozen = false;
    this.wrongMarks = []; // {panel, x, y, ttl} — scene coordinates, fade out
    this.hintMark = null; // {x, y, ttl} — scene coordinates
    this.loadLevel(0);
  }

  loadLevel(index) {
    this.levelIndex = index;
    this.found = new Set();
    this.levelSeconds = 0;
    this.bonusGiven = false;
    this.wrongMarks = [];
    this.hintMark = null;
  }

  get scene() {
    return SCENES[this.levelIndex];
  }

  get remaining() {
    return this.scene.diffs.length - this.found.size;
  }

  start() {
    if (this.screen === SCREEN_TITLE) this.screen = SCREEN_PLAY;
  }

  /** Advance the clock and fade transient marks. dt in seconds. */
  tick(dt) {
    if (this.frozen) return;
    if (this.screen === SCREEN_PLAY) {
      this.levelSeconds += dt;
      this.totalSeconds += dt;
    }
    for (const mark of this.wrongMarks) mark.ttl -= dt;
    this.wrongMarks = this.wrongMarks.filter((m) => m.ttl > 0);
    if (this.hintMark) {
      this.hintMark.ttl -= dt;
      if (this.hintMark.ttl <= 0) this.hintMark = null;
    }
  }

  /**
   * A click on a panel, in scene coordinates. Returns 'found' with the difference,
   * 'already' for one found before, or 'miss'. Clicks on either panel count — the two
   * pictures show the same places.
   */
  click(panel, x, y) {
    if (this.screen !== SCREEN_PLAY) return 'ignored';
    let nearest = null;
    let nearestDist = Infinity;
    for (const diff of this.scene.diffs) {
      const dist = Math.hypot(diff.x - x, diff.y - y);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = diff;
      }
    }
    if (nearest && nearestDist <= nearest.r + CLICK_RADIUS_PAD) {
      if (this.found.has(nearest.id)) return 'already';
      this.found.add(nearest.id);
      this.score += SCORE.find;
      if (this.remaining === 0) this.finishLevel();
      return 'found';
    }
    this.mistakes += 1;
    this.score = Math.max(0, this.score + SCORE.miss);
    this.wrongMarks.push({ panel, x, y, ttl: 0.9 });
    return 'miss';
  }

  finishLevel() {
    if (!this.bonusGiven) {
      this.bonusGiven = true;
      this.score += Math.max(0, SCORE.timeBonusMax - Math.floor(this.levelSeconds));
    }
    this.screen = this.levelIndex === SCENES.length - 1 ? SCREEN_GAME_END : SCREEN_LEVEL_END;
  }

  /** Spend points to have one unfound difference pointed out for a moment. */
  hint() {
    if (this.screen !== SCREEN_PLAY || this.frozen) return null;
    const open = this.scene.diffs.filter((d) => !this.found.has(d.id));
    if (open.length === 0) return null;
    const pick = open[Math.floor(Math.random() * open.length)];
    this.hintsUsed += 1;
    this.score = Math.max(0, this.score + SCORE.hint);
    this.hintMark = { x: pick.x, y: pick.y, ttl: 1.8 };
    return pick;
  }

  /** ENTER on an end screen: next level, or a fresh game from the final tally. */
  advance() {
    if (this.screen === SCREEN_LEVEL_END) {
      this.loadLevel(this.levelIndex + 1);
      this.screen = SCREEN_PLAY;
    } else if (this.screen === SCREEN_GAME_END) {
      this.reset();
      this.screen = SCREEN_PLAY;
    } else if (this.screen === SCREEN_TITLE) {
      this.start();
    }
  }

  grade() {
    for (const [min, letter] of GRADES) if (this.score >= min) return letter;
    return 'C';
  }

  /** One line for the screen-reader status and the page title. */
  statusText() {
    const s = this.scene;
    if (this.screen === SCREEN_TITLE) return `Twin Harbour. ${SCENES.length} pictures, ${SCENES.reduce((n, sc) => n + sc.diffs.length, 0)} differences in all. Press Enter to start.`;
    if (this.screen === SCREEN_PLAY) return `${s.name}: ${this.found.size} of ${s.diffs.length} differences found, ${this.remaining} to find. Score ${this.score}.`;
    if (this.screen === SCREEN_LEVEL_END) return `${s.name} complete. Score ${this.score}. Press Enter for the next picture.`;
    return `All pictures complete. Final score ${this.score}, grade ${this.grade()}. Press Enter to play again.`;
  }
}
