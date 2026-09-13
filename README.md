# Magnet

One-room, single-player magnet physics prototype. Collect physical metal, carry its awkward shape, shed it, and deliver 20 mass units.

**[Play Magnet](https://dumb-tony.github.io/magnet/)** — keyboard required.

For offline play, open `prototypes/m1/index.html` directly in a browser. No build, installation, network, fonts or external assets required.

- Read [GDD.md](GDD.md) for the comprehensive design and scope.
- Read [docs/PROTOTYPE_M1.md](docs/PROTOTYPE_M1.md) for the standalone HTML mechanic test and acceptance gates.
- Record actual test evidence in [docs/PLAYTEST_LOG.md](docs/PLAYTEST_LOG.md).
- Design provenance is preserved locally in `docs/SOURCE_BASIS.md`, excluded from publication.

Intended working directory: C:\GPT_DEV\magnet

M1 is implemented for testing. Human comprehension/enjoyment gates remain open; this is not an M2 or production release.

Controls: WASD/arrows move, Space attracts, Shift repels, R restarts, Escape pauses. Enter starts/resumes/retries. Controls can be remapped; field toggle, slow practice, high contrast, reduced effects and optional synthesized sound are available. F3 shows physics measurements.

Tests: `node tests/physics.cjs` runs offline simulation checks including a 600-second simulated stress test. `node tests/browser.cjs` runs Chromium keyboard and full-route checks; `node tests/stress-browser.cjs` measures the stress run inside Chromium. Browser tests require an externally installed Playwright (`PLAYWRIGHT_MODULE`) and Chrome (`CHROME_PATH` override). No test dependencies are shipped to players. Logs and unreviewed screenshots stay in ignored `test-results/`.

GitHub Pages serves only the standalone prototype, via `.github/workflows/pages.yml`.
