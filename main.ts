// TWIN HARBOUR — Spot the Difference: the hand-in program (Node 22, standard library only).
// The game itself is this directory's game/ folder: plain static files a desktop browser
// loads offline (game/index.html and its ES modules, no library, no network request).
// This program copies game/ and screenshots/ to /output and writes /output/dossier.json
// with the vendored make.fun library, exactly as the bounty's scorer will rebuild it.
//
// Run it the way the grader does, with MAKEFUN_OUTPUT_DIR standing in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Play the game locally with:  node serve.ts   →  http://localhost:8080

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's own caps (from the kit's gate): the dossier text is shaped by
// text_max_bytes alone; the rest refuse an entry the scorer would refuse — more than 4
// screenshots or one over 256 KiB, more than 993 entries or 48 MiB under game/, or a
// path under game/ over 1,000 UTF-8 bytes.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
