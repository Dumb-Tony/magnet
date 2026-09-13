# Magnet — Playtest log

M1 has automated simulation/browser evidence below. No fresh human players or human feel sessions have been performed. Subjective acceptance thresholds remain open.

## 2026-09-13 — workshop 01 / rules and physics m1-1

**Decision: iterate within M1.** Mechanic implementation and automated routes are ready for human testing; do not proceed to M2 on this evidence.

Test machine: AMD Ryzen 9 9950X (16 cores); Windows reports Radeon RX 9070 XT and integrated AMD Radeon Graphics. Browser: installed Chrome 153.0.8010.37, automated headless mode, 1440×1050 viewport, 1120×680 canvas backing resolution. Physical display resolution and headless GPU adapter selection were not established. Timing below is a local automation benchmark, not a claim about human-perceived smoothness on all hardware.

### Tests and observations

- Seven targeted Node/VM tests passed on the embedded source: offline/storage-denied reset and 100 resets; merge pose plus linear/angular momentum conservation; heavier-body reaction and static anchor pull; repel retention/cooldown; pipe obstruction and recovery; one-second delivery/no duplicate score/result reset; 30/60/120 rendered-frame scheduling traces.
- Traces at all three scheduling rates simulated 10.000 s and ended at `(138.994948, 660.408631)`, score 0. Difference 0%, below the 2% threshold. This is a deterministic movement/boundary input replay with identical fixed steps, not an actual monitor refresh-rate test or cross-browser guarantee.
- Chrome keyboard interaction started the game, moved and attracted compact scrap, and checked pause, resume, synthetic focus loss and restart. Zero JavaScript page errors. Screenshots were visually inspected by the agent.
- Complete normal-layout movement/field replays (no body placement): heavy block through the lower detour to delivery in 40.783 simulation seconds, 20 units / 200 points; compact collection through the lower detour in 49.717 seconds, 21 settled units / 210 points from a 23-unit carried load. Unloaded core passed the narrow route and reached the fixed-anchor field. These are automated route completion, not manual feel testing.
- A focused pipe fixture attempted the 52 px opening, stayed blocked, then shed and backed away. A separate controlled 40-part compound fixture made wall contacts for 20 simulation seconds, retained every collider, then released all 39 salvage pieces and recovered with reverse movement. Debug fixture geometry is not a claim that a fresh player assembled that shape.
- **600 simulated seconds / 72,000 steps at 40 physical parts in Chrome**, alternating field each second with cyclic movement: 40 retained, no non-finite or escaped bodies; peak attached count 22; 12 sheds; peak 108 solver contact events per step (includes solver iterations). Maximum sampled wall penetration 0.062 px. Mean step 0.744 ms, p95 1.000 ms, maximum 3.900 ms. This is an accelerated simulation stress session, not ten wall-clock minutes of human play. An earlier VM stress run was stopped in favor of this completed in-browser measurement because VM overhead made it slow; no pass is claimed for the cancelled run.
- During active play, 179 sampled Chrome frame intervals averaged 5.715 ms and peaked at 6.600 ms. This short headless sample exceeds the 60 FPS budget, but a prolonged visible-browser/human smoothness check remains a gate.
- Browser controls checks passed with localStorage deliberately denied: both-held field off, toggle on/off, slow practice, reduced effects, contrast, six-key remap and reset-to-default controls. The game remained playable and produced no page errors. Settings/records use guarded storage; no online service is required.

### Tuning and limitations

The first route check established that 1450 constant thrust makes the heavy block take a noticeably longer scripted route than an empty core; the final implementation adds an independent 360 units/s² aggregate acceleration cap so many nearby objects cannot multiply acceleration without bound. Full routes were rerun after that change. Attachment cooldown is 0.65 s, capture threshold 90 px/s, and four contact iterations retain visible pipe clearance. See IMPLEMENTATION_M1.md for exact constants.

Attraction can gather nearly the whole compact pile in one pass. Human testers must determine whether this is too automatic and whether global shedding feels recoverable rather than frustrating. The anchor is optional, so automated anchor force checks do not prove every tester notices it. The square core and rigid rectangular compounds are intentional M1 approximations. Sound is optional generated pickup/shedding ticks; no collision audio layering. Mobile/touch play is not implemented. Tests cover Chrome, not a browser compatibility matrix.

**Fresh-player gate: 0/5 tested.** Still required: four deliver and explain handling, three deliberately shed or choose shape, three voluntarily retry, all observe normal anchor pull. No comprehension, voluntary retry, fun or human-feel pass is claimed. Next experiment: the original five-person, ten-minute workshop session; tune only core handling/readability afterward.

### Reviewed assembly evidence

### Publication verification

Public play URL: https://dumb-tony.github.io/magnet/. GitHub Pages workflow run `34739473385` successfully deployed implementation commit `0b5844f`. The same Chrome browser regression was then run against the public HTTPS URL: start/keyboard collection, pause/focus/restart, heavy and compact complete deliveries, and narrow traversal to anchor all passed with zero JavaScript errors. The initial sandbox network-denied attempt was retried with authorized network access; it was not a deployment failure. This publication note changes no playable code.

### Screenshots

![Compact physical assembly](images/compact-assembly.png)

![Heavy block delivery through wide route](images/heavy-delivery.png)

![Core reaching the fixed-anchor area through narrow route](images/anchor-pull.png)

## Entry template

- Date / build / course / physics version:
- Test PC CPU, GPU, browser, resolution:
- Tester familiarity and accessibility settings:
- Hypothesis being tested:
- Task, attempt count and observed results:
- Completion time / relevant score / mechanic-specific metrics:
- Voluntary retry and comprehension observations:
- Bugs, unfair states and performance measurements:
- Parameter changes and why:
- Retest evidence:
- Decision: proceed / iterate / park:
- Unresolved questions and next bounded experiment:
