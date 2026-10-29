# Budgets: 2026-10-28-laptop-a528ef710-dirty

Machine **laptop** (Intel(R) Core(TM) i7-10510U CPU @ 1.80GHz, 8 cores, 15651 MB, Linux 6.8.0-138-generic x64, Node v24.15.0); commit `a528ef710` with uncommitted changes; 2026-10-28.

Builds: cells: wasm-pack --release (npm run build -w packages/cells-core); cells-prototype: unrecorded.

Each core in a real page with its own viewer, against the product budgets in [METHOD.md](../../../METHOD.md). These numbers include each viewer, which differ in maturity, so they are not a comparison between cores.

## Frame latency of a drag

Median time from a pointer move to the frame that shows the point moved: 16 ms per frame, 50 ms for a rebuild. Under it: p90 and how many of the moves got a frame. †: the Node layer did not check this core's values on the shape (it was skipped there, or did not finish), so the time is of work that was not checked.

| Fixture | cells | cells-prototype |
|---|---|---|
| depth-1000 | ✓ 9.30 ms †<br><sub>p90 17 ms · 59/61 frames</sub> | ✗ 34 ms †<br><sub>p90 63 ms · 49/61 frames</sub> |
| depth-10000 | ✗ 90 ms †<br><sub>p90 125 ms · 59/61 frames</sub> | timeout at tick |
| breadth-1000 | ✓ 12 ms †<br><sub>p90 22 ms · 59/61 frames</sub> | ✗ 30 ms †<br><sub>p90 40 ms · 49/61 frames</sub> |
| breadth-10000 | ✗ 83 ms †<br><sub>p90 99 ms · 59/61 frames</sub> | ✗ 258 ms †<br><sub>p90 343 ms · 49/61 frames</sub> |
| inversion-1000 | ✓ 9.31 ms †<br><sub>p90 18 ms · 59/61 frames</sub> | ✗ 32 ms †<br><sub>p90 39 ms · 49/61 frames</sub> |
| inversion-10000 | ✗ 80 ms †<br><sub>p90 117 ms · 59/61 frames</sub> | timeout at tick |
| symbolic-1000 | ✗ 56 ms †<br><sub>p90 77 ms · 59/61 frames</sub> | ✗ 115 ms †<br><sub>p90 173 ms · 21/61 frames</sub> |
| rebuild-1000 | ✓ 13 ms †<br><sub>p90 39 ms · 59/61 frames</sub> | ✗ 82 ms †<br><sub>p90 134 ms · 48/61 frames</sub> |
| rebuild-10000 | ✓ 2.64 ms †<br><sub>p90 233 ms · 59/61 frames</sub> | timeout at tick |
| lesson | ✓ 2.50 ms<br><sub>p90 4.95 ms · 59/61 frames</sub> | ✗ 18 ms<br><sub>p90 24 ms · 56/61 frames</sub> |
| sir | ✓ 6.80 ms<br><sub>p90 408 ms · 19/61 frames</sub> | ✗ 34 ms<br><sub>p90 267 ms · 6/61 frames</sub> |

## Load

Text to first render. The budget, 100 ms, is for `homework`; the other loads are for reference.

| Fixture | cells | cells-prototype |
|---|---|---|
| depth-1000 | 223 ms | 1.3 s |
| depth-10000 | 1.5 s | 2.5 s |
| breadth-1000 | 424 ms | 1.5 s |
| breadth-10000 | 962 ms | 3.2 s |
| inversion-1000 | 352 ms | 1.6 s |
| inversion-10000 | 1.2 s | 3.5 s |
| symbolic-1000 | 563 ms | 2.2 s |
| symbolic-10000 | 1.5 s | 4.2 s |
| rebuild-1000 | 217 ms | 1.8 s |
| rebuild-10000 | 683 ms | 2.5 s |
| homework | ✗ 158 ms | ✗ 1.0 s |
| lesson | 124 ms | 1.0 s |
| sir | 222 ms | 1.2 s |
| venn | 167 ms | 1.1 s |

Memory per viewer (budget 20 MB) is measured by `packages/memory-benchmark`, not in a run.
