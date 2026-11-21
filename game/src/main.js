// main.js — boots TWIN HARBOUR: builds the game, wires input, runs the frame loop and
// keeps the screen-reader status line honest. With ?shot=<name> in the URL it stages
// one of the deterministic screenshot scenes from shots.js instead of the title
// screen, which is how screenshots/ were captured — and how anyone can re-capture them.

import { FIELD } from './config.js';
import { Game } from './game.js';
import { draw } from './render.js';
import { wireInput } from './input.js';
import { Sound } from './audio.js';
import { stageShot } from './shots.js';

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const ctx = canvas.getContext('2d');

const game = new Game();
const sound = new Sound();

const params = new URLSearchParams(location.search);
if (params.has('shot')) stageShot(params.get('shot'), game);

wireInput(canvas, game, sound);
window.__game = game; // for scripted playtests; harmless in play

let last = performance.now();
let lastStatus = '';
function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  game.tick(dt);
  ctx.clearRect(0, 0, FIELD.width, FIELD.height);
  draw(ctx, game);
  const line = game.statusText();
  if (line !== lastStatus) {
    lastStatus = line;
    status.textContent = line;
    document.title = `Twin Harbour — ${line}`;
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
