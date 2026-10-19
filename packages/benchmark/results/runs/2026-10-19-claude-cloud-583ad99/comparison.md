# Comparison: 2026-10-19-claude-cloud-583ad99

Machine **claude-cloud** (Intel(R) Xeon(R) Processor @ 2.80GHz, 4 cores, 16093 MB, Linux 6.18.44-fc-v139 x64, Node v22.22.0); commit `583ad99`; 2026-10-19.

Builds: JS: source, bundled by scripts/bundle-driver.mjs; Rust: wasm-pack --dev at opt-level 3, without logging features; cells: wasm-pack --release (npm run build -w packages/cells-core).

Each cell compares two cores on one shape at one size: the bold line says which is faster and by how much; the line under it gives each core's time. The shapes and what they exercise are in [METHOD.md](../../../METHOD.md).

- **Tick** is the median time of the shape's primary action, less the core's adapter floor (below). ‡: a tick within twice its floor, so its own time is below what the adapter lets us see; the ratio is then a bound ("> N×") taken from that floor.
- **> 15 s**: the core did not finish one tick in 15 s, or **> 15 s** its load in 15 s. † marks a ratio that is then a lower bound, its slow side unchecked, or one whose value check did not finish. A core whose load did not finish has no tick.
- **not comparable**: a core finished, but its values after the check step are wrong. **—**: a core cannot run the shape (see [coverage](coverage.md)).

Adapter floor (the drag on a document of one free point): JS 3.78 ms, Rust 0.22 ms, cells 28 µs.

## Tick

### JS and Rust

| Shape | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth | **Rust 5.2×**<br><sub>JS 568 ms · Rust 108 ms</sub> | —<br><sub>JS load > 15 s</sub> | —<br><sub>JS load > 15 s</sub> |
| breadth | **Rust 9.1×**<br><sub>JS 538 ms · Rust 59 ms</sub> | —<br><sub>JS load > 15 s</sub> | —<br><sub>JS load > 15 s</sub> |
| inversion | not comparable<br><sub>Rust: c0 = 2, expected 6; c999 = 1001, expected 1005</sub> | —<br><sub>JS load > 15 s</sub> | —<br><sub>JS load > 15 s</sub> |
| symbolic | —<br><sub>Rust load > 15 s</sub> | —<br><sub>JS load > 15 s</sub> | —<br><sub>JS load > 15 s</sub> |
| rebuild | —<br><sub>JS load > 15 s</sub> | —<br><sub>JS load > 15 s</sub> | —<br><sub>JS load > 15 s</sub> |

### JS and cells

| Shape | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth | **cells 5,556×**<br><sub>JS 568 ms · cells 0.10 ms</sub> | —<br><sub>JS load > 15 s</sub> | —<br><sub>JS load > 15 s</sub> |
| breadth | **cells 11,120×**<br><sub>JS 538 ms · cells 48 µs</sub> | —<br><sub>JS load > 15 s</sub> | —<br><sub>JS load > 15 s</sub> |
| inversion | **cells 13,857×**<br><sub>JS 883 ms · cells 64 µs</sub> | —<br><sub>JS load > 15 s</sub> | —<br><sub>JS load > 15 s</sub> |
| symbolic | **cells 16×**<br><sub>JS 653 ms · cells 40 ms</sub> | —<br><sub>JS load > 15 s</sub> | —<br><sub>JS load > 15 s</sub> |
| rebuild | —<br><sub>JS load > 15 s</sub> | —<br><sub>JS load > 15 s</sub> | —<br><sub>JS load > 15 s</sub> |

### Rust and cells

| Shape | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth | **cells 1,060×**<br><sub>Rust 108 ms · cells 0.10 ms</sub> | —<br><sub>Rust load > 15 s</sub> | —<br><sub>Rust load > 15 s</sub> |
| breadth | **cells 1,216×**<br><sub>Rust 59 ms · cells 48 µs</sub> | —<br><sub>Rust load > 15 s</sub> | —<br><sub>Rust load > 15 s</sub> |
| inversion | not comparable<br><sub>Rust: c0 = 2, expected 6; c999 = 1001, expected 1005</sub> | —<br><sub>Rust load > 15 s</sub> | —<br><sub>Rust load > 15 s</sub> |
| symbolic | —<br><sub>Rust load > 15 s</sub> | —<br><sub>Rust load > 15 s</sub> | —<br><sub>Rust load > 15 s</sub> |
| rebuild | not comparable<br><sub>Rust: r[999].h did not resolve</sub> | not comparable<br><sub>Rust: r[9999].h did not resolve</sub> | not comparable<br><sub>Rust: r[99999].h did not resolve</sub> |

## Load

### JS and Rust

| Shape | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth | **Rust 4.2×**<br><sub>JS 7.6 s · Rust 1.8 s</sub> | both > 15 s | both > 15 s |
| breadth | **Rust 4.4×**<br><sub>JS 8.5 s · Rust 1.9 s</sub> | both > 15 s | both > 15 s |
| inversion | not comparable<br><sub>Rust: c0 = 2, expected 6; c999 = 1001, expected 1005</sub> | both > 15 s | both > 15 s |
| symbolic | **JS ≥ 2.1×** †<br><sub>JS 7.1 s · Rust > 15 s</sub> | both > 15 s | both > 15 s |
| rebuild | not comparable<br><sub>Rust: r[999].h did not resolve</sub> | not comparable<br><sub>Rust: r[9999].h did not resolve</sub> | not comparable<br><sub>Rust: r[99999].h did not resolve</sub> |

### JS and cells

| Shape | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth | **cells 34×**<br><sub>JS 7.6 s · cells 221 ms</sub> | **cells ≥ 19×** †<br><sub>JS > 15 s · cells 771 ms</sub> | **cells ≥ 2.6×** †<br><sub>JS > 15 s · cells 5.7 s</sub> |
| breadth | **cells 36×**<br><sub>JS 8.5 s · cells 236 ms</sub> | **cells ≥ 20×** †<br><sub>JS > 15 s · cells 758 ms</sub> | **cells ≥ 2.4×** †<br><sub>JS > 15 s · cells 6.3 s</sub> |
| inversion | **cells 34×**<br><sub>JS 7.0 s · cells 207 ms</sub> | **cells ≥ 19×** †<br><sub>JS > 15 s · cells 779 ms</sub> | **cells ≥ 2.6×** †<br><sub>JS > 15 s · cells 5.8 s</sub> |
| symbolic | **cells 21×**<br><sub>JS 7.1 s · cells 335 ms</sub> | **cells ≥ 12×** †<br><sub>JS > 15 s · cells 1.3 s</sub> | **cells ≥ 1.1×** †<br><sub>JS > 15 s · cells 13 s</sub> |
| rebuild | **cells ≥ 186×** †<br><sub>JS > 15 s · cells 81 ms</sub> | **cells ≥ 113×** †<br><sub>JS > 15 s · cells 132 ms</sub> | not comparable<br><sub>cells: r[99999].h did not resolve</sub> |

### Rust and cells

| Shape | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth | **cells 8.1×**<br><sub>Rust 1.8 s · cells 221 ms</sub> | **cells ≥ 19×** †<br><sub>Rust > 15 s · cells 771 ms</sub> | **cells ≥ 2.6×** †<br><sub>Rust > 15 s · cells 5.7 s</sub> |
| breadth | **cells 8.2×**<br><sub>Rust 1.9 s · cells 236 ms</sub> | **cells ≥ 20×** †<br><sub>Rust > 15 s · cells 758 ms</sub> | **cells ≥ 2.4×** †<br><sub>Rust > 15 s · cells 6.3 s</sub> |
| inversion | not comparable<br><sub>Rust: c0 = 2, expected 6; c999 = 1001, expected 1005</sub> | **cells ≥ 19×** †<br><sub>Rust > 15 s · cells 779 ms</sub> | **cells ≥ 2.6×** †<br><sub>Rust > 15 s · cells 5.8 s</sub> |
| symbolic | **cells ≥ 45×** †<br><sub>Rust > 15 s · cells 335 ms</sub> | **cells ≥ 12×** †<br><sub>Rust > 15 s · cells 1.3 s</sub> | **cells ≥ 1.1×** †<br><sub>Rust > 15 s · cells 13 s</sub> |
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
| breadth, cells | heap +1.8 MB<br><sub>wasm 2.3 MB</sub> | heap +1.9 MB<br><sub>wasm 9.9 MB</sub> | heap +0.0 MB<br><sub>wasm 85 MB</sub> |
| inversion, JS | heap +150 MB<br><sub>wasm 7.6 MB</sub> |  |  |
| inversion, Rust | heap +0.0 MB<br><sub>wasm 221 MB</sub> |  |  |
| inversion, cells | heap +1.8 MB<br><sub>wasm 2.3 MB</sub> | heap +1.9 MB<br><sub>wasm 9.6 MB</sub> | heap +0.0 MB<br><sub>wasm 80 MB</sub> |
| symbolic, JS | heap +106 MB<br><sub>wasm 8.4 MB</sub> |  |  |
| symbolic, Rust |  |  |  |
| symbolic, cells | heap +1.8 MB<br><sub>wasm 3.1 MB</sub> | heap +1.8 MB<br><sub>wasm 18 MB</sub> | heap +0.0 MB<br><sub>wasm 161 MB</sub> |
| rebuild, JS |  |  |  |
| rebuild, Rust | heap +1.7 MB<br><sub>wasm 1.4 MB</sub> | heap +1.7 MB<br><sub>wasm 1.4 MB</sub> | heap +1.7 MB<br><sub>wasm 1.4 MB</sub> |
| rebuild, cells | heap +1.8 MB<br><sub>wasm 3.1 MB</sub> | heap +1.8 MB<br><sub>wasm 18 MB</sub> | heap +1.8 MB<br><sub>wasm 18 MB</sub> |

<details><summary>Every measurement</summary>

| Fixture | Core | Status | Load | Tick (median, p90, n) | Floored | Heap | Wasm | Check |
|---|---|---|---|---|---|---|---|---|
| floor | JS | ok | 213 ms | 3.78 ms, 4.94 ms, 20 | yes | 5.8 MB | 1.3 MB | ok |
| floor | Rust | ok | 82 ms | 0.22 ms, 0.39 ms, 20 | yes | 1.7 MB | 1.3 MB | ok |
| floor | cells | ok | 80 ms | 28 µs, 0.17 ms, 20 | yes | 1.7 MB | 1.4 MB | ok |
| depth-1000 | JS | ok | 7.6 s | 572 ms, 720 ms, 20 |  | 152 MB | 7.6 MB | ok |
| depth-1000 | Rust | ok | 1.8 s | 109 ms, 139 ms, 20 |  | 0.0 MB | 295 MB | ok |
| depth-1000 | cells | ok | 221 ms | 0.13 ms, 0.26 ms, 20 |  | 1.8 MB | 2.3 MB | ok |
| depth-10000 | JS | timeout at load |  |  |  |  |  |  |
| depth-10000 | Rust | timeout at load |  |  |  |  |  |  |
| depth-10000 | cells | ok | 771 ms | 0.48 ms, 0.73 ms, 20 |  | 1.9 MB | 9.3 MB | ok |
| depth-100000 | JS | timeout at load |  |  |  |  |  |  |
| depth-100000 | Rust | timeout at load |  |  |  |  |  |  |
| depth-100000 | cells | ok | 5.7 s | 3.01 ms, 3.34 ms, 20 |  | 0.0 MB | 87 MB | ok |
| breadth-1000 | JS | ok | 8.5 s | 541 ms, 609 ms, 20 |  | 151 MB | 8.4 MB | ok |
| breadth-1000 | Rust | ok | 1.9 s | 59 ms, 79 ms, 20 |  | 0.0 MB | 373 MB | ok |
| breadth-1000 | cells | ok | 236 ms | 76 µs, 0.16 ms, 20 |  | 1.8 MB | 2.3 MB | ok |
| breadth-10000 | JS | timeout at load |  |  |  |  |  |  |
| breadth-10000 | Rust | timeout at load |  |  |  |  |  |  |
| breadth-10000 | cells | ok | 758 ms | 0.26 ms, 0.97 ms, 20 |  | 1.9 MB | 9.9 MB | ok |
| breadth-100000 | JS | timeout at load |  |  |  |  |  |  |
| breadth-100000 | Rust | timeout at load |  |  |  |  |  |  |
| breadth-100000 | cells | ok | 6.3 s | 2.35 ms, 2.55 ms, 20 |  | 0.0 MB | 85 MB | ok |
| inversion-1000 | JS | ok | 7.0 s | 887 ms, 903 ms, 3 |  | 150 MB | 7.6 MB | ok |
| inversion-1000 | Rust | ok | 1.6 s | 0.31 ms, 2.54 ms, 20 | yes | 0.0 MB | 221 MB | c0 = 2, expected 6; c999 = 1001, expected 1005 |
| inversion-1000 | cells | ok | 207 ms | 91 µs, 0.25 ms, 20 |  | 1.8 MB | 2.3 MB | ok |
| inversion-10000 | JS | timeout at load |  |  |  |  |  |  |
| inversion-10000 | Rust | timeout at load |  |  |  |  |  |  |
| inversion-10000 | cells | ok | 779 ms | 0.42 ms, 0.68 ms, 20 |  | 1.9 MB | 9.6 MB | ok |
| inversion-100000 | JS | timeout at load |  |  |  |  |  |  |
| inversion-100000 | Rust | timeout at load |  |  |  |  |  |  |
| inversion-100000 | cells | ok | 5.8 s | 3.93 ms, 5.07 ms, 20 |  | 0.0 MB | 80 MB | ok |
| symbolic-1000 | JS | ok | 7.1 s | 657 ms, 733 ms, 20 |  | 106 MB | 8.4 MB | ok |
| symbolic-1000 | Rust | timeout at load |  |  |  |  |  |  |
| symbolic-1000 | cells | ok | 335 ms | 40 ms, 46 ms, 20 |  | 1.8 MB | 3.1 MB | ok |
| symbolic-10000 | JS | timeout at load |  |  |  |  |  |  |
| symbolic-10000 | Rust | timeout at load |  |  |  |  |  |  |
| symbolic-10000 | cells | ok | 1.3 s | 390 ms, 426 ms, 20 |  | 1.8 MB | 18 MB | ok |
| symbolic-100000 | JS | timeout at load |  |  |  |  |  |  |
| symbolic-100000 | Rust | timeout at load |  |  |  |  |  |  |
| symbolic-100000 | cells | ok | 13 s | 3.8 s, 4.0 s, 3 |  | 0.0 MB | 161 MB | ok |
| rebuild-1000 | JS | timeout at load |  |  |  |  |  |  |
| rebuild-1000 | Rust | ok | 89 ms | 0.13 ms, 0.23 ms, 20 | yes | 1.7 MB | 1.4 MB | r[999].h did not resolve |
| rebuild-1000 | cells | ok | 81 ms | 2.82 ms, 5.90 ms, 20 |  | 1.8 MB | 3.1 MB | ok |
| rebuild-10000 | JS | timeout at load |  |  |  |  |  |  |
| rebuild-10000 | Rust | ok | 73 ms | 0.12 ms, 2.23 ms, 20 | yes | 1.7 MB | 1.4 MB | r[9999].h did not resolve |
| rebuild-10000 | cells | ok | 132 ms | 20 ms, 24 ms, 20 |  | 1.8 MB | 18 MB | ok |
| rebuild-100000 | JS | timeout at load |  |  |  |  |  |  |
| rebuild-100000 | Rust | ok | 74 ms | 0.14 ms, 0.28 ms, 20 | yes | 1.7 MB | 1.4 MB | r[99999].h did not resolve |
| rebuild-100000 | cells | ok | 131 ms | 0.35 ms, 0.61 ms, 20 |  | 1.8 MB | 18 MB | r[99999].h did not resolve |
| homework | JS | ok | 1.3 s | 10 ms, 14 ms, 20 |  | 25 MB | 2.0 MB |  |
| homework | Rust | unsupported at tick | 115 ms |  |  | 1.9 MB | 2.3 MB |  |
| homework | cells | ok | 99 ms | 0.17 ms, 0.47 ms, 20 |  | 1.9 MB | 1.6 MB |  |
| lesson | JS | ok | 1.2 s | 18 ms, 25 ms, 20 |  | 22 MB | 1.9 MB |  |
| lesson | Rust | ok | 189 ms | 0.78 ms, 1.35 ms, 20 |  | 6.1 MB | 2.6 MB |  |
| lesson | cells | ok | 125 ms | 45 µs, 0.13 ms, 20 | yes | 1.9 MB | 1.5 MB |  |
| sir | JS | timeout at load |  |  |  |  |  |  |
| sir | Rust | ok | 127 ms | 0.19 ms, 0.26 ms, 20 | yes | 1.8 MB | 2.6 MB |  |
| sir | cells | ok | 130 ms | 0.18 ms, 0.37 ms, 20 |  | 1.8 MB | 3.6 MB |  |
| venn | JS | ok | 2.5 s | 127 ms, 145 ms, 3 |  | 35 MB | 4.8 MB |  |
| venn | Rust | unsupported at tick | 166 ms |  |  | 1.8 MB | 4.8 MB |  |
| venn | cells | unsupported at tick | 177 ms |  |  | 1.8 MB | 1.6 MB |  |

</details>
