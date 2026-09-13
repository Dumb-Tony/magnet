# M1 implementation and tuning

Build/rules/physics: `m1-2`, workshop 01. One embedded HTML file; Canvas 2D, rectangular oriented colliders for all pieces including the square core. The 24 small pieces are each 1 mass (24 compact units available); two pipes are 4 each, dynamic block 20, core 5. There are 28 moving physical pieces including the core. Debug stress adds small parts up to 40; nothing is silently deleted. HUD capacity is 39 salvage parts plus the core.

## Physics decisions

- Fixed 1/120 s steps, at most eight catch-up steps; discard suspended backlog. Pause/clear input on blur and hidden tab. Slow practice advances simulation at half real speed and has a separate record category.
- Movement applies 3000 × (assembly mass / 5)^0.35 force at the core. This modest compensation keeps loaded travel usable while acceleration still falls with mass. Linear drag is 2.4/s during movement or field use, rising to 6/s when movement and field are released for a controlled stop; angular drag remains 3/s. Heavy mass accelerates and travels more slowly; eccentric load turns under force applied at the core.
- Field radius 160 px, strength 1400, squared distance falloff; attraction ramps over 0.5 s, repulsion uses 80% strength. Dynamic pairs receive opposing forces; the static anchor transfers reaction to the room. Pair acceleration bound 280 units/s²; aggregate acceleration limited to 900, speed to 360 and angular speed to 3 rad/s. These numerical safety limits and floor drag deliberately dissipate energy; this is a top-down rigid-body approximation, not a general physics engine.
- Contact attachment below 90 px/s relative speed. Merge recomputes center of mass and rectangular inertia, preserving each world pose and total linear/angular momentum. All constituent colliders remain in the 96 px spatial grid and SAT narrow phase. Four contact iterations, 180 impulse cap, modest friction, 0.05 px penetration slop.
- Repulsion globally releases all salvage. Each detached body inherits the assembly's point velocity and angular velocity. Bounded outward impulse has an opposing core reaction. A 0.65 s cooldown plus the active-repel attachment prohibition avoids immediate recapture. Linear motion advances at most 3 px/step, below the thinnest 10 px collider; no separate swept solver was needed for this bounded cap.
- The shortcut is 52 px wide vertically; the lower detour is 208 px. Long pipes physically catch. The 185×245 delivery bay accommodates the tested heavy and compact assemblies.

## Tiny loop and feedback

Start → play → 20 units resting fully in bay with core present for one second → result → restart. Per-piece IDs and rest timers prevent farming. Leaving the bay clears that piece's delivery credit. Results award 10 points per credited mass unit; because this slice is untimed, no time bonus or side-objective bonuses are implemented. The result triggers at the first valid 20 units, so a larger carried load can score 200 if its pieces settle on different ticks.

Visible directional field chevrons, fixed-anchor symbols, material silhouettes, labels and optional contrast mode communicate without relying on color alone. Optional synthesized pickup/shedding ticks are quiet and rate limited; no layered collision audio or production sound system. No camera motion. Keyboard remapping reserves R, Escape, Enter, Tab, F3 and arrows. Opposing hold inputs resolve to off; in toggle mode pressing the opposing key selects that mode, and holding both turns it off.

Only versioned settings and separate normal/practice fastest-delivery records are saved with guarded localStorage. Clear local data restores defaults. Storage denial is safe. Records are stored for later inspection, not compared across physics versions; a leaderboard UI is outside this verb test.

## Publication boundary

Git repository is confined to this project. Local reference transcript `docs/SOURCE_BASIS.md`, dependency folders, diagnostic logs and raw screenshots are ignored. Only reviewed game screenshots under `docs/images/` are published. Pages uploads only `prototypes/m1`, so the playable deployment contains the HTML and short README.

## Next bounded gate

Do not start M2. Recruit five fresh players for the original ten-minute procedure. Watch attraction toward the anchor, explainable heavy/pipe handling, deliberate shedding or shape choice, and voluntary retries. If readability or enjoyment fails, tune only those mechanics and repeat; automated routes do not establish fun.
