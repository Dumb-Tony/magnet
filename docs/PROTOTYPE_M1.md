# Milestone 1 — Standalone HTML vertical prototype

**Status: M1 implemented for testing, 2026-09-13. Human exit gates remain open.** The sole purpose of this milestone is proving the core mechanic/verb before expanding content. Follow the offline, fixed-step, restart, storage, and measurement contract in GDD.md. Thresholds below remain acceptance targets; see PLAYTEST_LOG.md for actual results.

## Question and hypothesis
Does collecting physical metal create interesting handling decisions, and can attraction/repulsion solve the problems it creates?

## Exact playable slice
One top-down workshop, one magnet, 24 small pieces, two long pipes, one heavy dynamic block, one fixed steel anchor, a narrow shortcut and wide detour. Deliver 20 mass units. Place enough compact scrap to permit success without collecting everything. No time limit; display elapsed time. Repel allows the player to escape a self-made jam.

## Implementation specification
Start magnet mass at 5 units, small pieces at 0.5–1, pipe at 4, heavy block at 20. Anchor is static. Initial field radius 160 pixels; use bounded falloff F = strength × (1 − distance/radius)² inside the radius. Cap acceleration and collision impulses independently. Movement uses force, not direct position changes. Compound colliders keep each item's local transform; rebuild center of mass and inertia after attachment/detachment without teleporting the assembly. Momentum conservation is the baseline when merging bodies.

## Deliberate exclusions
No appliances/cars, upgrades, destruction campaign, spring-connected mega-piles, selective inventory or endless spawning. At most 40 physical pieces including spawned debug cases.

## Test procedure and exit gate
Five fresh players have ten minutes. Four must deliver a load and explain why the long pipe or heavy block changes handling. Three must deliberately shed mass or choose a different shape for the narrow route. At least three voluntarily try a second assembly. Every tester must be able to observe the player moving toward the fixed anchor; a debug demonstration cannot substitute for normal feedback.

Verify heavy-body reaction, stable 40-piece contacts, no disappearing colliders, no score duplication, no immediate repel/reattach loop, and recoverability from the narrowest legal jam. Run a ten-minute attract/repel stress session and compare render-rate traces.

## Decision rule and deliverables
One offline HTML and a test log with maximum piece count, physics cost and sample assembly screenshots. If mass is imperceptible, reduce thrust scaling. If shape is cosmetic, fix compound collision before adding content. If repulsion is unreadable, slow detachment impulses. Do not pass a version that turns pickups into an abstract inventory.
