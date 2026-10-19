# Comparison: 2026-10-19-claude-cloud-8be33f4

Machine **claude-cloud** (Intel(R) Xeon(R) Processor @ 2.80GHz, 4 cores, 16093 MB, Linux 6.18.44-fc-v139 x64, Node v22.22.0); commit `8be33f4`; 2026-10-19.

Builds: JS: source, bundled by scripts/bundle-driver.mjs; Rust: wasm-pack --dev at opt-level 3, without logging features; cells: wasm-pack --release (npm run build -w packages/cells-core).

Each cell compares two cores on one shape at one size: the bold line says which is faster and by how much; the line under it gives each core's time. The shapes and what they exercise are in [METHOD.md](../../../METHOD.md).

- **Tick** is the median time of the shape's primary action, less the core's adapter floor (below). ‡: a tick within twice its floor, so its own time is below what the adapter lets us see; the ratio is then a bound ("> N×") taken from that floor.
- **> 15 s**: the core did not finish one tick in 15 s, or **> 120 s** its load in 120 s. † marks a ratio that is then a lower bound, its slow side unchecked, or one whose value check did not finish. A core whose load did not finish has no tick.
- **not comparable**: a core finished, but its values after the check step are wrong. **—**: a core cannot run the shape (see [coverage](coverage.md)).

Adapter floor (the drag on a document of one free point): JS 2.63 ms, Rust 0.13 ms, cells 24 µs.

## Tick

### JS and Rust

| Shape | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth | **Rust 6.7×**<br><sub>JS 626 ms · Rust 93 ms</sub> | —<br><sub>Rust error</sub> | —<br><sub>JS load > 120 s</sub> |
| breadth | **Rust 7.9×**<br><sub>JS 484 ms · Rust 61 ms</sub> | —<br><sub>Rust error</sub> | —<br><sub>JS load > 120 s</sub> |
| inversion | not comparable<br><sub>Rust: c0 = 2, expected 6; c999 = 1001, expected 1005</sub> | —<br><sub>JS error</sub> | —<br><sub>JS load > 120 s</sub> |
| symbolic | **JS ≥ 22×** †<br><sub>JS 669 ms · Rust > 15 s</sub> | —<br><sub>Rust error</sub> | —<br><sub>JS load > 120 s</sub> |
| rebuild | not comparable<br><sub>Rust: r[999].h did not resolve</sub> | —<br><sub>JS load > 120 s</sub> | —<br><sub>JS load > 120 s</sub> |

### JS and cells

| Shape | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth | **cells 7,607×**<br><sub>JS 626 ms · cells 82 µs</sub> | **cells 27,399×** †<br><sub>JS 9.0 s (unchecked) · cells 0.33 ms</sub> | —<br><sub>JS load > 120 s</sub> |
| breadth | **cells 5,844×**<br><sub>JS 484 ms · cells 83 µs</sub> | **cells 28,171×** †<br><sub>JS 8.8 s (unchecked) · cells 0.31 ms</sub> | —<br><sub>JS load > 120 s</sub> |
| inversion | **cells 13,171×**<br><sub>JS 986 ms · cells 75 µs</sub> | —<br><sub>JS error</sub> | —<br><sub>JS load > 120 s</sub> |
| symbolic | **cells 18×**<br><sub>JS 669 ms · cells 38 ms</sub> | **cells ≥ 38×** †<br><sub>JS > 15 s · cells 390 ms</sub> | —<br><sub>JS load > 120 s</sub> |
| rebuild | **cells 3,795×** †<br><sub>JS 6.4 s (unchecked) · cells 1.69 ms</sub> | —<br><sub>JS load > 120 s</sub> | —<br><sub>JS load > 120 s</sub> |

### Rust and cells

| Shape | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth | **cells 1,134×**<br><sub>Rust 93 ms · cells 82 µs</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| breadth | **cells 738×**<br><sub>Rust 61 ms · cells 83 µs</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| inversion | not comparable<br><sub>Rust: c0 = 2, expected 6; c999 = 1001, expected 1005</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| symbolic | **cells ≥ 393×** †<br><sub>Rust > 15 s · cells 38 ms</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| rebuild | not comparable<br><sub>Rust: r[999].h did not resolve</sub> | not comparable<br><sub>Rust: r[9999].h did not resolve</sub> | not comparable<br><sub>Rust: r[99999].h did not resolve</sub> |

## Load

### JS and Rust

| Shape | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth | **Rust 5.9×**<br><sub>JS 9.2 s · Rust 1.6 s</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| breadth | **Rust 4.6×**<br><sub>JS 8.4 s · Rust 1.8 s</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| inversion | not comparable<br><sub>Rust: c0 = 2, expected 6; c999 = 1001, expected 1005</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| symbolic | **JS 6.7×**<br><sub>JS 6.4 s · Rust 43 s</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| rebuild | not comparable<br><sub>Rust: r[999].h did not resolve</sub> | not comparable<br><sub>Rust: r[9999].h did not resolve</sub> | not comparable<br><sub>Rust: r[99999].h did not resolve</sub> |

### JS and cells

| Shape | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth | **cells 42×**<br><sub>JS 9.2 s · cells 219 ms</sub> | **cells 157×**<br><sub>JS 113 s · cells 719 ms</sub> | **cells ≥ 21×** †<br><sub>JS > 120 s · cells 5.6 s</sub> |
| breadth | **cells 34×**<br><sub>JS 8.4 s · cells 247 ms</sub> | **cells 152×**<br><sub>JS 116 s · cells 766 ms</sub> | **cells ≥ 18×** †<br><sub>JS > 120 s · cells 6.6 s</sub> |
| inversion | **cells 28×**<br><sub>JS 6.8 s · cells 240 ms</sub> | **cells 111×**<br><sub>JS 73 s · cells 656 ms</sub> | **cells ≥ 22×** †<br><sub>JS > 120 s · cells 5.4 s</sub> |
| symbolic | **cells 19×**<br><sub>JS 6.4 s · cells 328 ms</sub> | **cells 74×**<br><sub>JS 96 s · cells 1.3 s</sub> | **cells ≥ 9.4×** †<br><sub>JS > 120 s · cells 13 s</sub> |
| rebuild | **cells 378×**<br><sub>JS 27 s · cells 71 ms</sub> | **cells ≥ 978×** †<br><sub>JS > 120 s · cells 123 ms</sub> | not comparable<br><sub>cells: r[99999].h did not resolve</sub> |

### Rust and cells

| Shape | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth | **cells 7.2×**<br><sub>Rust 1.6 s · cells 219 ms</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| breadth | **cells 7.4×**<br><sub>Rust 1.8 s · cells 247 ms</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| inversion | not comparable<br><sub>Rust: c0 = 2, expected 6; c999 = 1001, expected 1005</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| symbolic | **cells 131×**<br><sub>Rust 43 s · cells 328 ms</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| rebuild | not comparable<br><sub>Rust: r[999].h did not resolve</sub> | not comparable<br><sub>Rust: r[9999].h did not resolve</sub> | not comparable<br><sub>Rust: r[99999].h did not resolve</sub> |

## Memory

After the load: the growth of the JS heap, and the size of the core's wasm linear memory (which never shrinks). Two kinds of memory, so no ratio.

| Shape, core | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth, JS | heap +152 MB<br><sub>wasm 7.6 MB</sub> | heap +1410 MB<br><sub>wasm 67 MB</sub> |  |
| depth, Rust | heap +0.0 MB<br><sub>wasm 295 MB</sub> |  |  |
| depth, cells | heap +1.8 MB<br><sub>wasm 2.3 MB</sub> | heap +2.0 MB<br><sub>wasm 9.3 MB</sub> | heap +0.0 MB<br><sub>wasm 87 MB</sub> |
| breadth, JS | heap +151 MB<br><sub>wasm 8.4 MB</sub> | heap +1410 MB<br><sub>wasm 74 MB</sub> |  |
| breadth, Rust | heap +0.0 MB<br><sub>wasm 373 MB</sub> |  |  |
| breadth, cells | heap +1.8 MB<br><sub>wasm 2.3 MB</sub> | heap +2.0 MB<br><sub>wasm 9.9 MB</sub> | heap +0.0 MB<br><sub>wasm 85 MB</sub> |
| inversion, JS | heap +151 MB<br><sub>wasm 7.6 MB</sub> | heap +1392 MB<br><sub>wasm 67 MB</sub> |  |
| inversion, Rust | heap +0.0 MB<br><sub>wasm 221 MB</sub> |  |  |
| inversion, cells | heap +1.8 MB<br><sub>wasm 2.3 MB</sub> | heap +1.9 MB<br><sub>wasm 9.6 MB</sub> | heap +0.0 MB<br><sub>wasm 80 MB</sub> |
| symbolic, JS | heap +106 MB<br><sub>wasm 8.4 MB</sub> | heap +947 MB<br><sub>wasm 74 MB</sub> |  |
| symbolic, Rust | heap +0.0 MB<br><sub>wasm 1264 MB</sub> |  |  |
| symbolic, cells | heap +1.8 MB<br><sub>wasm 3.1 MB</sub> | heap +1.8 MB<br><sub>wasm 18 MB</sub> | heap +0.0 MB<br><sub>wasm 161 MB</sub> |
| rebuild, JS | heap +402 MB<br><sub>wasm 5.8 MB</sub> |  |  |
| rebuild, Rust | heap +1.7 MB<br><sub>wasm 1.4 MB</sub> | heap +1.7 MB<br><sub>wasm 1.4 MB</sub> | heap +1.7 MB<br><sub>wasm 1.4 MB</sub> |
| rebuild, cells | heap +1.8 MB<br><sub>wasm 3.1 MB</sub> | heap +1.8 MB<br><sub>wasm 18 MB</sub> | heap +1.8 MB<br><sub>wasm 18 MB</sub> |

<details><summary>Every measurement</summary>

| Fixture | Core | Status | Load | Tick (median, p90, n) | Floored | Heap | Wasm | Check |
|---|---|---|---|---|---|---|---|---|
| floor | JS | ok | 254 ms | 2.63 ms, 5.06 ms, 20 | yes | 5.8 MB | 1.3 MB | ok |
| floor | Rust | ok | 70 ms | 0.13 ms, 0.19 ms, 20 | yes | 1.7 MB | 1.3 MB | ok |
| floor | cells | ok | 59 ms | 24 µs, 0.11 ms, 20 | yes | 1.7 MB | 1.4 MB | ok |
| depth-1000 | JS | ok | 9.2 s | 628 ms, 762 ms, 20 |  | 152 MB | 7.6 MB | ok |
| depth-1000 | Rust | ok | 1.6 s | 93 ms, 139 ms, 20 |  | 0.0 MB | 295 MB | ok |
| depth-1000 | cells | ok | 219 ms | 0.11 ms, 0.24 ms, 20 |  | 1.8 MB | 2.3 MB | ok |
| depth-10000 | JS | timeout at check | 113 s | 9.0 s, 9.9 s, 3 |  | 1410 MB | 67 MB |  |
| depth-10000 | Rust | error at load |  |  |  |  |  |  |
| depth-10000 | cells | ok | 719 ms | 0.35 ms, 0.49 ms, 20 |  | 2.0 MB | 9.3 MB | ok |
| depth-100000 | JS | timeout at load |  |  |  |  |  |  |
| depth-100000 | Rust | error at load |  |  |  |  |  |  |
| depth-100000 | cells | ok | 5.6 s | 2.91 ms, 7.95 ms, 20 |  | 0.0 MB | 87 MB | ok |
| breadth-1000 | JS | ok | 8.4 s | 487 ms, 609 ms, 20 |  | 151 MB | 8.4 MB | ok |
| breadth-1000 | Rust | ok | 1.8 s | 61 ms, 79 ms, 20 |  | 0.0 MB | 373 MB | ok |
| breadth-1000 | cells | ok | 247 ms | 0.11 ms, 0.22 ms, 20 |  | 1.8 MB | 2.3 MB | ok |
| breadth-10000 | JS | timeout at check | 116 s | 8.8 s, 9.7 s, 3 |  | 1410 MB | 74 MB |  |
| breadth-10000 | Rust | error at load |  |  |  |  |  |  |
| breadth-10000 | cells | ok | 766 ms | 0.34 ms, 0.43 ms, 20 |  | 2.0 MB | 9.9 MB | ok |
| breadth-100000 | JS | timeout at load |  |  |  |  |  |  |
| breadth-100000 | Rust | error at load |  |  |  |  |  |  |
| breadth-100000 | cells | ok | 6.6 s | 2.26 ms, 2.37 ms, 20 |  | 0.0 MB | 85 MB | ok |
| inversion-1000 | JS | ok | 6.8 s | 989 ms, 1.0 s, 3 |  | 151 MB | 7.6 MB | ok |
| inversion-1000 | Rust | ok | 1.7 s | 0.28 ms, 0.54 ms, 20 |  | 0.0 MB | 221 MB | c0 = 2, expected 6; c999 = 1001, expected 1005 |
| inversion-1000 | cells | ok | 240 ms | 99 µs, 0.20 ms, 20 |  | 1.8 MB | 2.3 MB | ok |
| inversion-10000 | JS | error at tick | 73 s |  |  | 1392 MB | 67 MB |  |
| inversion-10000 | Rust | error at load |  |  |  |  |  |  |
| inversion-10000 | cells | ok | 656 ms | 0.41 ms, 0.64 ms, 20 |  | 1.9 MB | 9.6 MB | ok |
| inversion-100000 | JS | timeout at load |  |  |  |  |  |  |
| inversion-100000 | Rust | error at load |  |  |  |  |  |  |
| inversion-100000 | cells | ok | 5.4 s | 3.80 ms, 5.22 ms, 20 |  | 0.0 MB | 80 MB | ok |
| symbolic-1000 | JS | ok | 6.4 s | 672 ms, 734 ms, 20 |  | 106 MB | 8.4 MB | ok |
| symbolic-1000 | Rust | timeout at tick | 43 s |  |  | 0.0 MB | 1264 MB |  |
| symbolic-1000 | cells | ok | 328 ms | 38 ms, 39 ms, 20 |  | 1.8 MB | 3.1 MB | ok |
| symbolic-10000 | JS | timeout at tick | 96 s | 13 s, 13 s, 1 |  | 947 MB | 74 MB |  |
| symbolic-10000 | Rust | error at load |  |  |  |  |  |  |
| symbolic-10000 | cells | ok | 1.3 s | 390 ms, 413 ms, 20 |  | 1.8 MB | 18 MB | ok |
| symbolic-100000 | JS | timeout at load |  |  |  |  |  |  |
| symbolic-100000 | Rust | error at load |  |  |  |  |  |  |
| symbolic-100000 | cells | ok | 13 s | 3.7 s, 3.9 s, 3 |  | 0.0 MB | 161 MB | ok |
| rebuild-1000 | JS | timeout at check | 27 s | 6.4 s, 6.6 s, 3 |  | 402 MB | 5.8 MB |  |
| rebuild-1000 | Rust | ok | 75 ms | 0.13 ms, 0.22 ms, 20 | yes | 1.7 MB | 1.4 MB | r[999].h did not resolve |
| rebuild-1000 | cells | ok | 71 ms | 1.72 ms, 1.95 ms, 20 |  | 1.8 MB | 3.1 MB | ok |
| rebuild-10000 | JS | timeout at load |  |  |  |  |  |  |
| rebuild-10000 | Rust | ok | 84 ms | 0.13 ms, 0.33 ms, 20 | yes | 1.7 MB | 1.4 MB | r[9999].h did not resolve |
| rebuild-10000 | cells | ok | 123 ms | 19 ms, 22 ms, 20 |  | 1.8 MB | 18 MB | ok |
| rebuild-100000 | JS | timeout at load |  |  |  |  |  |  |
| rebuild-100000 | Rust | ok | 72 ms | 0.16 ms, 0.74 ms, 20 | yes | 1.7 MB | 1.4 MB | r[99999].h did not resolve |
| rebuild-100000 | cells | ok | 124 ms | 0.35 ms, 0.46 ms, 20 |  | 1.8 MB | 18 MB | r[99999].h did not resolve |
| homework | JS | ok | 1.2 s | 9.09 ms, 11 ms, 20 |  | 25 MB | 2.0 MB |  |
| homework | Rust | unsupported at tick | 91 ms |  |  | 1.9 MB | 2.3 MB |  |
| homework | cells | ok | 113 ms | 0.14 ms, 0.37 ms, 20 |  | 1.9 MB | 1.6 MB |  |
| lesson | JS | ok | 1.2 s | 18 ms, 26 ms, 20 |  | 22 MB | 1.9 MB |  |
| lesson | Rust | ok | 192 ms | 0.76 ms, 0.95 ms, 20 |  | 6.1 MB | 2.6 MB |  |
| lesson | cells | ok | 99 ms | 57 µs, 0.16 ms, 20 |  | 1.9 MB | 1.5 MB |  |
| sir | JS | ok | 14 s | 2.8 s, 3.1 s, 3 |  | 215 MB | 3.8 MB |  |
| sir | Rust | ok | 118 ms | 0.11 ms, 0.16 ms, 20 | yes | 1.8 MB | 2.6 MB |  |
| sir | cells | ok | 120 ms | 0.17 ms, 0.59 ms, 20 |  | 1.8 MB | 3.6 MB |  |
| venn | JS | ok | 1.9 s | 94 ms, 115 ms, 20 |  | 35 MB | 4.8 MB |  |
| venn | Rust | unsupported at tick | 144 ms |  |  | 1.8 MB | 4.8 MB |  |
| venn | cells | unsupported at tick | 128 ms |  |  | 1.8 MB | 1.6 MB |  |

</details>
