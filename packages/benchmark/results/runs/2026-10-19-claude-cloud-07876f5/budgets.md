# Budgets: 2026-10-19-claude-cloud-07876f5

Machine **claude-cloud** (Intel(R) Xeon(R) Processor @ 2.80GHz, 4 cores, 16093 MB, Linux 6.18.44-fc-v139 x64, Node v22.22.0); commit `07876f5`; 2026-10-19.

Builds: JS: source, bundled by scripts/bundle-driver.mjs; Rust: wasm-pack --dev at opt-level 3, without logging features; cells: wasm-pack --release (npm run build -w packages/cells-core).

Each core in a real page with its own viewer, against the product budgets in [METHOD.md](../../../METHOD.md). These numbers include each viewer, which differ in maturity, so they are not a comparison between cores.

## Frame latency of a drag

Median time from a pointer move to the frame that shows the point moved: 16 ms per frame, 50 ms for a rebuild. Under it: p90 and how many of the moves got a frame.

| Fixture | Rust | cells |
|---|---|---|
| depth-1000 | ✗ 324 ms<br><sub>p90 529 ms · 8/61 frames</sub> | ✗ 17 ms<br><sub>p90 24 ms · 60/61 frames</sub> |
| depth-10000 | timeout at load | ✗ 142 ms<br><sub>p90 168 ms · 60/61 frames</sub> |
| breadth-1000 | ✗ 198 ms<br><sub>p90 214 ms · 12/61 frames</sub> | ✓ 14 ms<br><sub>p90 22 ms · 60/61 frames</sub> |
| breadth-10000 | timeout at load | ✗ 153 ms<br><sub>p90 200 ms · 60/61 frames</sub> |
| inversion-1000 | not comparable<br><sub>wrong values in the Node layer</sub> | ✓ 15 ms<br><sub>p90 21 ms · 60/61 frames</sub> |
| inversion-10000 | timeout at load | ✗ 128 ms<br><sub>p90 165 ms · 60/61 frames</sub> |
| symbolic-1000 | timeout at load | ✗ 85 ms<br><sub>p90 103 ms · 60/61 frames</sub> |
| rebuild-1000 | not comparable<br><sub>wrong values in the Node layer</sub> | ✓ 23 ms<br><sub>p90 68 ms · 60/61 frames</sub> |
| rebuild-10000 | not comparable<br><sub>wrong values in the Node layer</sub> | ✓ 7.85 ms<br><sub>p90 441 ms · 60/61 frames</sub> |
| rebuild-100000 | not comparable<br><sub>wrong values in the Node layer</sub> | not comparable<br><sub>wrong values in the Node layer</sub> |
| lesson | error at load | ✓ 3.73 ms<br><sub>p90 6.43 ms · 60/61 frames</sub> |
| sir | error at load | ✗ 20 ms<br><sub>p90 467 ms · 19/61 frames</sub> |

## Load

Text to first render. The budget, 100 ms, is for `homework`; the other loads are for reference.

| Fixture | Rust | cells |
|---|---|---|
| depth-1000 | 21 s | 683 ms |
| depth-10000 | timeout at load | 1.8 s |
| depth-100000 | timeout at load | 8.1 s |
| breadth-1000 | 18 s | 550 ms |
| breadth-10000 | timeout at load | 1.8 s |
| breadth-100000 | timeout at load | 9.8 s |
| inversion-1000 | 26 s | 633 ms |
| inversion-10000 | timeout at load | 1.8 s |
| inversion-100000 | timeout at load | 8.2 s |
| symbolic-1000 | timeout at load | 830 ms |
| symbolic-10000 | timeout at load | 2.6 s |
| symbolic-100000 | timeout at load | 15 s |
| rebuild-1000 | 1.6 s | 455 ms |
| rebuild-10000 | 1.7 s | 1.2 s |
| rebuild-100000 | 1.5 s | 1.1 s |
| homework | error at load | ✗ 489 ms |
| lesson | error at load | 441 ms |
| sir | error at load | 622 ms |
| venn | error at load | 613 ms |

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
| rust (prototype viewer page) | ✗ 4.31 MB<br><sub>raw 26.06 MB</sub> |
| cells (viewer build) | ✗ 1.29 MB<br><sub>raw 6.63 MB</sub> |

Memory per viewer (budget 20 MB) is measured by `packages/memory-benchmark`, not in a run.
