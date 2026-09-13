# MAGNET — Small beginnings. Huge appetite.

**[Play the 3D growth prototype](https://dumb-tony.github.io/magnet/)**

Roll a tiny magnet through a sunlit workshop. Bolts become cans, tools, wheels and furniture. Grow big enough to return and swallow the workbench you started on. No delivery bay, countdown or hauling.

- WASD / arrows: roll relative to the camera.
- Space: extend attraction. Eligible objects also stick on contact.
- Shift: shed the latest five pieces and burst forward.
- Q / E or pointer drag: orbit the camera.
- R: restart. Escape: pause. Enter: start/resume/retry. F3: diagnostics.

Open `prototypes/m1/index.html` for offline play with its adjacent `growth.js` and `vendor` folder. Three.js 0.160.1 is bundled locally with its MIT license; no network assets, installation or build step. Desktop keyboard and WebGL required. Optional sound is generated in-browser.

The user's 3D growth pivot supersedes the earlier delivery design. See [docs/PIVOT_3D.md](docs/PIVOT_3D.md) for scope and limitations, and [docs/PLAYTEST_LOG.md](docs/PLAYTEST_LOG.md) for evidence. This is a new core-loop experiment, not a whole-world production game or a passed human playtest gate.

![3D rolling magnet](docs/images/growth-3d.png)

The [previous 2D delivery prototype](https://dumb-tony.github.io/magnet/delivery-2d.html) remains available. Its original GDD and implementation notes are historical. Private source excerpts stay local and ignored.

## Tests

`node tests/growth-browser.cjs` checks keyboard play and a complete tabletop → ramp → floor → workbench run. Set `SHED=1` for the route with deliberate repulsion. `node tests/growth-regression.cjs` checks 300 simulated seconds of stress, 30/60/120 scheduling repeatability, resets, camera controls and denied localStorage.

Tests require installed Playwright (`PLAYWRIGHT_MODULE` override) and Chrome (`CHROME_PATH` override). `GAME_URL` directs the growth browser test to the public deployment. The older physics/browser/controls/stress tests target the preserved 2D file. Raw evidence stays in ignored `test-results/`.

GitHub Pages deploys only `prototypes/m1` from this project's repository.
