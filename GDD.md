# Magnet — Game Design Document

> Historical delivery design. The user-authorized 3D rolling growth pivot now takes precedence; see docs/PIVOT_3D.md. This document is design history, not the active implementation contract.

## Elevator pitch
Become a moving, clattering accumulation of metal. Attract scrap, physically carry its awkward shape, repel it when needed, and use heavy anchors to pull yourself through industrial spaces. Bigger means stronger and harder to control.

## Design pillars
- Every collected object stays visible and physically consequential.
- Shape and mass matter as much as total collection.
- Attraction and repulsion create traversal and problem solving.
- Growth produces funny, understandable problems rather than automatic superiority.

## Player fantasy
Start with paperclips and bolts; end up dragging an absurd mechanical creature you assembled through your own choices. A refrigerator on one side must feel different from the same mass packed near the center.

## Core gameplay loop
Survey goal and route → attract useful metal → manage the growing body → negotiate a gap or obstacle → shed/rearrange mass with repulsion → deliver the required load or reach the exit → review efficiency → retry. A bounded 3–6 minute industrial challenge is the initial format; city-scale accumulation is an aspirational concept, not a launch requirement.

## Controls
WASD/arrows apply movement force; hold Space attract, hold Shift repel, release both to turn the field off; R restart; Escape pause. Opposing field inputs resolve to off with a visible indication. Attract ramps to full strength over 0.5 seconds; repel is sustained with bounded force, avoiding rapid-button spam. Proposed gamepad: stick movement, triggers attract/repel. Camera and movement need no separate aiming input in M1.

## Moment-to-moment mechanics
Pick a compact bolt cluster for easy handling or a long pipe for reach at the cost of clearance. Approach a heavy anchored beam, attract and let the magnet move toward it. Feather attraction around loose objects to avoid collecting something inconvenient. Repel to detach and push the pile away, then rebuild. M1 uses global shedding; selective object release is an open question, not a promised control.

## Physics and systems
Each piece has mass, collider, pose and attachment state. Free metal receives a bounded radial field force decreasing smoothly with distance. Apply equal-and-opposite force to the magnet assembly for dynamic pairs; a static anchor transmits reaction into the world, pulling the assembly. Clamp short-distance force to avoid singularities.

M1 joins touching collected pieces to a compound rigid assembly. Each collider remains active; total mass, center of mass and rotational inertia are recomputed. This preserves physical metal without requiring a costly chain of unstable springs. Visual micro-jitter may imply rattling but cannot change collision geometry. Repulsion breaks attachments and gives bounded outward impulses with corresponding assembly reaction. Detached parts cannot reattach during active repulsion. Attachment eligibility requires contact and a capture speed below a tunable threshold.

Growth modestly increases field capacity, but thrust does not scale one-for-one with mass. Heavy, wide shapes turn slowly and snag honestly. Set a 40-piece M1 cap with a visible field-capacity cue; never delete collected pieces invisibly to maintain speed.

## Scoring
The primary objective is delivering a target mass into a marked bay with the magnet present. Count mass only after it rests inside for one second; each object counts once. Proposed score: 10 points per delivered mass unit + remaining-time bonus capped at 25% of base + objective bonuses for narrow clearance or specified salvage. No score for repeatedly picking up and dropping an object. Maximum-mass and precision challenges are separate later modes; raw mass must not always dominate efficient delivery.

## Level and environment design
M1 workshop contains small scrap, an asymmetrical pipe, heavy block, fixed anchor, wide route, narrow shortcut and delivery bay. Collision silhouettes clearly communicate clearance. Later scrapyard and construction-yard stages introduce hanging anchors, ramps and fragile cargo. Conditional initial release: six compact challenges across two industrial kits. Factory, shipyard and downtown remain backlog. Every bottleneck has a feasible route or a place to shed mass.

## Progression and unlocks
Unlock challenges through delivery and precision medals. Cosmetics change core shell and field appearance. Alternate magnets may trade radius for strength or thrust for capacity only after balance is proven. No irreversible stat purchases; no grind to pull mandatory objects. The key unlock is understanding which shapes to build.

## Replayability
Try different assemblies, routes and voluntary mass limits. Fixed layouts make planning legible; seeded scrap arrangements can be an optional later challenge with separate records. Local records track time, delivered mass and score rather than collapsing every goal into one number.

## Art direction
Tactile industrial toybox with recognizable silhouettes: bolt, pipe, can, wrench, appliance. Scale steps are visibly distinct. Field direction uses animated arrows and rings, not red/blue alone. Dense scrap must remain distinguishable from scenery and nonmagnetic obstacles.

## Animation and VFX
Snap-in anticipation, a short field ripple, contact sparks and constrained cosmetic rattling communicate pickup. Repel produces outward pulses, not an opaque explosion. Show center of mass only in practice/debug mode or as an optional assistance cue. A caught pipe should visibly contact the doorway.

## Audio
Material and size drive tik/clink/clank/bang layers. Rate-limit collision voices, sum small impacts and cap output intensity so a large pile does not become painful noise. Field hum rises with load, and a distinct strained tone indicates insufficient pull. Audio is decorative reinforcement of visible forces.

## UI/UX
HUD shows current mass, capacity, field mode and objective mass. Highlight pullable versus anchored metal through pattern/symbol cues. First instruction is move and hold attract; show repel only after the player encounters an awkward shape. Result screen identifies delivery, time and penalties. Offer full reset and later local checkpoint recovery without losing the meaning of delivery.

## Accessibility and options
Remappable controls, hold/toggle field, reduced field effects, adjustable camera movement, high-contrast colliders and optional direction vectors. Provide a slow practice setting and an untimed mode with separate records. No rapid tapping or precise color distinction is required. M1 keyboard and mouse-independent play is the baseline.

## Technical approach
Canvas top-down rigid-body approximation with circles and oriented boxes, a spatial grid broad phase, fixed-step collision resolution and compound attachment transforms. Compute assembly mass properties from constituent shapes. Substep or sweep fast detached pieces. Record contact count and simulation cost as piece count grows. M2 benchmarks a local bundled physics library or richer 3D representation only if the custom model limits fun; no production-engine promise precedes this test.

## Risks and mitigations
An ever-growing pile can exceed physics budgets: enforce explicit capacity and measure worst cases. Global repel may feel too destructive: test short pulses before inventing selective inventory controls. Compound assembly may feel too rigid: test a few articulated attachments in M2 without sacrificing stability. Growth could erase challenge: make shape-dependent routes and bounded thrust central. An invisible collider simplification would violate identity: retain each gameplay-relevant silhouette.

## Scope boundaries
M1 is one room, at most 40 pieces and two field modes. Conditional release has six challenges, two visual kits and a small object library. No whole-city simulation, fluid physics, metal deformation, crafting economy, infinite mass, online services or multiplayer foundation.

## Milestone roadmap
1. **Standalone HTML vertical prototype:** prove accumulation changes handling, attraction can pull the player toward heavy metal, and repulsion offers meaningful recovery.
2. **Physics feasibility:** stress-test larger compounds, decide attachment model and camera, and demonstrate stable contact/repel behavior at the chosen cap.
3. **Small game:** six challenges, side objectives, local records and restrained cosmetic progression; every new object must change handling or routing.
4. **Polish:** sound density, force readability, accessibility and prolonged performance tests.
5. **Expansion review:** larger scales and new modes only after measured capacity and continued solo replay justify them.

## Development policy and evidence

This design began as version 0.1 on 2026-09-12. M1 implementation was authorized and completed for testing on 2026-09-13; it is not a production commitment. Design provenance is retained in local reference notes. The user's current brief takes precedence over older multiplayer brainstorming. Mechanical formulas, key bindings, content budgets, and test thresholds below are proposed hypotheses, not previously approved requirements or measured results.

Single-player first. No accounts, servers, matchmaking, replication, rollback, network authority, or multiplayer-driven entity architecture. A later multiplayer proposal requires its own feasibility and scope decision. Ordinary modular separation of input, simulation, presentation, and save data is sufficient now.

Milestone 1 is a standalone HTML vertical prototype whose sole purpose is proving the core mechanic/verb before expanding content. “Vertical” means a complete tiny start–play–result–restart loop, not production polish. The M1 prototype is now implemented in prototypes/m1/index.html. No full production build is included.

## Shared implementation and validation contract

Deliver the future M1 as one index.html with embedded CSS, JavaScript, geometry, and generated sound. It must open from file:// offline with no installation, build command, CDN, remote fonts, fetch, or external asset requirement. Use Canvas 2D for initial rendering, including projected geometry where specified. No engine decision for the full game is implied.

Use requestAnimationFrame for presentation and a fixed 1/120-second simulation accumulator, capped at eight catch-up steps. Discard excessive backlog after suspending a tab; pause on lost focus and clear held input. Tune to a stable 60 rendered frames/second on the actual test PC, whose CPU, GPU, browser, and resolution must be recorded. Compare repeated scripted input at 30, 60, and 120 rendered FPS; traversal/score differences above 2% need investigation. This is local repeatability, not a promise of cross-browser bitwise determinism.

Persist only settings and appropriate local records through a versioned localStorage adapter wrapped in try/catch. The game must remain playable in memory when storage is unavailable, especially under file://. Provide an explicit local reset action. Later ghost recordings must carry course, rules, and physics version identifiers. Never silently compare incompatible records.

Developer-only overlays report frame cost, simulation time, relevant physical variables, and reset state. M1 tests cover the normal loop, boundary cases, focus loss, rapid restart, and prolonged use. Do not invest in a general framework before a mechanic passes.

## Milestone governance

Milestones are exit gates, not promised calendar dates. At each gate, record observations, parameter changes, unresolved issues, and a proceed / iterate / park decision in docs/PLAYTEST_LOG.md. Recruit five fresh players where possible; an internal solo test can identify problems but cannot count as the fresh-player comprehension gate. Small samples are directional evidence.

M1 includes only the bespoke prototype specification in docs/PROTOTYPE_M1.md. Do not begin M2 merely because M1 runs without crashing. If the mechanic misses its enjoyment or readability gate, run up to two focused tuning rounds before deciding whether to revise the premise or park it. Adding levels, upgrades, story, or polished assets is not the remedy for an unproven verb.
