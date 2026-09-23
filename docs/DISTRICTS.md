# Active build: fixed-core districts

The user asked for a fixed magnet core, a physical lopsided pile that remains navigable, deeper workshop play, then yard, street and city expansion. They chose milestones and objectives without time pressure, with the option of removing them later. This document supersedes the first 3D prototype's growing-sphere approximation.

## What is playable

One continuous twelve-district course, 1,770 collectible objects and 62 object types. The route continues through Meridian Airfield, the orbital launch complex and Titan Foundry into Crown Quarry, Halcyon Hydro and the Apex megacity core. The 64 cm core never changes size. There is no growing filler sphere. Eligible objects crumple on pickup and seat deeply into the compound pile. See [the visual and crushing pass](CRUSHING.md).

1. Workshop: tabletop scraps, a ramp, shelves, a narrow optional aisle, long pipes, stools and lockers. Collect the workbench to open the yard.
2. Salvage yard: barrels, handcarts, bicycles and skips. The forklift opens the street.
3. Main street: hydrants, signs, parked cars and vans. The bus opens the city plaza.
4. City plaza: kiosks, trucks, containers, water towers and an optional tram. The skyline spire opens the railworks; the locomotive then opens the dry docks.
5. Late route: the cargo freighter opens Meridian Airfield. Ground vehicles, propeller planes and control towers build toward the airliner, which opens the orbital launch complex. Satellites, rovers, radar dishes and crawler transporters build toward the orbital rocket.
6. Titan Foundry: power transformers, crawler dozers, turbine generators and molten-metal ladles build toward a 60-metre blast furnace. The wider yard uses overhead pipe bridges, furnace halls, slag channels and tall stacks to match the pile's final scale.
7. Crown Quarry: ultra haul trucks, blast-hole drills and mobile rock crushers build toward a bucket-wheel excavator among rock terraces and conveyors.
8. Halcyon Hydro: penstocks, spillway gates and dam gantries build toward a hydro generator beside a broad reservoir and monumental dam.
9. Apex Core: monorails, tower cranes and office towers build toward the megacity spire along a wide avenue beneath elevated transit.

Each later district has an off-route rebuild corner with ascending small-to-medium salvage. No countdown, failure timer, delivery bay, currency, upgrades or multiplayer. This is a compact city district, not an entire destructible city.

## Shape and navigation

`pile.js` handles the fixed core and compound attachments. Each object has a small set of overlapping collision spheres based on its model bounds. Packing samples 32 directions near the contact side and chooses a nearby hollow. Proxy spheres overlap to 54% of their combined radii so crushed visible meshes seat into one mass; stored item positions/quaternions never move during later growth. Saves made before this packing pass are tightened once when restored. Mesh scale remains one. The core radius remains 0.32.

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

Perspective follow camera, keyboard/mouse orbit, a district minimap, visible exit barriers, collectible-type checklist, contextual nearby-object hints and a brief generated pickup sound. Discovery stays uncluttered: there is no world-space goal arrow, minimap objective marker or routine pickup toast. Reduced-motion mode stabilizes the camera's vertical target; low graphics disables shadows and the depth-aware finishing pass, and reduces pixel density. Optional toggle attraction and automatic unsticking. The masonry façades and painted workshop fixtures are visibly environmental obstacles, not collectible metal models.

## Saving

The current version saves locally every 20 simulation seconds, on milestones and on pause. A saved run records object IDs, free-object positions, exact attachment positions/quaternions, pile rotation, district and completed goals. Continue appears after reloading. Storage failures leave the game playable in memory. Clear saved run disables autosaving that current run; Save current run re-enables it. No data leaves the browser.

## Files and offline play

Open `prototypes/m1/index.html` with adjacent `pile.js`, `materials-v2.js`, `world.js`, `crush.js`, `adventure.js` and `vendor/` intact. Locally bundled Three.js 0.160.1 and its MIT license remain unchanged. No external requests or build step. The previous 3D experiment is `growth-first.html`; the original 2D game is `delivery-2d.html`. Tests for those older versions remain separate.

The course lives in `world.js`, `expansion.js`, `airfield.js`, `launch-complex.js`, `titan-foundry.js` and `beyond-foundry.js`, world scenery and the graphics finishing pass in `world-art.js`, detailed collectible models in `detail-models.js`, surface maps in `materials-v2.js`, reflected lighting in `lighting.js`, crushing in `crush.js`, attachment packing in `pile.js`, and progression/input/save/UI in `adventure.js`. Keep all adjacent scripts for offline use. `showroom.html` provides a close-up interactive gallery. See [the object art pass](OBJECT_ART.md). Milestone definitions remain centralized in the `regions` array and goal flags.

## Limits and next human gate

The new full route is tested through automation, not five fresh human players. Approximate contacts, support-height changes and assisted rolling still need feel testing. Camera clearance lifts over nearby scenery but is not a general occlusion solver. Models are authored procedural miniatures, with simplified silhouettes and crushed forms rather than simulated material fracture. Desktop keyboard and WebGL required; no gamepad, touch navigation or full remapping yet. More content should follow feedback on this loop, rather than substituting for that feedback.
