# Budgets: 2026-10-28-laptop-c59b45388-dirty

Machine **laptop** (Intel(R) Core(TM) i7-10510U CPU @ 1.80GHz, 8 cores, 15651 MB, Linux 6.8.0-138-generic x64, Node v24.15.0); commit `c59b45388` with uncommitted changes; 2026-10-28.

Builds: cells: wasm-pack --release (npm run build -w packages/cells-core); cells-prototype: unrecorded.

Each core in a real page with its own viewer, against the product budgets in [METHOD.md](../../../METHOD.md). These numbers include each viewer, which differ in maturity, so they are not a comparison between cores.

## Frame latency of a drag

Median time from a pointer move to the frame that shows the point moved: 16 ms per frame, 50 ms for a rebuild. Under it: p90 and how many of the moves got a frame. †: the Node layer did not check this core's values on the shape (it was skipped there, or did not finish), so the time is of work that was not checked.

| Fixture | cells | cells-prototype |
|---|---|---|
| depth-1000 | ✓ 7.82 ms †<br><sub>p90 15 ms · 59/61 frames</sub> | ✗ 21 ms †<br><sub>p90 29 ms · 49/61 frames</sub> |
| depth-10000 | ✗ 57 ms †<br><sub>p90 70 ms · 59/61 frames</sub> | ✓ 5.01 ms †<br><sub>p90 189 ms · 49/61 frames</sub> |
| breadth-1000 | ✓ 8.62 ms †<br><sub>p90 14 ms · 59/61 frames</sub> | ✗ 20 ms †<br><sub>p90 34 ms · 49/61 frames</sub> |
| breadth-10000 | ✗ 57 ms †<br><sub>p90 74 ms · 59/61 frames</sub> | ✗ 141 ms †<br><sub>p90 220 ms · 49/61 frames</sub> |
| inversion-1000 | ✓ 8.27 ms †<br><sub>p90 14 ms · 59/61 frames</sub> | ✗ 20 ms †<br><sub>p90 29 ms · 49/61 frames</sub> |
| inversion-10000 | ✗ 55 ms †<br><sub>p90 66 ms · 59/61 frames</sub> | ✓ 5.58 ms †<br><sub>p90 188 ms · 49/61 frames</sub> |
| symbolic-1000 | ✗ 52 ms †<br><sub>p90 55 ms · 59/61 frames</sub> | ✗ 77 ms †<br><sub>p90 132 ms · 49/61 frames</sub> |
| rebuild-1000 | ✓ 12 ms †<br><sub>p90 34 ms · 60/61 frames</sub> | ✗ 78 ms †<br><sub>p90 114 ms · 49/61 frames</sub> |
| rebuild-10000 | ✓ 2.73 ms †<br><sub>p90 192 ms · 60/61 frames</sub> | timeout at tick |
| lesson | ✓ 3.01 ms<br><sub>p90 3.43 ms · 59/61 frames</sub> | ✗ 18 ms<br><sub>p90 19 ms · 52/61 frames</sub> |
| sir | ✓ 9.96 ms<br><sub>p90 419 ms · 19/61 frames</sub> | ✗ 202 ms<br><sub>p90 501 ms · 3/61 frames</sub> |

## Load

Text to first render. The budget, 100 ms, is for `homework`; the other loads are for reference.

| Fixture | cells | cells-prototype |
|---|---|---|
| depth-1000 | 210 ms | 409 ms |
| depth-10000 | 622 ms | 1.3 s |
| breadth-1000 | 201 ms | 389 ms |
| breadth-10000 | 659 ms | 1.4 s |
| inversion-1000 | 201 ms | 399 ms |
| inversion-10000 | 642 ms | 1.3 s |
| symbolic-1000 | 324 ms | 566 ms |
| symbolic-10000 | 1.0 s | 2.4 s |
| rebuild-1000 | 145 ms | 2.2 s |
| rebuild-10000 | 524 ms | 1.3 s |
| homework | ✗ 151 ms | ✗ 212 ms |
| lesson | 121 ms | 493 ms |
| sir | 180 ms | 535 ms |
| venn | 174 ms | 378 ms |

Memory per viewer (budget 20 MB) is measured by `packages/memory-benchmark`, not in a run.
