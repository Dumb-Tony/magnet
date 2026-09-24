# Growth-speed tuning

The pile should gain presence as it grows without turning the later districts into a long commute. Large piles now have a higher cruise speed and a slightly softer response. Weight is communicated by the easing and slow visual roll of the broad assembly rather than a severe travel penalty.

Cruise speed uses magnetic power and effective rolling radius. It starts at 7.66 world units per second and rises smoothly toward roughly 28. Camera pullback now combines physical span and rolling radius instead of multiplying span alone. Long attachments still remain readable, but one protruding object no longer pushes the camera so far away that motion appears to stop.

Representative controlled samples:

| Pile | Cruise speed | Camera distance | Relative screen pace |
|---|---:|---:|---:|
| Bare core | 7.66 | 6.66 | 100% |
| Workshop | 12.16 | 9.96 | 106% |
| City | 22.90 | 24.04 | 83% |
| Launch complex | 27.68 | 56.95 | 42% |

The launch-sized sample previously retained about 23% of the bare core's screen pace. The new curve keeps about 42%, so late travel still feels heavier while moving nearly twice as strongly on screen. These are deterministic unobstructed browser samples, not human feel-test results.

## 24 September 2026 — Captured mouse camera

Starting, continuing, resuming or clicking the world now requests Pointer Lock. Relative mouse movement continuously orbits and tilts the follow camera, and WASD remains camera-relative, so players can scan behind the pile and revisit missed objects without holding a mouse button or reaching a screen edge. Escape releases capture without pausing; a second Escape pauses. Q/E orbit remains available, and drag-to-look is retained as a fallback when Pointer Lock is unavailable or denied. Vertical tilt is clamped to keep the world upright.

The dedicated browser check verifies capture, horizontal and vertical relative movement, body lock state, release without pausing and ordinary pause afterward. The 600-second movement/physics regression also passed unchanged.
