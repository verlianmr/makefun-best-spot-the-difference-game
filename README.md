# TWIN HARBOUR — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/verlianmr/makefun-best-spot-the-difference-game/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/verlianmr/makefun-best-spot-the-difference-game/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

An original spot-the-difference game that plays offline in a desktop browser from
static files — no build step, no network request, no library. Two pictures stand side
by side, and they are not quite the same picture: three scenes painted from flat
vector shapes (a harbour at dusk, a market square, a night observatory) hide 21
differences between them — a sun that has set, a sail turned red, a clock that has
slipped from 3:00 to 5:25, a sleeping cat that is simply gone.

Click a difference on either picture to ring it on both. A find pays 100 points, a
miss costs 25, a hint costs 75 and points one out for a moment, and finishing a
picture quickly pays a time bonus. The HUD keeps the count that matters — how many
are left to find — next to the timer, the score and a pip for every difference. Find
them all for the final tally: your score, your grade, and a written recap of every
change, picture by picture.

## Run it

```sh
node serve.ts            # serves game/ at http://localhost:8080 — open it and press ENTER
node main.ts             # the hand-in program: writes game/, screenshots/ and dossier.json to /output
```

## Layout

- `main.ts` — the hand-in program (Node 22, standard library only)
- `vendor/makefun-game.ts` — the kit's dossier library, byte for byte
- `game/index.html` — the page; `game/style.css` — its chrome
- `game/src/config.js` — the field, the panels, the scoring
- `game/src/art.js` — the shared paint box: clouds, gulls, pines, sparkles
- `game/src/scenes.js` — the three pictures, each painted twice from one recipe, and their difference lists
- `game/src/game.js` — the rules: finds, misses, hints, levels, grades
- `game/src/render.js` — HUD, panels, rings, overlays
- `game/src/input.js`, `game/src/audio.js` — pointer and keys; a pocket synth
- `game/src/shots.js` — the deterministic scenes behind `screenshots/`
- `shots.json` — the screenshot scenes, in order

---

<sub>Entered on [make.fun](https://make.fun/?ref=cw40tr4n&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
