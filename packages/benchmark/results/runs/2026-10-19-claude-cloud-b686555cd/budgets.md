# Budgets: 2026-10-19-claude-cloud-b686555cd

Machine **claude-cloud** (Intel(R) Xeon(R) Processor @ 2.10GHz, 4 cores, 16093 MB, Linux 6.18.44-fc-v139 x64, Node v22.22.0); commit `b686555cd`; 2026-10-19.

Builds: JS: source, bundled by scripts/bundle-driver.mjs; Rust: wasm-pack --release, without logging features; cells: wasm-pack --release (npm run build -w packages/cells-core).

Each core in a real page with its own viewer, against the product budgets in [METHOD.md](../../../METHOD.md). These numbers include each viewer, which differ in maturity, so they are not a comparison between cores.

## Frame latency of a drag

Median time from a pointer move to the frame that shows the point moved: 16 ms per frame, 50 ms for a rebuild. Under it: p90 and how many of the moves got a frame. †: the Node layer did not check this core's values on the shape (it was skipped there, or did not finish), so the time is of work that was not checked.

| Fixture | JS | Rust | cells |
|---|---|---|---|
| depth-1000 | ✗ 28 ms<br><sub>p90 35 ms · 58/61 frames</sub> | ✗ 64 ms<br><sub>p90 175 ms · 32/61 frames</sub> | ✓ 10 ms<br><sub>p90 13 ms · 59/61 frames</sub> |
| depth-10000 | ✗ 2.4 s<br><sub>p90 2.4 s · 2/61 frames</sub> | timeout at load | ✗ 93 ms<br><sub>p90 117 ms · 60/61 frames</sub> |
| breadth-1000 | ✗ 32 ms<br><sub>p90 39 ms · 59/61 frames</sub> | ✗ 47 ms<br><sub>p90 79 ms · 50/61 frames</sub> | ✓ 11 ms<br><sub>p90 17 ms · 59/61 frames</sub> |
| breadth-10000 | ✗ 1.1 s<br><sub>p90 1.1 s · 2/61 frames</sub> | timeout at load | ✗ 94 ms<br><sub>p90 116 ms · 60/61 frames</sub> |
| inversion-1000 | ✗ 2.0 s<br><sub>p90 2.0 s · 1/61 frames</sub> | not comparable<br><sub>wrong values in the Node layer</sub> | ✓ 11 ms<br><sub>p90 15 ms · 60/61 frames</sub> |
| inversion-10000 | no frames | timeout at load | ✗ 87 ms<br><sub>p90 115 ms · 60/61 frames</sub> |
| symbolic-1000 | ✗ 39 ms<br><sub>p90 70 ms · 60/61 frames</sub> | timeout at tick | ✗ 65 ms<br><sub>p90 78 ms · 60/61 frames</sub> |
| rebuild-1000 | timeout at tick | not comparable<br><sub>wrong values in the Node layer</sub> | ✓ 15 ms<br><sub>p90 38 ms · 59/61 frames</sub> |
| rebuild-10000 | timeout at load | not comparable<br><sub>wrong values in the Node layer</sub> | ✓ 5.83 ms<br><sub>p90 270 ms · 60/61 frames</sub> |
| rebuild-100000 | ✓ 17 ms †<br><sub>p90 28 ms · 60/61 frames</sub> | not comparable<br><sub>wrong values in the Node layer</sub> | not comparable<br><sub>wrong values in the Node layer</sub> |
| lesson | ✗ 40 ms<br><sub>p90 52 ms · 60/61 frames</sub> | ✗ 18 ms<br><sub>p90 28 ms · 55/61 frames</sub> | ✓ 2.60 ms<br><sub>p90 3.66 ms · 60/61 frames</sub> |
| sir | no frames | ✗ 17 ms<br><sub>p90 19 ms · 55/61 frames</sub> | ✓ 13 ms<br><sub>p90 446 ms · 19/61 frames</sub> |

## Load

Text to first render. The budget, 100 ms, is for `homework`; the other loads are for reference.

| Fixture | JS | Rust | cells |
|---|---|---|---|
| depth-1000 | 8.0 s | 14 s | 456 ms |
| depth-10000 | 89 s | timeout at load | 1.1 s |
| depth-100000 | error at load | timeout at load | 5.5 s |
| breadth-1000 | 8.3 s | 12 s | 521 ms |
| breadth-10000 | 92 s | timeout at load | 1.1 s |
| breadth-100000 | error at load | timeout at load | 5.7 s |
| inversion-1000 | 7.6 s | 15 s | 427 ms |
| inversion-10000 | 80 s | timeout at load | 1.1 s |
| inversion-100000 | error at load | timeout at load | 5.2 s |
| symbolic-1000 | 6.8 s | 94 s | 668 ms |
| symbolic-10000 | 89 s | timeout at load | 1.5 s |
| symbolic-100000 | error at load | timeout at load | 9.8 s |
| rebuild-1000 | 19 s | 1.1 s | 263 ms |
| rebuild-10000 | timeout at load | 1.1 s | 671 ms |
| rebuild-100000 | 8.2 s | 1.0 s | 697 ms |
| homework | ✗ 2.2 s | ✗ 1.2 s | ✗ 370 ms |
| lesson | 2.2 s | 1.1 s | 287 ms |
| sir | 11 s | 1.2 s | 404 ms |
| venn | 2.9 s | 1.2 s | 400 ms |

## State storage

The `homework` session's saved state after its script, raw: 2 KB. Under it: gzipped.

| Core | State |
|---|---|
| JS | ✓ 0.6 KB<br><sub>gzip 0.3 KB</sub> |
| cells | ✓ 0.1 KB<br><sub>gzip 0.1 KB</sub> |

## Bundle

Everything a page fetches to render a document, brotli: 1 MB. Under it: raw.

| Set | Size |
|---|---|
| javascript (eager set) | ✗ 4.44 MB<br><sub>raw 22.73 MB</sub> |
| javascript (whole dist, no maps) | ✗ 13.41 MB<br><sub>raw 62.83 MB</sub> |
| rust (wasm only) | ✓ 0.59 MB<br><sub>raw 6.95 MB</sub> |
| rust (prototype viewer page) | ✗ 4.00 MB<br><sub>raw 20.58 MB</sub> |
| cells (viewer build) | ✗ 1.29 MB<br><sub>raw 6.63 MB</sub> |

Memory per viewer (budget 20 MB) is measured by `packages/memory-benchmark`, not in a run.
