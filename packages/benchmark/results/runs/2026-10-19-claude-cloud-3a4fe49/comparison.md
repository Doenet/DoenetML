# Comparison: 2026-10-19-claude-cloud-3a4fe49

Machine **claude-cloud** (Intel(R) Xeon(R) Processor @ 2.80GHz, 4 cores, 16093 MB, Linux 6.18.44-fc-v139 x64, Node v22.22.0); commit `3a4fe49`; 2026-10-19.

Builds: JS: source, bundled by scripts/bundle-driver.mjs; Rust: wasm-pack --dev at opt-level 3, without logging features; cells: wasm-pack --release (npm run build -w packages/cells-core).

Each cell compares two cores on one shape at one size: the bold line says which is faster and by how much; the line under it gives each core's time. The shapes and what they exercise are in [METHOD.md](../../../METHOD.md).

- **Tick** is the median time of the shape's primary action, less the core's adapter floor (below). ‡: a tick within twice its floor, so its own time is below what the adapter lets us see; the ratio is then a bound ("> N×") taken from that floor.
- **> 15 s**: the core did not finish one tick in 15 s, or **> 120 s** its load in 120 s. † marks a ratio that is then a lower bound, its slow side unchecked, or one whose value check did not finish. A core whose load did not finish has no tick.
- **not comparable**: a core finished, but its values after the check step are wrong. **—**: a core cannot run the shape (see [coverage](coverage.md)).

Adapter floor (the drag on a document of one free point): JS 2.83 ms, Rust 0.15 ms, cells 39 µs.

## Tick

### JS and Rust

| Shape | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth | **Rust 6.3×**<br><sub>JS 625 ms · Rust 99 ms</sub> | —<br><sub>Rust error</sub> | —<br><sub>JS load > 120 s</sub> |
| breadth | **Rust 8.1×**<br><sub>JS 501 ms · Rust 62 ms</sub> | —<br><sub>Rust error</sub> | —<br><sub>JS load > 120 s</sub> |
| inversion | not comparable<br><sub>Rust: c0 = 2, expected 6; c999 = 1001, expected 1005</sub> | —<br><sub>JS error</sub> | —<br><sub>JS load > 120 s</sub> |
| symbolic | **JS ≥ 23×** †<br><sub>JS 664 ms · Rust > 15 s</sub> | —<br><sub>Rust error</sub> | —<br><sub>JS load > 120 s</sub> |
| rebuild | not comparable<br><sub>Rust: r[999].h did not resolve</sub> | —<br><sub>JS load > 120 s</sub> | —<br><sub>JS load > 120 s</sub> |

### JS and cells

| Shape | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth | **cells > 16,097×** ‡<br><sub>JS 625 ms · cells < 39 µs (floor)</sub> | **cells 24,333×**<br><sub>JS 9.3 s · cells 0.38 ms</sub> | —<br><sub>JS load > 120 s</sub> |
| breadth | **cells 4,500×**<br><sub>JS 501 ms · cells 0.11 ms</sub> | **cells 20,933×**<br><sub>JS 6.9 s · cells 0.33 ms</sub> | —<br><sub>JS load > 120 s</sub> |
| inversion | **cells 7,566×**<br><sub>JS 948 ms · cells 0.13 ms</sub> | —<br><sub>JS error</sub> | —<br><sub>JS load > 120 s</sub> |
| symbolic | **cells 16×**<br><sub>JS 664 ms · cells 42 ms</sub> | **cells ≥ 38×** †<br><sub>JS > 15 s · cells 398 ms</sub> | —<br><sub>JS load > 120 s</sub> |
| rebuild | **cells 3,344×**<br><sub>JS 6.9 s · cells 2.06 ms</sub> | —<br><sub>JS load > 120 s</sub> | —<br><sub>JS load > 120 s</sub> |

### Rust and cells

| Shape | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth | **cells > 2,537×** ‡<br><sub>Rust 99 ms · cells < 39 µs (floor)</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| breadth | **cells 556×**<br><sub>Rust 62 ms · cells 0.11 ms</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| inversion | not comparable<br><sub>Rust: c0 = 2, expected 6; c999 = 1001, expected 1005</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| symbolic | **cells ≥ 354×** †<br><sub>Rust > 15 s · cells 42 ms</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| rebuild | not comparable<br><sub>Rust: r[999].h did not resolve</sub> | not comparable<br><sub>Rust: r[9999].h did not resolve</sub> | not comparable<br><sub>Rust: r[99999].h did not resolve</sub> |

## Load

### JS and Rust

| Shape | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth | **Rust 5.0×**<br><sub>JS 8.3 s · Rust 1.7 s</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| breadth | **Rust 3.9×**<br><sub>JS 8.5 s · Rust 2.2 s</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| inversion | not comparable<br><sub>Rust: c0 = 2, expected 6; c999 = 1001, expected 1005</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| symbolic | **JS 6.5×**<br><sub>JS 7.3 s · Rust 48 s</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| rebuild | not comparable<br><sub>Rust: r[999].h did not resolve</sub> | not comparable<br><sub>Rust: r[9999].h did not resolve</sub> | not comparable<br><sub>Rust: r[99999].h did not resolve</sub> |

### JS and cells

| Shape | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth | **cells 37×**<br><sub>JS 8.3 s · cells 224 ms</sub> | **cells 144×**<br><sub>JS 101 s · cells 703 ms</sub> | **cells ≥ 20×** †<br><sub>JS > 120 s · cells 6.0 s</sub> |
| breadth | **cells 38×**<br><sub>JS 8.5 s · cells 225 ms</sub> | **cells 145×**<br><sub>JS 111 s · cells 772 ms</sub> | **cells ≥ 17×** †<br><sub>JS > 120 s · cells 6.9 s</sub> |
| inversion | **cells 39×**<br><sub>JS 7.2 s · cells 185 ms</sub> | **cells 101×**<br><sub>JS 78 s · cells 774 ms</sub> | **cells ≥ 20×** †<br><sub>JS > 120 s · cells 5.9 s</sub> |
| symbolic | **cells 26×**<br><sub>JS 7.3 s · cells 283 ms</sub> | **cells 80×**<br><sub>JS 104 s · cells 1.3 s</sub> | **cells ≥ 8.6×** †<br><sub>JS > 120 s · cells 14 s</sub> |
| rebuild | **cells 308×**<br><sub>JS 27 s · cells 88 ms</sub> | **cells ≥ 1,001×** †<br><sub>JS > 120 s · cells 120 ms</sub> | not comparable<br><sub>cells: r[99999].h did not resolve</sub> |

### Rust and cells

| Shape | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth | **cells 7.5×**<br><sub>Rust 1.7 s · cells 224 ms</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| breadth | **cells 9.6×**<br><sub>Rust 2.2 s · cells 225 ms</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| inversion | not comparable<br><sub>Rust: c0 = 2, expected 6; c999 = 1001, expected 1005</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| symbolic | **cells 168×**<br><sub>Rust 48 s · cells 283 ms</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| rebuild | not comparable<br><sub>Rust: r[999].h did not resolve</sub> | not comparable<br><sub>Rust: r[9999].h did not resolve</sub> | not comparable<br><sub>Rust: r[99999].h did not resolve</sub> |

## Memory

After the load: the growth of the JS heap, and the size of the core's wasm linear memory (which never shrinks). Two kinds of memory, so no ratio.

| Shape, core | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth, JS | heap +152 MB<br><sub>wasm 7.6 MB</sub> | heap +1411 MB<br><sub>wasm 67 MB</sub> |  |
| depth, Rust | heap +0.0 MB<br><sub>wasm 295 MB</sub> |  |  |
| depth, cells | heap +1.9 MB<br><sub>wasm 2.3 MB</sub> | heap +1.9 MB<br><sub>wasm 9.3 MB</sub> | heap +0.0 MB<br><sub>wasm 87 MB</sub> |
| breadth, JS | heap +151 MB<br><sub>wasm 8.4 MB</sub> | heap +1405 MB<br><sub>wasm 74 MB</sub> |  |
| breadth, Rust | heap +0.0 MB<br><sub>wasm 373 MB</sub> |  |  |
| breadth, cells | heap +1.8 MB<br><sub>wasm 2.3 MB</sub> | heap +1.9 MB<br><sub>wasm 9.9 MB</sub> | heap +0.0 MB<br><sub>wasm 85 MB</sub> |
| inversion, JS | heap +151 MB<br><sub>wasm 7.6 MB</sub> | heap +1395 MB<br><sub>wasm 67 MB</sub> |  |
| inversion, Rust | heap +0.0 MB<br><sub>wasm 221 MB</sub> |  |  |
| inversion, cells | heap +1.8 MB<br><sub>wasm 2.3 MB</sub> | heap +1.9 MB<br><sub>wasm 9.6 MB</sub> | heap +0.0 MB<br><sub>wasm 80 MB</sub> |
| symbolic, JS | heap +106 MB<br><sub>wasm 8.4 MB</sub> | heap +951 MB<br><sub>wasm 74 MB</sub> |  |
| symbolic, Rust | heap +0.0 MB<br><sub>wasm 1264 MB</sub> |  |  |
| symbolic, cells | heap +1.8 MB<br><sub>wasm 3.1 MB</sub> | heap +1.8 MB<br><sub>wasm 18 MB</sub> | heap +0.0 MB<br><sub>wasm 161 MB</sub> |
| rebuild, JS | heap +402 MB<br><sub>wasm 5.8 MB</sub> |  |  |
| rebuild, Rust | heap +1.7 MB<br><sub>wasm 1.4 MB</sub> | heap +1.7 MB<br><sub>wasm 1.4 MB</sub> | heap +1.7 MB<br><sub>wasm 1.4 MB</sub> |
| rebuild, cells | heap +1.8 MB<br><sub>wasm 3.1 MB</sub> | heap +1.8 MB<br><sub>wasm 18 MB</sub> | heap +1.8 MB<br><sub>wasm 18 MB</sub> |

<details><summary>Every measurement</summary>

| Fixture | Core | Status | Load | Tick (median, p90, n) | Floored | Heap | Wasm | Check |
|---|---|---|---|---|---|---|---|---|
| floor | JS | ok | 262 ms | 2.83 ms, 3.59 ms, 20 | yes | 5.9 MB | 1.3 MB | ok |
| floor | Rust | ok | 67 ms | 0.15 ms, 0.47 ms, 20 | yes | 1.7 MB | 1.3 MB | ok |
| floor | cells | ok | 60 ms | 39 µs, 0.18 ms, 20 | yes | 1.7 MB | 1.4 MB | ok |
| depth-1000 | JS | ok | 8.3 s | 628 ms, 781 ms, 20 |  | 152 MB | 7.6 MB | ok |
| depth-1000 | Rust | ok | 1.7 s | 99 ms, 134 ms, 20 |  | 0.0 MB | 295 MB | ok |
| depth-1000 | cells | ok | 224 ms | 58 µs, 0.18 ms, 20 | yes | 1.9 MB | 2.3 MB | ok |
| depth-10000 | JS | ok | 101 s | 9.3 s, 11 s, 3 |  | 1411 MB | 67 MB | ok |
| depth-10000 | Rust | error at load |  |  |  |  |  |  |
| depth-10000 | cells | ok | 703 ms | 0.42 ms, 0.97 ms, 20 |  | 1.9 MB | 9.3 MB | ok |
| depth-100000 | JS | timeout at load |  |  |  |  |  |  |
| depth-100000 | Rust | error at load |  |  |  |  |  |  |
| depth-100000 | cells | ok | 6.0 s | 2.84 ms, 3.50 ms, 20 |  | 0.0 MB | 87 MB | ok |
| breadth-1000 | JS | ok | 8.5 s | 503 ms, 610 ms, 20 |  | 151 MB | 8.4 MB | ok |
| breadth-1000 | Rust | ok | 2.2 s | 62 ms, 93 ms, 20 |  | 0.0 MB | 373 MB | ok |
| breadth-1000 | cells | ok | 225 ms | 0.15 ms, 0.23 ms, 20 |  | 1.8 MB | 2.3 MB | ok |
| breadth-10000 | JS | ok | 111 s | 6.9 s, 8.3 s, 3 |  | 1405 MB | 74 MB | ok |
| breadth-10000 | Rust | error at load |  |  |  |  |  |  |
| breadth-10000 | cells | ok | 772 ms | 0.37 ms, 0.73 ms, 20 |  | 1.9 MB | 9.9 MB | ok |
| breadth-100000 | JS | timeout at load |  |  |  |  |  |  |
| breadth-100000 | Rust | error at load |  |  |  |  |  |  |
| breadth-100000 | cells | ok | 6.9 s | 2.43 ms, 3.09 ms, 20 |  | 0.0 MB | 85 MB | ok |
| inversion-1000 | JS | ok | 7.2 s | 951 ms, 1.1 s, 3 |  | 151 MB | 7.6 MB | ok |
| inversion-1000 | Rust | ok | 1.8 s | 0.31 ms, 0.48 ms, 20 | yes | 0.0 MB | 221 MB | c0 = 2, expected 6; c999 = 1001, expected 1005 |
| inversion-1000 | cells | ok | 185 ms | 0.16 ms, 0.29 ms, 20 |  | 1.8 MB | 2.3 MB | ok |
| inversion-10000 | JS | error at tick | 78 s |  |  | 1395 MB | 67 MB |  |
| inversion-10000 | Rust | error at load |  |  |  |  |  |  |
| inversion-10000 | cells | ok | 774 ms | 0.44 ms, 0.58 ms, 20 |  | 1.9 MB | 9.6 MB | ok |
| inversion-100000 | JS | timeout at load |  |  |  |  |  |  |
| inversion-100000 | Rust | error at load |  |  |  |  |  |  |
| inversion-100000 | cells | ok | 5.9 s | 3.74 ms, 4.34 ms, 20 |  | 0.0 MB | 80 MB | ok |
| symbolic-1000 | JS | ok | 7.3 s | 667 ms, 842 ms, 20 |  | 106 MB | 8.4 MB | ok |
| symbolic-1000 | Rust | timeout at tick | 48 s |  |  | 0.0 MB | 1264 MB |  |
| symbolic-1000 | cells | ok | 283 ms | 42 ms, 57 ms, 20 |  | 1.8 MB | 3.1 MB | ok |
| symbolic-10000 | JS | timeout at tick | 104 s | 14 s, 14 s, 1 |  | 951 MB | 74 MB |  |
| symbolic-10000 | Rust | error at load |  |  |  |  |  |  |
| symbolic-10000 | cells | ok | 1.3 s | 398 ms, 440 ms, 20 |  | 1.8 MB | 18 MB | ok |
| symbolic-100000 | JS | timeout at load |  |  |  |  |  |  |
| symbolic-100000 | Rust | error at load |  |  |  |  |  |  |
| symbolic-100000 | cells | ok | 14 s | 4.1 s, 4.1 s, 3 |  | 0.0 MB | 161 MB | ok |
| rebuild-1000 | JS | ok | 27 s | 6.9 s, 7.4 s, 3 |  | 402 MB | 5.8 MB | ok |
| rebuild-1000 | Rust | ok | 70 ms | 0.21 ms, 0.33 ms, 20 | yes | 1.7 MB | 1.4 MB | r[999].h did not resolve |
| rebuild-1000 | cells | ok | 88 ms | 2.10 ms, 5.23 ms, 20 |  | 1.8 MB | 3.1 MB | ok |
| rebuild-10000 | JS | timeout at load |  |  |  |  |  |  |
| rebuild-10000 | Rust | ok | 71 ms | 0.23 ms, 0.40 ms, 20 | yes | 1.7 MB | 1.4 MB | r[9999].h did not resolve |
| rebuild-10000 | cells | ok | 120 ms | 20 ms, 22 ms, 20 |  | 1.8 MB | 18 MB | ok |
| rebuild-100000 | JS | timeout at load |  |  |  |  |  |  |
| rebuild-100000 | Rust | ok | 76 ms | 0.15 ms, 0.62 ms, 20 | yes | 1.7 MB | 1.4 MB | r[99999].h did not resolve |
| rebuild-100000 | cells | ok | 106 ms | 0.37 ms, 0.45 ms, 20 |  | 1.8 MB | 18 MB | r[99999].h did not resolve |
| homework | JS | ok | 1.4 s | 13 ms, 18 ms, 20 |  | 25 MB | 2.0 MB |  |
| homework | Rust | unsupported at tick | 113 ms |  |  | 1.9 MB | 2.3 MB |  |
| homework | cells | ok | 118 ms | 0.16 ms, 0.41 ms, 20 |  | 1.9 MB | 1.6 MB |  |
| lesson | JS | ok | 1.2 s | 20 ms, 24 ms, 20 |  | 22 MB | 1.9 MB |  |
| lesson | Rust | ok | 218 ms | 0.74 ms, 0.91 ms, 20 |  | 6.0 MB | 2.6 MB |  |
| lesson | cells | ok | 121 ms | 30 µs, 91 µs, 20 | yes | 1.8 MB | 1.5 MB |  |
| sir | JS | ok | 15 s | 3.2 s, 3.2 s, 3 |  | 215 MB | 3.8 MB |  |
| sir | Rust | ok | 118 ms | 0.11 ms, 0.16 ms, 20 | yes | 1.8 MB | 2.6 MB |  |
| sir | cells | ok | 106 ms | 0.21 ms, 0.35 ms, 20 |  | 1.9 MB | 3.6 MB |  |
| venn | JS | ok | 2.0 s | 122 ms, 137 ms, 3 |  | 35 MB | 4.8 MB |  |
| venn | Rust | unsupported at tick | 158 ms |  |  | 1.8 MB | 4.8 MB |  |
| venn | cells | unsupported at tick | 140 ms |  |  | 1.9 MB | 1.6 MB |  |

</details>
