# MAGNET — Small core. Huge mess.

**[Play Magnet](https://dumb-tony.github.io/magnet/)**

Build a lopsided rolling pile around a magnet that stays 64 cm across. The attached metal creates the larger shape—no growing center ball.

Explore the workshop, salvage yard, street, city, railworks and dry docks. Six milestones lead from a workbench to a locomotive and a cargo freighter. Keep exploring afterward. 790 objects, 34 types, 22 crushed variants and eight optional Field notes objectives.

[Inspect all 34 detailed objects](https://dumb-tony.github.io/magnet/showroom.html) · [Object art notes](docs/OBJECT_ART.md)

![Detailed workshop objects](docs/images/detail-workshop.png)

## Controls

- WASD / arrows: roll relative to the camera.
- Space: attraction (hold or toggle in Options).
- Q / E or drag: orbit the camera.
- F: nudge without shedding. Shift: shed recent pieces and burst.
- Backspace: recover the intact pile in an open area.
- Escape: pause and save. R: restart. Enter: start/resume.

Click Field notes for optional discovery goals, or the collection count for the checklist. Click an unlocked district on the map (or Options → Travel) to return with your entire pile. The map shows your pile and next milestone. Options include reduced motion, low graphics, automatic unsticking and save controls. Runs autosave locally; Continue saved pile appears after reloading.

## Offline and earlier prototypes

Open `prototypes/m1/index.html` with its adjacent JavaScript files and `vendor` folder. No installation, build step or external requests. WebGL and desktop keyboard required. Three.js is locally bundled with its MIT license.

[First 3D experiment](https://dumb-tony.github.io/magnet/growth-first.html) · [Original 2D delivery experiment](https://dumb-tony.github.io/magnet/delivery-2d.html)

See [docs/DISTRICTS.md](docs/DISTRICTS.md) for current design/limitations and [docs/PLAYTEST_LOG.md](docs/PLAYTEST_LOG.md) for evidence. Historical design notes remain preserved. Private source excerpts and raw diagnostics remain local and ignored.

## Tests

- `node tests/detail-browser.cjs`: all 34 model bounds and geometry reuse, mesh batching, gallery controls, crushed previews and narrow viewport.

- `node tests/adventure-browser.cjs`: complete six-district route, immutable attachments, continued late-game play and frame sample. `DIGITAL=1` quantizes the replay to keyboard-style directions; `GAME_URL` targets deployment.
- `node tests/adventure-regression.cjs`: fixed core, shape contacts, rocking supports, saves, recovery, repulsion, 600 simulated stress seconds, repeatability, options and input checks.
- `node tests/adventure-storage.cjs`: reload/continue with exact attachment poses, clear save, offline request check and storage-denied play.

Browser tests need an installed Playwright (`PLAYWRIGHT_MODULE`) and Chrome (`CHROME_PATH`). Test dependencies are not required by players. Older tests target the archived prototypes.

GitHub Pages publishes only `prototypes/m1` from this project's own repository. Human feel and comprehension remain open gates; automation is not a claim that those passed.

Visual update: [distinct surfaces and permanent crushed models](docs/CRUSHING.md).

Expansion notes: [Railworks, dry docks, Field notes and saved-run compatibility](docs/RAIL_AND_DOCKS.md).
