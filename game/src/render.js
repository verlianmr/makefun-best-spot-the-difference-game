// render.js — every pixel of TWIN HARBOUR: the HUD (level, the big TO FIND counter,
// timer, score), the two picture panels painted from scenes.js, the rings on found
// differences, the fading crosses on misses, and the title / level-complete / final
// overlays. It only reads game state — the rules live in game.js.

import { FIELD, HINT_BUTTON, HUD, PANELS, PANEL_LABEL_Y, SCENE } from './config.js';
import { SCENES } from './scenes.js';
import { SCREEN_GAME_END, SCREEN_LEVEL_END, SCREEN_TITLE } from './game.js';

const INK = '#eef2f8';
const DIM = '#9fb0c3';
const PAPER = '#141c2c';
const ACCENT = '#ffc94d';
const FOUND = '#7ee787';

function fmtTime(sec) {
  const s = Math.floor(sec);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function text(ctx, str, x, y, font, fill, align = 'left') {
  ctx.font = font;
  ctx.fillStyle = fill;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}

function drawPanel(ctx, game, panel, mutated) {
  const scene = game.scene;
  ctx.save();
  ctx.beginPath();
  ctx.rect(panel.x, panel.y, SCENE, SCENE);
  ctx.clip();
  ctx.translate(panel.x, panel.y);
  scene.paint(ctx, mutated);
  ctx.restore();
  // Found differences are ringed on BOTH panels — that is how a player checks a find.
  for (const diff of scene.diffs) {
    if (!game.found.has(diff.id)) continue;
    const x = panel.x + diff.x;
    const y = panel.y + diff.y;
    ctx.strokeStyle = 'rgba(10,20,10,0.55)';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(x, y, diff.r * 0.72, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = FOUND;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(x, y, diff.r * 0.72, 0, Math.PI * 2);
    ctx.stroke();
    text(ctx, '✓', x, y - diff.r * 0.72 - 2, '700 15px system-ui', FOUND, 'center');
  }
  // The hint ring breathes on both panels, like a find does.
  if (game.hintMark) {
    const m = game.hintMark;
    const pulse = 1 + 0.12 * Math.sin(performance.now() / 130);
    ctx.strokeStyle = ACCENT;
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.arc(panel.x + m.x, panel.y + m.y, 30 * pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  // Misses flash a red cross on the panel that was clicked, then fade.
  for (const mark of game.wrongMarks) {
    if (mark.panel !== (mutated ? 1 : 0)) continue;
    const x = panel.x + mark.x;
    const y = panel.y + mark.y;
    ctx.strokeStyle = `rgba(255,84,84,${Math.max(0, mark.ttl).toFixed(2)})`;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    const r = 13;
    ctx.beginPath();
    ctx.moveTo(x - r, y - r);
    ctx.lineTo(x + r, y + r);
    ctx.moveTo(x + r, y - r);
    ctx.lineTo(x - r, y + r);
    ctx.stroke();
  }
  // Frame and label.
  ctx.strokeStyle = '#3d4f6e';
  ctx.lineWidth = 3;
  ctx.strokeRect(panel.x, panel.y, SCENE, SCENE);
  text(ctx, panel.label, panel.x + SCENE / 2, PANEL_LABEL_Y, '600 15px system-ui', DIM, 'center');
}

function drawHud(ctx, game) {
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, FIELD.width, HUD.height);
  ctx.fillStyle = '#232f47';
  ctx.fillRect(0, HUD.height - 2, FIELD.width, 2);
  text(ctx, 'TWIN HARBOUR', 32, 22, '800 19px system-ui', INK);
  text(ctx, game.scene.name, 32, 47, '500 13px system-ui', DIM);
  // Progress pips for this level's differences.
  const diffs = game.scene.diffs;
  for (let i = 0; i < diffs.length; i += 1) {
    const x = 268 + i * 22;
    ctx.beginPath();
    ctx.arc(x, 32, 7, 0, Math.PI * 2);
    if (game.found.has(diffs[i].id)) {
      ctx.fillStyle = FOUND;
      ctx.fill();
    } else {
      ctx.strokeStyle = DIM;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
  // The counter the whole game turns on.
  const label = game.remaining === 0 ? 'ALL FOUND' : `${game.remaining} TO FIND`;
  ctx.fillStyle = game.remaining === 0 ? '#1d4630' : '#3a2c10';
  ctx.beginPath();
  ctx.roundRect(520, 12, 240, 40, 20);
  ctx.fill();
  text(ctx, label, 640, 33, '800 21px system-ui', game.remaining === 0 ? FOUND : ACCENT, 'center');
  // Timer, score, mistakes.
  text(ctx, `TIME ${fmtTime(game.screen === 'play' || game.screen === 'levelEnd' || game.screen === 'gameEnd' ? game.totalSeconds : 0)}`, 800, 33, '600 16px system-ui', INK);
  text(ctx, `SCORE ${game.score}`, 948, 33, '700 16px system-ui', INK);
  text(ctx, `✕ ${game.mistakes}`, 1096, 33, '600 16px system-ui', '#ff8484', 'center');
  // Hint button.
  ctx.fillStyle = '#232f47';
  ctx.beginPath();
  ctx.roundRect(HINT_BUTTON.x, HINT_BUTTON.y, HINT_BUTTON.width, HINT_BUTTON.height, 8);
  ctx.fill();
  ctx.strokeStyle = DIM;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  text(ctx, 'HINT −75', HINT_BUTTON.x + HINT_BUTTON.width / 2, HINT_BUTTON.y + HINT_BUTTON.height / 2 + 1, '700 14px system-ui', ACCENT, 'center');
}

function overlay(ctx, alpha = 0.62) {
  ctx.fillStyle = `rgba(8,12,22,${alpha})`;
  ctx.fillRect(0, HUD.height, FIELD.width, FIELD.height - HUD.height);
}

function panel(ctx, x, y, w, h) {
  ctx.fillStyle = 'rgba(16,24,40,0.92)';
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 14);
  ctx.fill();
  ctx.strokeStyle = '#3d4f6e';
  ctx.lineWidth = 2;
  ctx.stroke();
}

export function draw(ctx, game) {
  ctx.fillStyle = '#0b1120';
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);
  drawPanel(ctx, game, PANELS[0], new Set());
  drawPanel(ctx, game, PANELS[1], new Set(game.scene.diffs.map((d) => d.id)));
  drawHud(ctx, game);

  if (game.screen === SCREEN_TITLE) {
    overlay(ctx);
    text(ctx, 'TWIN HARBOUR', 640, 268, '800 64px system-ui', INK, 'center');
    text(ctx, 'SPOT THE DIFFERENCE', 640, 318, '700 26px system-ui', ACCENT, 'center');
    text(ctx, 'Two pictures, side by side. They are not quite the same picture.', 640, 372, '400 19px system-ui', INK, 'center');
    text(ctx, `Three scenes — harbour, market, observatory — and ${SCENES.reduce((n, s) => n + s.diffs.length, 0)} differences hiding in them.`, 640, 402, '400 19px system-ui', DIM, 'center');
    text(ctx, 'Click a difference on either picture. A find pays 100, a miss costs 25, a hint costs 75.', 640, 448, '400 17px system-ui', DIM, 'center');
    text(ctx, 'Press ENTER or click to start', 640, 512, '700 21px system-ui', FOUND, 'center');
  }

  if (game.screen === SCREEN_LEVEL_END) {
    overlay(ctx);
    panel(ctx, 390, 250, 500, 220);
    text(ctx, `${game.scene.name} — complete!`, 640, 306, '800 28px system-ui', INK, 'center');
    text(ctx, `All ${game.scene.diffs.length} differences found in ${fmtTime(game.levelSeconds)}.`, 640, 348, '400 18px system-ui', DIM, 'center');
    text(ctx, `Score so far: ${game.score}`, 640, 384, '700 20px system-ui', ACCENT, 'center');
    text(ctx, 'Press ENTER for the next picture', 640, 432, '600 17px system-ui', FOUND, 'center');
  }

  if (game.screen === SCREEN_GAME_END) {
    overlay(ctx, 0.7);
    panel(ctx, 340, 140, 600, 478);
    text(ctx, 'YOU FOUND THEM ALL', 640, 188, '800 34px system-ui', INK, 'center');
    text(ctx, `Final score ${game.score} · Grade ${game.grade()}`, 640, 232, '800 24px system-ui', ACCENT, 'center');
    text(ctx, `Time ${fmtTime(game.totalSeconds)} · Mistakes ${game.mistakes} · Hints ${game.hintsUsed}`, 640, 266, '400 17px system-ui', DIM, 'center');
    ctx.fillStyle = DIM;
    ctx.fillRect(420, 286, 440, 1);
    let y = 312;
    text(ctx, 'What changed, picture by picture:', 640, y, '600 15px system-ui', INK, 'center');
    y += 26;
    // Each scene's changes, word-wrapped to the panel: a recap a player can actually read.
    ctx.font = '400 13px system-ui';
    for (const scene of SCENES) {
      text(ctx, scene.name, 640, y, '700 14px system-ui', ACCENT, 'center');
      y += 17;
      const words = `${scene.diffs.map((d) => d.what).join('; ')}.`.split(' ');
      let lineStr = '';
      for (const word of words) {
        const trial = lineStr ? `${lineStr} ${word}` : word;
        if (ctx.measureText(trial).width > 520 && lineStr) {
          text(ctx, lineStr, 640, y, '400 13px system-ui', DIM, 'center');
          y += 16;
          lineStr = word;
        } else lineStr = trial;
      }
      if (lineStr) text(ctx, lineStr, 640, y, '400 13px system-ui', DIM, 'center');
      y += 24;
    }
    text(ctx, 'Press ENTER to play again', 640, 648, '600 16px system-ui', FOUND, 'center');
  }
}
