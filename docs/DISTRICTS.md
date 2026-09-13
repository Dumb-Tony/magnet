# Active build: fixed-core districts

The user asked for a fixed magnet core, a physical lopsided pile that remains navigable, deeper workshop play, then yard, street and city expansion. They chose milestones and objectives without time pressure, with the option of removing them later. This document supersedes the first 3D prototype's growing-sphere approximation.

## What is playable

One continuous four-district course, 490 collectible objects and 24 object types. The 64 cm core never changes size. There is no growing filler sphere. Eligible objects now crumple on pickup; their final attachment poses are retained as subsequent objects join the pile. See [the visual and crushing pass](CRUSHING.md).

1. Workshop: tabletop scraps, a ramp, shelves, a narrow optional aisle, long pipes, stools and lockers. Collect the workbench to open the yard.
2. Salvage yard: barrels, handcarts, bicycles and skips. The forklift opens the street.
3. Main street: hydrants, signs, parked cars and vans. The bus opens the city plaza.
4. City plaza: kiosks, trucks, containers, water towers and an optional tram. The skyline spire completes the route. Keep exploring afterward to fill the collection checklist.

Each later district has an off-route rebuild corner with ascending small-to-medium salvage. No countdown, failure timer, delivery bay, currency, upgrades or multiplayer. This is a compact city district, not an entire destructible city.

## Shape and navigation

`pile.js` handles the fixed core and compound attachments. Each object has a small set of overlapping collision spheres based on its model bounds. Packing samples possible directions near the contact side and chooses a nearby compact attachment; stored item positions/quaternions never move during later growth. Mesh scale remains one. The core radius remains 0.32.

Collision proxies rotate with the pile. Their lowest supports set ground height; protruding parts can contact shelves even when the core would clear them. The effective rolling radius follows the 65th percentile of actual proxy extents, so one long pipe does not make ordinary travel crawl. Directional input supplies generous movement and angular assistance. This is a compound arcade approximation, not an articulated rigid-body solver: coarse proxies may interpenetrate slightly, and object attachment is not momentum conserving.

Navigation assistance deliberately favors continued play:

- Wide main paths plus narrower optional aisles.
- Gentle automatic hop/turn when sustained input catches several contacts.
- F gives a small nudge without removing anything.
- Shift ejects up to five recent objects and bursts; objects remain in the world with a two-second pickup cooldown.
- Backspace / Recover pile returns the intact assembly to the current area's open landing spot.
- Milestones stay completed after shedding their object, so unlocked exits do not close behind the player.

Physical span and magnetic carrying strength are separate. Span comes from the attached shapes; pull eligibility uses accumulated mass. This prevents one long pipe granting the strength to pick up a truck. Constant responsive input is not slowed in proportion to collected mass. The HUD shows actual pile span, current goal, collection and the invariant core size.

## Readability and comfort

Perspective follow camera, keyboard/mouse orbit, a district minimap, goal arrow, visible exit barriers, collectible-type checklist, contextual pickup hints and a brief generated pickup sound. Reduced-motion mode stabilizes the camera's vertical target; low graphics disables shadows and reduces pixel density. Optional toggle attraction and automatic unsticking. The masonry façades and painted workshop fixtures are visibly environmental obstacles, not collectible metal models.

## Saving

The current version saves locally every 20 simulation seconds, on milestones and on pause. A saved run records object IDs, free-object positions, exact attachment positions/quaternions, pile rotation, district and completed goals. Continue appears after reloading. Storage failures leave the game playable in memory. Clear saved run disables autosaving that current run; Save current run re-enables it. No data leaves the browser.

## Files and offline play

Open `prototypes/m1/index.html` with adjacent `pile.js`, `materials.js`, `world.js`, `crush.js`, `adventure.js` and `vendor/` intact. Locally bundled Three.js 0.160.1 and its MIT license remain unchanged. No external requests or build step. The previous 3D experiment is `growth-first.html`; the original 2D game is `delivery-2d.html`. Tests for those older versions remain separate.

The current course and models live in `world.js`, the attachment model in `pile.js`, and progression/input/save/UI in `adventure.js`. Milestone definitions are centralized in the `regions` array and goal flags, so a later sandbox decision need not rewrite the pile or world models.

## Limits and next human gate

The new full route is tested through automation, not five fresh human players. Approximate contacts, support-height changes and assisted rolling still need feel testing. Camera clearance lifts over nearby scenery but is not a general occlusion solver. Models are procedural low-poly placeholders. Desktop keyboard and WebGL required; no gamepad, touch navigation or full remapping yet. More content should follow feedback on this loop, rather than substituting for that feedback.
