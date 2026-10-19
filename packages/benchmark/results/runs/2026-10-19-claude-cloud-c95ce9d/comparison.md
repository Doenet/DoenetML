# Comparison: 2026-10-19-claude-cloud-c95ce9d

Machine **claude-cloud** (Intel(R) Xeon(R) Processor @ 2.80GHz, 4 cores, 16093 MB, Linux 6.18.44-fc-v139 x64, Node v22.22.0); commit `c95ce9d`; 2026-10-19.

Builds: JS: source, bundled by scripts/bundle-driver.mjs; Rust: wasm-pack --dev at opt-level 3, without logging features; cells: wasm-pack --release (npm run build -w packages/cells-core).

Each cell compares two cores on one shape at one size: the bold line says which is faster and by how much; the line under it gives each core's time. The shapes and what they exercise are in [METHOD.md](../../../METHOD.md).

- **Tick** is the median time of the shape's primary action, less the core's adapter floor (below). ‡: a tick within twice its floor, so its own time is below what the adapter lets us see; the ratio is then a bound ("> N×") taken from that floor.
- **> 15 s**: the core did not finish one tick in 15 s, or **> 120 s** its load in 120 s. † marks a ratio that is then a lower bound, its slow side unchecked, or one whose value check did not finish. A core whose load did not finish has no tick.
- **not comparable**: a core finished, but its values after the check step are wrong. **—**: a core cannot run the shape (see [coverage](coverage.md)).

Adapter floor (the drag on a document of one free point): JS 3.82 ms, Rust 0.13 ms, cells 31 µs.

## Tick

### JS and Rust

| Shape | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth | **Rust 6.2×**<br><sub>JS 555 ms · Rust 89 ms</sub> | —<br><sub>Rust error</sub> | —<br><sub>JS load > 120 s</sub> |
| breadth | **Rust 8.7×**<br><sub>JS 543 ms · Rust 62 ms</sub> | —<br><sub>Rust error</sub> | —<br><sub>JS load > 120 s</sub> |
| inversion | not comparable<br><sub>Rust: c0 = 2, expected 6; c999 = 1001, expected 1005</sub> | —<br><sub>JS error</sub> | —<br><sub>JS load > 120 s</sub> |
| symbolic | **JS ≥ 24×** †<br><sub>JS 618 ms · Rust > 15 s</sub> | —<br><sub>Rust error</sub> | —<br><sub>JS load > 120 s</sub> |
| rebuild | not comparable<br><sub>Rust: r[999].h did not resolve</sub> | —<br><sub>JS load > 120 s</sub> | —<br><sub>JS load > 120 s</sub> |

### JS and cells

| Shape | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth | **cells 14,701×**<br><sub>JS 555 ms · cells 38 µs</sub> | **cells 24,453×** †<br><sub>JS 8.7 s (unchecked) · cells 0.35 ms</sub> | —<br><sub>JS load > 120 s</sub> |
| breadth | **cells 13,584×**<br><sub>JS 543 ms · cells 40 µs</sub> | **cells 27,391×** †<br><sub>JS 8.1 s (unchecked) · cells 0.30 ms</sub> | —<br><sub>JS load > 120 s</sub> |
| inversion | **cells 7,776×**<br><sub>JS 866 ms · cells 0.11 ms</sub> | —<br><sub>JS error</sub> | —<br><sub>JS load > 120 s</sub> |
| symbolic | **cells 16×**<br><sub>JS 618 ms · cells 39 ms</sub> | **cells ≥ 36×** †<br><sub>JS > 15 s · cells 413 ms</sub> | —<br><sub>JS load > 120 s</sub> |
| rebuild | **cells 3,648×**<br><sub>JS 6.8 s · cells 1.88 ms</sub> | —<br><sub>JS load > 120 s</sub> | —<br><sub>JS load > 120 s</sub> |

### Rust and cells

| Shape | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth | **cells 2,367×**<br><sub>Rust 89 ms · cells 38 µs</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| breadth | **cells 1,558×**<br><sub>Rust 62 ms · cells 40 µs</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| inversion | not comparable<br><sub>Rust: c0 = 2, expected 6; c999 = 1001, expected 1005</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| symbolic | **cells ≥ 389×** †<br><sub>Rust > 15 s · cells 39 ms</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| rebuild | not comparable<br><sub>Rust: r[999].h did not resolve</sub> | not comparable<br><sub>Rust: r[9999].h did not resolve</sub> | not comparable<br><sub>Rust: r[99999].h did not resolve</sub> |

## Load

### JS and Rust

| Shape | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth | **Rust 5.0×**<br><sub>JS 8.8 s · Rust 1.8 s</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| breadth | **Rust 4.0×**<br><sub>JS 8.2 s · Rust 2.0 s</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| inversion | not comparable<br><sub>Rust: c0 = 2, expected 6; c999 = 1001, expected 1005</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| symbolic | **JS 6.9×**<br><sub>JS 7.1 s · Rust 49 s</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| rebuild | not comparable<br><sub>Rust: r[999].h did not resolve</sub> | not comparable<br><sub>Rust: r[9999].h did not resolve</sub> | not comparable<br><sub>Rust: r[99999].h did not resolve</sub> |

### JS and cells

| Shape | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth | **cells 46×**<br><sub>JS 8.8 s · cells 191 ms</sub> | **cells 147×**<br><sub>JS 110 s · cells 749 ms</sub> | **cells ≥ 20×** †<br><sub>JS > 120 s · cells 6.1 s</sub> |
| breadth | **cells 37×**<br><sub>JS 8.2 s · cells 218 ms</sub> | **cells 145×**<br><sub>JS 113 s · cells 779 ms</sub> | **cells ≥ 20×** †<br><sub>JS > 120 s · cells 6.1 s</sub> |
| inversion | **cells 31×**<br><sub>JS 7.3 s · cells 233 ms</sub> | **cells 113×**<br><sub>JS 83 s · cells 736 ms</sub> | **cells ≥ 22×** †<br><sub>JS > 120 s · cells 5.6 s</sub> |
| symbolic | **cells 21×**<br><sub>JS 7.1 s · cells 341 ms</sub> | **cells 78×**<br><sub>JS 105 s · cells 1.3 s</sub> | **cells ≥ 8.9×** †<br><sub>JS > 120 s · cells 13 s</sub> |
| rebuild | **cells 333×**<br><sub>JS 28 s · cells 83 ms</sub> | **cells ≥ 929×** †<br><sub>JS > 120 s · cells 129 ms</sub> | not comparable<br><sub>cells: r[99999].h did not resolve</sub> |

### Rust and cells

| Shape | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth | **cells 9.2×**<br><sub>Rust 1.8 s · cells 191 ms</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| breadth | **cells 9.4×**<br><sub>Rust 2.0 s · cells 218 ms</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| inversion | not comparable<br><sub>Rust: c0 = 2, expected 6; c999 = 1001, expected 1005</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| symbolic | **cells 144×**<br><sub>Rust 49 s · cells 341 ms</sub> | —<br><sub>Rust error</sub> | —<br><sub>Rust error</sub> |
| rebuild | not comparable<br><sub>Rust: r[999].h did not resolve</sub> | not comparable<br><sub>Rust: r[9999].h did not resolve</sub> | not comparable<br><sub>Rust: r[99999].h did not resolve</sub> |

## Memory

After the load: the growth of the JS heap, and the size of the core's wasm linear memory (which never shrinks). Two kinds of memory, so no ratio.

| Shape, core | 1,000 | 10,000 | 100,000 |
|---|---|---|---|
| depth, JS | heap +152 MB<br><sub>wasm 7.6 MB</sub> | heap +1409 MB<br><sub>wasm 67 MB</sub> |  |
| depth, Rust | heap +0.0 MB<br><sub>wasm 295 MB</sub> |  |  |
| depth, cells | heap +1.8 MB<br><sub>wasm 2.3 MB</sub> | heap +1.9 MB<br><sub>wasm 9.3 MB</sub> | heap +0.0 MB<br><sub>wasm 87 MB</sub> |
| breadth, JS | heap +151 MB<br><sub>wasm 8.4 MB</sub> | heap +1407 MB<br><sub>wasm 74 MB</sub> |  |
| breadth, Rust | heap +0.0 MB<br><sub>wasm 373 MB</sub> |  |  |
| breadth, cells | heap +1.8 MB<br><sub>wasm 2.3 MB</sub> | heap +1.9 MB<br><sub>wasm 9.9 MB</sub> | heap +0.0 MB<br><sub>wasm 85 MB</sub> |
| inversion, JS | heap +151 MB<br><sub>wasm 7.6 MB</sub> | heap +1400 MB<br><sub>wasm 67 MB</sub> |  |
| inversion, Rust | heap +0.0 MB<br><sub>wasm 221 MB</sub> |  |  |
| inversion, cells | heap +1.9 MB<br><sub>wasm 2.3 MB</sub> | heap +1.9 MB<br><sub>wasm 9.6 MB</sub> | heap +0.0 MB<br><sub>wasm 80 MB</sub> |
| symbolic, JS | heap +106 MB<br><sub>wasm 8.4 MB</sub> | heap +949 MB<br><sub>wasm 74 MB</sub> |  |
| symbolic, Rust | heap +0.0 MB<br><sub>wasm 1264 MB</sub> |  |  |
| symbolic, cells | heap +1.8 MB<br><sub>wasm 3.1 MB</sub> | heap +1.9 MB<br><sub>wasm 18 MB</sub> | heap +0.0 MB<br><sub>wasm 161 MB</sub> |
| rebuild, JS | heap +402 MB<br><sub>wasm 5.8 MB</sub> |  |  |
| rebuild, Rust | heap +1.7 MB<br><sub>wasm 1.4 MB</sub> | heap +1.7 MB<br><sub>wasm 1.4 MB</sub> | heap +1.7 MB<br><sub>wasm 1.4 MB</sub> |
| rebuild, cells | heap +1.8 MB<br><sub>wasm 3.1 MB</sub> | heap +1.8 MB<br><sub>wasm 18 MB</sub> | heap +1.8 MB<br><sub>wasm 18 MB</sub> |

<details><summary>Every measurement</summary>

| Fixture | Core | Status | Load | Tick (median, p90, n) | Floored | Heap | Wasm | Check |
|---|---|---|---|---|---|---|---|---|
| floor | JS | ok | 250 ms | 3.82 ms, 4.64 ms, 20 | yes | 5.9 MB | 1.3 MB | ok |
| floor | Rust | ok | 89 ms | 0.13 ms, 0.56 ms, 20 | yes | 1.7 MB | 1.3 MB | ok |
| floor | cells | ok | 93 ms | 31 µs, 0.14 ms, 20 | yes | 1.7 MB | 1.4 MB | ok |
| depth-1000 | JS | ok | 8.8 s | 559 ms, 673 ms, 20 |  | 152 MB | 7.6 MB | ok |
| depth-1000 | Rust | ok | 1.8 s | 89 ms, 132 ms, 20 |  | 0.0 MB | 295 MB | ok |
| depth-1000 | cells | ok | 191 ms | 69 µs, 0.15 ms, 20 |  | 1.8 MB | 2.3 MB | ok |
| depth-10000 | JS | ok | 110 s | 8.7 s, 11 s, 3 |  | 1409 MB | 67 MB |  |
| depth-10000 | Rust | error at load |  |  |  |  |  |  |
| depth-10000 | cells | ok | 749 ms | 0.39 ms, 0.74 ms, 20 |  | 1.9 MB | 9.3 MB | ok |
| depth-100000 | JS | timeout at load |  |  |  |  |  |  |
| depth-100000 | Rust | error at load |  |  |  |  |  |  |
| depth-100000 | cells | ok | 6.1 s | 2.86 ms, 3.11 ms, 20 |  | 0.0 MB | 87 MB | ok |
| breadth-1000 | JS | ok | 8.2 s | 547 ms, 699 ms, 20 |  | 151 MB | 8.4 MB | ok |
| breadth-1000 | Rust | ok | 2.0 s | 62 ms, 100 ms, 20 |  | 0.0 MB | 373 MB | ok |
| breadth-1000 | cells | ok | 218 ms | 71 µs, 0.15 ms, 20 |  | 1.8 MB | 2.3 MB | ok |
| breadth-10000 | JS | ok | 113 s | 8.1 s, 8.1 s, 3 |  | 1407 MB | 74 MB |  |
| breadth-10000 | Rust | error at load |  |  |  |  |  |  |
| breadth-10000 | cells | ok | 779 ms | 0.33 ms, 0.39 ms, 20 |  | 1.9 MB | 9.9 MB | ok |
| breadth-100000 | JS | timeout at load |  |  |  |  |  |  |
| breadth-100000 | Rust | error at load |  |  |  |  |  |  |
| breadth-100000 | cells | ok | 6.1 s | 2.29 ms, 2.82 ms, 20 |  | 0.0 MB | 85 MB | ok |
| inversion-1000 | JS | ok | 7.3 s | 869 ms, 951 ms, 3 |  | 151 MB | 7.6 MB | ok |
| inversion-1000 | Rust | ok | 2.2 s | 0.40 ms, 0.56 ms, 20 |  | 0.0 MB | 221 MB | c0 = 2, expected 6; c999 = 1001, expected 1005 |
| inversion-1000 | cells | ok | 233 ms | 0.14 ms, 0.25 ms, 20 |  | 1.9 MB | 2.3 MB | ok |
| inversion-10000 | JS | error at tick | 83 s |  |  | 1400 MB | 67 MB |  |
| inversion-10000 | Rust | error at load |  |  |  |  |  |  |
| inversion-10000 | cells | ok | 736 ms | 0.42 ms, 0.67 ms, 20 |  | 1.9 MB | 9.6 MB | ok |
| inversion-100000 | JS | timeout at load |  |  |  |  |  |  |
| inversion-100000 | Rust | error at load |  |  |  |  |  |  |
| inversion-100000 | cells | ok | 5.6 s | 3.94 ms, 6.43 ms, 20 |  | 0.0 MB | 80 MB | ok |
| symbolic-1000 | JS | ok | 7.1 s | 622 ms, 689 ms, 20 |  | 106 MB | 8.4 MB | ok |
| symbolic-1000 | Rust | timeout at tick | 49 s |  |  | 0.0 MB | 1264 MB |  |
| symbolic-1000 | cells | ok | 341 ms | 39 ms, 41 ms, 20 |  | 1.8 MB | 3.1 MB | ok |
| symbolic-10000 | JS | timeout at tick | 105 s |  |  | 949 MB | 74 MB |  |
| symbolic-10000 | Rust | error at load |  |  |  |  |  |  |
| symbolic-10000 | cells | ok | 1.3 s | 413 ms, 476 ms, 20 |  | 1.9 MB | 18 MB | ok |
| symbolic-100000 | JS | timeout at load |  |  |  |  |  |  |
| symbolic-100000 | Rust | error at load |  |  |  |  |  |  |
| symbolic-100000 | cells | ok | 13 s | 4.1 s, 4.2 s, 3 |  | 0.0 MB | 161 MB | ok |
| rebuild-1000 | JS | ok | 28 s | 6.9 s, 7.7 s, 3 |  | 402 MB | 5.8 MB | ok |
| rebuild-1000 | Rust | ok | 83 ms | 0.14 ms, 0.50 ms, 20 | yes | 1.7 MB | 1.4 MB | r[999].h did not resolve |
| rebuild-1000 | cells | ok | 83 ms | 1.91 ms, 3.49 ms, 20 |  | 1.8 MB | 3.1 MB | ok |
| rebuild-10000 | JS | timeout at load |  |  |  |  |  |  |
| rebuild-10000 | Rust | ok | 75 ms | 0.13 ms, 0.28 ms, 20 | yes | 1.7 MB | 1.4 MB | r[9999].h did not resolve |
| rebuild-10000 | cells | ok | 129 ms | 19 ms, 26 ms, 20 |  | 1.8 MB | 18 MB | ok |
| rebuild-100000 | JS | timeout at load |  |  |  |  |  |  |
| rebuild-100000 | Rust | ok | 75 ms | 0.13 ms, 0.24 ms, 20 | yes | 1.7 MB | 1.4 MB | r[99999].h did not resolve |
| rebuild-100000 | cells | ok | 114 ms | 0.37 ms, 0.89 ms, 20 |  | 1.8 MB | 18 MB | r[99999].h did not resolve |
| homework | JS | ok | 1.5 s | 12 ms, 16 ms, 20 |  | 25 MB | 2.0 MB |  |
| homework | Rust | unsupported at tick | 154 ms |  |  | 1.9 MB | 2.3 MB |  |
| homework | cells | ok | 138 ms | 0.17 ms, 0.35 ms, 20 |  | 1.9 MB | 1.6 MB |  |
| lesson | JS | ok | 1.3 s | 16 ms, 20 ms, 20 |  | 22 MB | 1.9 MB |  |
| lesson | Rust | ok | 201 ms | 0.89 ms, 2.96 ms, 20 |  | 6.0 MB | 2.6 MB |  |
| lesson | cells | ok | 136 ms | 32 µs, 0.12 ms, 20 | yes | 1.9 MB | 1.5 MB |  |
| sir | JS | ok | 14 s | 3.2 s, 3.2 s, 3 |  | 216 MB | 3.8 MB |  |
| sir | Rust | ok | 150 ms | 0.13 ms, 0.33 ms, 20 | yes | 1.8 MB | 2.6 MB |  |
| sir | cells | ok | 129 ms | 0.12 ms, 0.33 ms, 20 |  | 1.8 MB | 3.6 MB |  |
| venn | JS | ok | 2.1 s | 122 ms, 144 ms, 3 |  | 35 MB | 4.8 MB |  |
| venn | Rust | unsupported at tick | 176 ms |  |  | 1.8 MB | 4.8 MB |  |
| venn | cells | unsupported at tick | 151 ms |  |  | 1.8 MB | 1.6 MB |  |

</details>
