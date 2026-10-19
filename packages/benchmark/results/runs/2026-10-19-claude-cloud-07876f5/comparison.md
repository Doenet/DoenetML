# Comparison: 2026-10-19-claude-cloud-07876f5

Machine **claude-cloud** (Intel(R) Xeon(R) Processor @ 2.80GHz, 4 cores, 16093 MB, Linux 6.18.44-fc-v139 x64, Node v22.22.0); commit `07876f5`; 2026-10-19.

Builds: JS: source, bundled by scripts/bundle-driver.mjs; Rust: wasm-pack --dev at opt-level 3, without logging features; cells: wasm-pack --release (npm run build -w packages/cells-core).

Each cell compares two cores on one shape at one size: the bold line says which is faster and by how much; the line under it gives each core's time. The shapes and what they exercise are in [METHOD.md](../../../METHOD.md).

- **Tick** is the median time of the shape's primary action, less the core's adapter floor (below). ‡: a tick within twice its floor, so its own time is below what the adapter lets us see; the ratio is then a bound ("> N×") taken from that floor.
- **> 15 s**: the core did not finish one tick in 15 s, or **> 120 s** its load in 120 s. † marks a ratio that is then a lower bound, its slow side unchecked, or one whose value check did not finish. A core whose load did not finish has no tick.
- **not comparable**: a core finished, but its values after the check step are wrong. **—**: a core cannot run the shape (see [coverage](coverage.md)).

Adapter floor (the drag on a document of one free point): JS 3.42 ms, Rust 0.29 ms, cells 44 µs.

## Tick

### JS and Rust

| Shape | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth | **Rust 7.7×**<br><sub>JS 1.0 s · Rust 131 ms</sub> | —<br><sub>JS load > 120 s</sub> | —<br><sub>JS load > 120 s</sub> |
| breadth | **Rust 9.8×**<br><sub>JS 758 ms · Rust 77 ms</sub> | —<br><sub>JS load > 120 s</sub> | —<br><sub>JS load > 120 s</sub> |
| inversion | not comparable<br><sub>Rust: c0 = -998, expected -994; c999 = 1, expected 5</sub> | —<br><sub>JS load > 120 s</sub> | —<br><sub>JS load > 120 s</sub> |
| symbolic | **JS ≥ 15×** †<br><sub>JS 1.0 s · Rust > 15 s</sub> | —<br><sub>JS load > 120 s</sub> | —<br><sub>JS load > 120 s</sub> |
| rebuild | not comparable<br><sub>Rust: r[999].h did not resolve</sub> | —<br><sub>JS load > 120 s</sub> | —<br><sub>JS load > 120 s</sub> |

### JS and cells

| Shape | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth | **cells 10,247×**<br><sub>JS 1.0 s · cells 99 µs</sub> | —<br><sub>JS load > 120 s</sub> | —<br><sub>JS load > 120 s</sub> |
| breadth | **cells 9,059×**<br><sub>JS 758 ms · cells 84 µs</sub> | —<br><sub>JS load > 120 s</sub> | —<br><sub>JS load > 120 s</sub> |
| inversion | **cells 17,818×**<br><sub>JS 1.4 s · cells 79 µs</sub> | —<br><sub>JS load > 120 s</sub> | —<br><sub>JS load > 120 s</sub> |
| symbolic | **cells 22×**<br><sub>JS 1.0 s · cells 46 ms</sub> | —<br><sub>JS load > 120 s</sub> | —<br><sub>JS load > 120 s</sub> |
| rebuild | **cells 3,371×**<br><sub>JS 8.5 s · cells 2.52 ms</sub> | —<br><sub>JS load > 120 s</sub> | —<br><sub>JS load > 120 s</sub> |

### Rust and cells

| Shape | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth | **cells 1,326×**<br><sub>Rust 131 ms · cells 99 µs</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| breadth | **cells 920×**<br><sub>Rust 77 ms · cells 84 µs</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| inversion | not comparable<br><sub>Rust: c0 = -998, expected -994; c999 = 1, expected 5</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| symbolic | **cells ≥ 328×** †<br><sub>Rust > 15 s · cells 46 ms</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| rebuild | not comparable<br><sub>Rust: r[999].h did not resolve</sub> | not comparable<br><sub>Rust: r[9999].h did not resolve</sub> | not comparable<br><sub>Rust: r[99999].h did not resolve</sub> |

## Load

### JS and Rust

| Shape | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth | **Rust 5.3×**<br><sub>JS 12 s · Rust 2.3 s</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| breadth | **Rust 4.5×**<br><sub>JS 12 s · Rust 2.6 s</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| inversion | not comparable<br><sub>Rust: c0 = -998, expected -994; c999 = 1, expected 5</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| symbolic | **JS 7.0×**<br><sub>JS 9.3 s · Rust 65 s</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| rebuild | not comparable<br><sub>Rust: r[999].h did not resolve</sub> | not comparable<br><sub>Rust: r[9999].h did not resolve</sub> | not comparable<br><sub>Rust: r[99999].h did not resolve</sub> |

### JS and cells

| Shape | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth | **cells 40×**<br><sub>JS 12 s · cells 306 ms</sub> | **cells ≥ 135×** †<br><sub>JS > 120 s · cells 889 ms</sub> | **cells ≥ 15×** †<br><sub>JS > 120 s · cells 8.1 s</sub> |
| breadth | **cells 41×**<br><sub>JS 12 s · cells 283 ms</sub> | **cells ≥ 122×** †<br><sub>JS > 120 s · cells 983 ms</sub> | **cells ≥ 15×** †<br><sub>JS > 120 s · cells 7.8 s</sub> |
| inversion | **cells 35×**<br><sub>JS 10 s · cells 290 ms</sub> | **cells ≥ 128×** †<br><sub>JS > 120 s · cells 939 ms</sub> | **cells ≥ 16×** †<br><sub>JS > 120 s · cells 7.3 s</sub> |
| symbolic | **cells 22×**<br><sub>JS 9.3 s · cells 424 ms</sub> | **cells ≥ 73×** †<br><sub>JS > 120 s · cells 1.6 s</sub> | **cells ≥ 7.4×** †<br><sub>JS > 120 s · cells 16 s</sub> |
| rebuild | **cells 360×**<br><sub>JS 33 s · cells 93 ms</sub> | **cells ≥ 698×** †<br><sub>JS > 120 s · cells 172 ms</sub> | not comparable<br><sub>cells: r[99999].h did not resolve</sub> |

### Rust and cells

| Shape | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth | **cells 7.5×**<br><sub>Rust 2.3 s · cells 306 ms</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| breadth | **cells 9.3×**<br><sub>Rust 2.6 s · cells 283 ms</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| inversion | not comparable<br><sub>Rust: c0 = -998, expected -994; c999 = 1, expected 5</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| symbolic | **cells 154×**<br><sub>Rust 65 s · cells 424 ms</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| rebuild | not comparable<br><sub>Rust: r[999].h did not resolve</sub> | not comparable<br><sub>Rust: r[9999].h did not resolve</sub> | not comparable<br><sub>Rust: r[99999].h did not resolve</sub> |

## Memory

After the load: the growth of the JS heap, and the size of the core's wasm linear memory (which never shrinks). Two kinds of memory, so no ratio.

| Shape, core | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth, JS | heap +152 MB<br><sub>wasm 7.6 MB</sub> |  |  |
| depth, Rust | heap +0.0 MB<br><sub>wasm 295 MB</sub> |  |  |
| depth, cells | heap +1.8 MB<br><sub>wasm 2.3 MB</sub> | heap +1.9 MB<br><sub>wasm 9.3 MB</sub> | heap +0.0 MB<br><sub>wasm 87 MB</sub> |
| breadth, JS | heap +151 MB<br><sub>wasm 8.4 MB</sub> |  |  |
| breadth, Rust | heap +0.0 MB<br><sub>wasm 373 MB</sub> |  |  |
| breadth, cells | heap +1.8 MB<br><sub>wasm 2.3 MB</sub> | heap +2.0 MB<br><sub>wasm 9.9 MB</sub> | heap +0.0 MB<br><sub>wasm 85 MB</sub> |
| inversion, JS | heap +151 MB<br><sub>wasm 7.6 MB</sub> |  |  |
| inversion, Rust | heap +0.0 MB<br><sub>wasm 220 MB</sub> |  |  |
| inversion, cells | heap +1.8 MB<br><sub>wasm 2.3 MB</sub> | heap +1.9 MB<br><sub>wasm 9.4 MB</sub> | heap +0.0 MB<br><sub>wasm 83 MB</sub> |
| symbolic, JS | heap +106 MB<br><sub>wasm 8.4 MB</sub> |  |  |
| symbolic, Rust | heap +0.0 MB<br><sub>wasm 1264 MB</sub> |  |  |
| symbolic, cells | heap +1.8 MB<br><sub>wasm 3.1 MB</sub> | heap +1.8 MB<br><sub>wasm 18 MB</sub> | heap +0.0 MB<br><sub>wasm 161 MB</sub> |
| rebuild, JS | heap +402 MB<br><sub>wasm 5.7 MB</sub> |  |  |
| rebuild, Rust | heap +1.7 MB<br><sub>wasm 1.4 MB</sub> | heap +1.8 MB<br><sub>wasm 1.4 MB</sub> | heap +1.8 MB<br><sub>wasm 1.4 MB</sub> |
| rebuild, cells | heap +1.8 MB<br><sub>wasm 3.2 MB</sub> | heap +1.8 MB<br><sub>wasm 17 MB</sub> | heap +1.8 MB<br><sub>wasm 17 MB</sub> |

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
