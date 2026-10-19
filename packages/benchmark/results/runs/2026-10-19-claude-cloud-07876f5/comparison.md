# Comparison: 2026-10-19-claude-cloud-07876f5

Machine **claude-cloud** (Intel(R) Xeon(R) Processor @ 2.80GHz, 4 cores, 16093 MB, Linux 6.18.44-fc-v139 x64, Node v22.22.0); commit `07876f5`; 2026-10-19.

Builds: JS: source, bundled by scripts/bundle-driver.mjs; Rust: wasm-pack --dev at opt-level 3, without logging features; cells: wasm-pack --release (npm run build -w packages/cells-core).

Every core side by side, one row per shape and size. The JS column gives its time; every other column gives how many times faster or slower that core is than JS, with its own time under it. The shapes and what they exercise are in [METHOD.md](../../../METHOD.md).

- **Tick** is the median time of the shape's primary action, less the core's adapter floor (below). ‡: a tick within twice its floor, so its own time is below what the adapter lets us see; the ratio is then a bound ("> N×") taken from that floor.
- **> 15 s**: the core did not finish one tick in 15 s, or **> 120 s** its load in 120 s; a ratio against it is a bound ("≥ N×"). †: a value that was not checked, because its core did not finish or its check ran out of time. A core whose load did not finish has no tick.
- **not comparable**: the core finished, but its values after the check step are wrong. **—**: the core cannot run the shape, or was not tried at that size after failing a smaller one (see [coverage](coverage.md)).

Adapter floor (the drag on a document of one free point): JS 3.42 ms, Rust 0.29 ms, cells 44 µs.

## Tick

| Shape | Size | JS | Rust | cells |
|---|---|---|---|---|
| depth | 1,000 | **1.0 s** | **7.7× faster**<br><sub>131 ms</sub> | **10,247× faster**<br><sub>99 µs</sub> |
| depth | 10,000 | —<br><sub>load > 120 s</sub> | —<br><sub>error: unreachable</sub> | **0.44 ms** |
| depth | 100,000 | —<br><sub>load > 120 s</sub> | —<br><sub>error: unreachable</sub> | **3.82 ms** |
| breadth | 1,000 | **758 ms** | **9.8× faster**<br><sub>77 ms</sub> | **9,059× faster**<br><sub>84 µs</sub> |
| breadth | 10,000 | —<br><sub>load > 120 s</sub> | —<br><sub>error: unreachable</sub> | **0.38 ms** |
| breadth | 100,000 | —<br><sub>load > 120 s</sub> | —<br><sub>error: unreachable</sub> | **3.47 ms** |
| inversion | 1,000 | **1.4 s** | not comparable<br><sub>c0 = -998, expected -994; c999 = 1, expected 5</sub> | **17,818× faster**<br><sub>79 µs</sub> |
| inversion | 10,000 | —<br><sub>load > 120 s</sub> | —<br><sub>error: unreachable</sub> | **0.46 ms** |
| inversion | 100,000 | —<br><sub>load > 120 s</sub> | —<br><sub>error: unreachable</sub> | **4.98 ms** |
| symbolic | 1,000 | **1.0 s** | **≥ 15× slower** †<br><sub>> 15 s</sub> | **22× faster**<br><sub>46 ms</sub> |
| symbolic | 10,000 | —<br><sub>load > 120 s</sub> | —<br><sub>error: unreachable</sub> | **486 ms** |
| symbolic | 100,000 | —<br><sub>load > 120 s</sub> | —<br><sub>error: unreachable</sub> | **4.7 s** |
| rebuild | 1,000 | **8.5 s** | not comparable<br><sub>r[999].h did not resolve</sub> | **3,371× faster**<br><sub>2.52 ms</sub> |
| rebuild | 10,000 | —<br><sub>load > 120 s</sub> | not comparable<br><sub>r[9999].h did not resolve</sub> | **27 ms** |
| rebuild | 100,000 | —<br><sub>load > 120 s</sub> | not comparable<br><sub>r[99999].h did not resolve</sub> | not comparable<br><sub>r[99999].h did not resolve</sub> |

## Load

| Shape | Size | JS | Rust | cells |
|---|---|---|---|---|
| depth | 1,000 | **12 s** | **5.3× faster**<br><sub>2.3 s</sub> | **40× faster**<br><sub>306 ms</sub> |
| depth | 10,000 | **> 120 s** | —<br><sub>error: unreachable</sub> | **≥ 135× faster** †<br><sub>889 ms</sub> |
| depth | 100,000 | **> 120 s** | —<br><sub>error: unreachable</sub> | **≥ 15× faster** †<br><sub>8.1 s</sub> |
| breadth | 1,000 | **12 s** | **4.5× faster**<br><sub>2.6 s</sub> | **41× faster**<br><sub>283 ms</sub> |
| breadth | 10,000 | **> 120 s** | —<br><sub>error: unreachable</sub> | **≥ 122× faster** †<br><sub>983 ms</sub> |
| breadth | 100,000 | **> 120 s** | —<br><sub>error: unreachable</sub> | **≥ 15× faster** †<br><sub>7.8 s</sub> |
| inversion | 1,000 | **10 s** | not comparable<br><sub>c0 = -998, expected -994; c999 = 1, expected 5</sub> | **35× faster**<br><sub>290 ms</sub> |
| inversion | 10,000 | **> 120 s** | —<br><sub>error: unreachable</sub> | **≥ 128× faster** †<br><sub>939 ms</sub> |
| inversion | 100,000 | **> 120 s** | —<br><sub>error: unreachable</sub> | **≥ 16× faster** †<br><sub>7.3 s</sub> |
| symbolic | 1,000 | **9.3 s** | **7.0× slower**<br><sub>65 s</sub> | **22× faster**<br><sub>424 ms</sub> |
| symbolic | 10,000 | **> 120 s** | —<br><sub>error: unreachable</sub> | **≥ 73× faster** †<br><sub>1.6 s</sub> |
| symbolic | 100,000 | **> 120 s** | —<br><sub>error: unreachable</sub> | **≥ 7.4× faster** †<br><sub>16 s</sub> |
| rebuild | 1,000 | **33 s** | not comparable<br><sub>r[999].h did not resolve</sub> | **360× faster**<br><sub>93 ms</sub> |
| rebuild | 10,000 | **> 120 s** | not comparable<br><sub>r[9999].h did not resolve</sub> | **≥ 698× faster** †<br><sub>172 ms</sub> |
| rebuild | 100,000 | **> 120 s** | not comparable<br><sub>r[99999].h did not resolve</sub> | not comparable<br><sub>r[99999].h did not resolve</sub> |

## Memory

After the load: the growth of the JS heap and, under it, the size of the core's wasm linear memory (which never shrinks). Two kinds of memory, so no ratio.

| Shape | Size | JS | Rust | cells |
|---|---|---|---|---|
| depth | 1,000 | heap +152 MB<br><sub>wasm 7.6 MB</sub> | heap +0.0 MB<br><sub>wasm 295 MB</sub> | heap +1.8 MB<br><sub>wasm 2.3 MB</sub> |
| depth | 10,000 |  |  | heap +1.9 MB<br><sub>wasm 9.3 MB</sub> |
| depth | 100,000 |  |  | heap +0.0 MB<br><sub>wasm 87 MB</sub> |
| breadth | 1,000 | heap +151 MB<br><sub>wasm 8.4 MB</sub> | heap +0.0 MB<br><sub>wasm 373 MB</sub> | heap +1.8 MB<br><sub>wasm 2.3 MB</sub> |
| breadth | 10,000 |  |  | heap +2.0 MB<br><sub>wasm 9.9 MB</sub> |
| breadth | 100,000 |  |  | heap +0.0 MB<br><sub>wasm 85 MB</sub> |
| inversion | 1,000 | heap +151 MB<br><sub>wasm 7.6 MB</sub> | heap +0.0 MB<br><sub>wasm 220 MB</sub> | heap +1.8 MB<br><sub>wasm 2.3 MB</sub> |
| inversion | 10,000 |  |  | heap +1.9 MB<br><sub>wasm 9.4 MB</sub> |
| inversion | 100,000 |  |  | heap +0.0 MB<br><sub>wasm 83 MB</sub> |
| symbolic | 1,000 | heap +106 MB<br><sub>wasm 8.4 MB</sub> | heap +0.0 MB<br><sub>wasm 1264 MB</sub> | heap +1.8 MB<br><sub>wasm 3.1 MB</sub> |
| symbolic | 10,000 |  |  | heap +1.8 MB<br><sub>wasm 18 MB</sub> |
| symbolic | 100,000 |  |  | heap +0.0 MB<br><sub>wasm 161 MB</sub> |
| rebuild | 1,000 | heap +402 MB<br><sub>wasm 5.7 MB</sub> | heap +1.7 MB<br><sub>wasm 1.4 MB</sub> | heap +1.8 MB<br><sub>wasm 3.2 MB</sub> |
| rebuild | 10,000 |  | heap +1.8 MB<br><sub>wasm 1.4 MB</sub> | heap +1.8 MB<br><sub>wasm 17 MB</sub> |
| rebuild | 100,000 |  | heap +1.8 MB<br><sub>wasm 1.4 MB</sub> | heap +1.8 MB<br><sub>wasm 17 MB</sub> |

<details><summary>Every measurement</summary>

| Fixture | Core | Status | Load | Tick (median, p90, n) | Floored | Heap | Wasm | Check |
|---|---|---|---|---|---|---|---|---|
| floor | JS | ok | 298 ms | 3.42 ms, 5.03 ms, 20 | yes | 5.9 MB | 1.3 MB | ok |
| floor | Rust | ok | 73 ms | 0.29 ms, 0.71 ms, 20 | yes | 1.7 MB | 1.3 MB | ok |
| floor | cells | ok | 67 ms | 44 µs, 0.16 ms, 20 | yes | 1.7 MB | 1.4 MB | ok |
| depth-1000 | JS | ok | 12 s | 1.0 s, 1.2 s, 3 |  | 152 MB | 7.6 MB | ok |
| depth-1000 | Rust | ok | 2.3 s | 132 ms, 183 ms, 20 |  | 0.0 MB | 295 MB | ok |
| depth-1000 | cells | ok | 306 ms | 0.14 ms, 0.28 ms, 20 |  | 1.8 MB | 2.3 MB | ok |
| depth-10000 | JS | timeout at load |  |  |  |  |  |  |
| depth-10000 | Rust | error at load |  |  |  |  |  |  |
| depth-10000 | cells | ok | 889 ms | 0.48 ms, 0.79 ms, 20 |  | 1.9 MB | 9.3 MB | ok |
| depth-100000 | JS | timeout at load |  |  |  |  |  |  |
| depth-100000 | Rust | error at load |  |  |  |  |  |  |
| depth-100000 | cells | ok | 8.1 s | 3.86 ms, 5.85 ms, 20 |  | 0.0 MB | 87 MB | ok |
| breadth-1000 | JS | ok | 12 s | 761 ms, 923 ms, 20 |  | 151 MB | 8.4 MB | ok |
| breadth-1000 | Rust | ok | 2.6 s | 77 ms, 98 ms, 20 |  | 0.0 MB | 373 MB | ok |
| breadth-1000 | cells | ok | 283 ms | 0.13 ms, 0.42 ms, 20 |  | 1.8 MB | 2.3 MB | ok |
| breadth-10000 | JS | timeout at load |  |  |  |  |  |  |
| breadth-10000 | Rust | error at load |  |  |  |  |  |  |
| breadth-10000 | cells | ok | 983 ms | 0.42 ms, 0.65 ms, 20 |  | 2.0 MB | 9.9 MB | ok |
| breadth-100000 | JS | timeout at load |  |  |  |  |  |  |
| breadth-100000 | Rust | error at load |  |  |  |  |  |  |
| breadth-100000 | cells | ok | 7.8 s | 3.51 ms, 4.81 ms, 20 |  | 0.0 MB | 85 MB | ok |
| inversion-1000 | JS | ok | 10 s | 1.4 s, 1.8 s, 3 |  | 151 MB | 7.6 MB | ok |
| inversion-1000 | Rust | ok | 2.6 s | 0.38 ms, 0.75 ms, 20 | yes | 0.0 MB | 220 MB | c0 = -998, expected -994; c999 = 1, expected 5 |
| inversion-1000 | cells | ok | 290 ms | 0.12 ms, 0.22 ms, 20 |  | 1.8 MB | 2.3 MB | ok |
| inversion-10000 | JS | timeout at load |  |  |  |  |  |  |
| inversion-10000 | Rust | error at load |  |  |  |  |  |  |
| inversion-10000 | cells | ok | 939 ms | 0.51 ms, 0.76 ms, 20 |  | 1.9 MB | 9.4 MB | ok |
| inversion-100000 | JS | timeout at load |  |  |  |  |  |  |
| inversion-100000 | Rust | error at load |  |  |  |  |  |  |
| inversion-100000 | cells | ok | 7.3 s | 5.02 ms, 8.10 ms, 20 |  | 0.0 MB | 83 MB | ok |
| symbolic-1000 | JS | ok | 9.3 s | 1.0 s, 1.1 s, 3 |  | 106 MB | 8.4 MB | ok |
| symbolic-1000 | Rust | timeout at tick | 65 s |  |  | 0.0 MB | 1264 MB |  |
| symbolic-1000 | cells | ok | 424 ms | 46 ms, 49 ms, 20 |  | 1.8 MB | 3.1 MB | ok |
| symbolic-10000 | JS | timeout at load |  |  |  |  |  |  |
| symbolic-10000 | Rust | error at load |  |  |  |  |  |  |
| symbolic-10000 | cells | ok | 1.6 s | 486 ms, 577 ms, 20 |  | 1.8 MB | 18 MB | ok |
| symbolic-100000 | JS | timeout at load |  |  |  |  |  |  |
| symbolic-100000 | Rust | error at load |  |  |  |  |  |  |
| symbolic-100000 | cells | ok | 16 s | 4.7 s, 4.8 s, 3 |  | 0.0 MB | 161 MB | ok |
| rebuild-1000 | JS | ok | 33 s | 8.5 s, 11 s, 3 |  | 402 MB | 5.7 MB | ok |
| rebuild-1000 | Rust | ok | 99 ms | 0.37 ms, 0.57 ms, 20 | yes | 1.7 MB | 1.4 MB | r[999].h did not resolve |
| rebuild-1000 | cells | ok | 93 ms | 2.56 ms, 3.29 ms, 20 |  | 1.8 MB | 3.2 MB | ok |
| rebuild-10000 | JS | timeout at load |  |  |  |  |  |  |
| rebuild-10000 | Rust | ok | 83 ms | 0.40 ms, 0.55 ms, 20 | yes | 1.8 MB | 1.4 MB | r[9999].h did not resolve |
| rebuild-10000 | cells | ok | 172 ms | 27 ms, 28 ms, 20 |  | 1.8 MB | 17 MB | ok |
| rebuild-100000 | JS | timeout at load |  |  |  |  |  |  |
| rebuild-100000 | Rust | ok | 156 ms | 0.45 ms, 1.52 ms, 20 | yes | 1.8 MB | 1.4 MB | r[99999].h did not resolve |
| rebuild-100000 | cells | ok | 169 ms | 0.66 ms, 0.85 ms, 20 |  | 1.8 MB | 17 MB | r[99999].h did not resolve |
| homework | JS | ok | 2.2 s | 24 ms, 34 ms, 20 |  | 25 MB | 2.0 MB |  |
| homework | Rust | unsupported at tick | 168 ms |  |  | 1.9 MB | 2.3 MB |  |
| homework | cells | ok | 140 ms | 0.30 ms, 0.77 ms, 20 |  | 1.9 MB | 1.6 MB |  |
| lesson | JS | ok | 1.8 s | 29 ms, 39 ms, 20 |  | 22 MB | 1.9 MB |  |
| lesson | Rust | ok | 249 ms | 1.21 ms, 1.88 ms, 20 |  | 6.1 MB | 2.6 MB |  |
| lesson | cells | ok | 124 ms | 60 µs, 0.15 ms, 20 | yes | 1.8 MB | 1.5 MB |  |
| sir | JS | ok | 22 s | 4.5 s, 4.6 s, 3 |  | 215 MB | 3.8 MB |  |
| sir | Rust | ok | 133 ms | 0.16 ms, 0.29 ms, 20 | yes | 1.8 MB | 2.6 MB |  |
| sir | cells | ok | 175 ms | 0.30 ms, 0.51 ms, 20 |  | 1.9 MB | 3.6 MB |  |
| venn | JS | ok | 2.5 s | 166 ms, 167 ms, 3 |  | 35 MB | 4.8 MB |  |
| venn | Rust | unsupported at tick | 201 ms |  |  | 1.8 MB | 4.8 MB |  |
| venn | cells | unsupported at tick | 207 ms |  |  | 1.8 MB | 1.6 MB |  |

</details>
