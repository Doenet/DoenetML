# Comparison: 2026-10-19-claude-cloud-b686555cd

Machine **claude-cloud** (Intel(R) Xeon(R) Processor @ 2.10GHz, 4 cores, 16093 MB, Linux 6.18.44-fc-v139 x64, Node v22.22.0); commit `b686555cd`; 2026-10-19.

Builds: JS: source, bundled by scripts/bundle-driver.mjs; Rust: wasm-pack --release, without logging features; cells: wasm-pack --release (npm run build -w packages/cells-core).

Every core side by side, one row per shape and size. The JS column gives its time; every other column gives how many times faster or slower that core is than JS, with its own time under it. The shapes and what they exercise are in [METHOD.md](../../../METHOD.md).

- **Tick** is the median time of the shape's primary action, less the core's adapter floor (below). ‡: a tick within twice its floor, so its own time is below what the adapter lets us see; the ratio is then a bound ("> N×") taken from that floor.
- **> 15 s**: the core did not finish one tick in 15 s, or **> 120 s** its load in 120 s; a ratio against it is a bound ("≥ N×"). †: a value that was not checked, because its core did not finish or its check ran out of time. A core whose load did not finish has no tick.
- **not comparable**: the core finished, but its values after the check step are wrong. **—**: the core cannot run the shape, or was not tried at that size after failing a smaller one (see [coverage](coverage.md)).

Adapter floor (the drag on a document of one free point): JS 2.86 ms, Rust 0.14 ms, cells 23 µs.

## Tick

| Shape | Size | JS | Rust | cells |
|---|---|---|---|---|
| depth | 1,000 | **505 ms** | **6.8× faster**<br><sub>75 ms</sub> | **18,651× faster**<br><sub>27 µs</sub> |
| depth | 10,000 | **8.5 s** | —<br><sub>error: unreachable</sub> | **21,481× faster**<br><sub>0.40 ms</sub> |
| depth | 100,000 | —<br><sub>skipped: its load at 10,000 took 97 s</sub> | —<br><sub>skipped: error at load at 10,000</sub> | **2.55 ms** |
| breadth | 1,000 | **485 ms** | **10× faster**<br><sub>47 ms</sub> | **8,653× faster**<br><sub>56 µs</sub> |
| breadth | 10,000 | **6.7 s** | —<br><sub>error: unreachable</sub> | **29,546× faster**<br><sub>0.23 ms</sub> |
| breadth | 100,000 | —<br><sub>skipped: its load at 10,000 took 103 s</sub> | —<br><sub>skipped: error at load at 10,000</sub> | **1.97 ms** |
| inversion | 1,000 | **992 ms** | not comparable<br><sub>c0 = -998, expected -994; c999 = 1, expected 5</sub> | **24,297× faster**<br><sub>41 µs</sub> |
| inversion | 10,000 | —<br><sub>error: killed by SIGSEGV</sub> | —<br><sub>error: unreachable</sub> | **0.53 ms** |
| inversion | 100,000 | —<br><sub>skipped: error at tick at 10,000</sub> | —<br><sub>skipped: error at load at 10,000</sub> | **3.47 ms** |
| symbolic | 1,000 | **616 ms** | **≥ 24× slower** †<br><sub>> 15 s</sub> | **16× faster**<br><sub>37 ms</sub> |
| symbolic | 10,000 | **> 15 s** | —<br><sub>skipped: timeout at tick at 1,000</sub> | **≥ 40× faster** †<br><sub>374 ms</sub> |
| symbolic | 100,000 | —<br><sub>skipped: timeout at tick at 10,000</sub> | —<br><sub>skipped: timeout at tick at 1,000</sub> | **3.5 s** |
| rebuild | 1,000 | **6.6 s** | not comparable<br><sub>r[999].h did not resolve</sub> | **3,837× faster**<br><sub>1.73 ms</sub> |
| rebuild | 10,000 | —<br><sub>skipped: its load at 1,000 took 25 s</sub> | not comparable<br><sub>r[9999].h did not resolve</sub> | **18 ms** |
| rebuild | 100,000 | —<br><sub>skipped: its load at 1,000 took 25 s</sub> | not comparable<br><sub>r[99999].h did not resolve</sub> | not comparable<br><sub>r[99999].h did not resolve</sub> |

## Load

| Shape | Size | JS | Rust | cells |
|---|---|---|---|---|
| depth | 1,000 | **7.6 s** | **3.9× faster**<br><sub>1.9 s</sub> | **47× faster**<br><sub>160 ms</sub> |
| depth | 10,000 | **97 s** | —<br><sub>error: unreachable</sub> | **135× faster**<br><sub>720 ms</sub> |
| depth | 100,000 | —<br><sub>skipped: its load at 10,000 took 97 s</sub> | —<br><sub>skipped: error at load at 10,000</sub> | **4.9 s** |
| breadth | 1,000 | **7.2 s** | **3.4× faster**<br><sub>2.1 s</sub> | **36× faster**<br><sub>203 ms</sub> |
| breadth | 10,000 | **103 s** | —<br><sub>error: unreachable</sub> | **135× faster**<br><sub>760 ms</sub> |
| breadth | 100,000 | —<br><sub>skipped: its load at 10,000 took 103 s</sub> | —<br><sub>skipped: error at load at 10,000</sub> | **5.3 s** |
| inversion | 1,000 | **7.1 s** | not comparable<br><sub>c0 = -998, expected -994; c999 = 1, expected 5</sub> | **40× faster**<br><sub>176 ms</sub> |
| inversion | 10,000 | **87 s** | —<br><sub>error: unreachable</sub> | **121× faster**<br><sub>713 ms</sub> |
| inversion | 100,000 | —<br><sub>skipped: error at tick at 10,000</sub> | —<br><sub>skipped: error at load at 10,000</sub> | **4.9 s** |
| symbolic | 1,000 | **7.0 s** | **5.7× slower**<br><sub>40 s</sub> | **28× faster**<br><sub>253 ms</sub> |
| symbolic | 10,000 | **99 s** | —<br><sub>skipped: timeout at tick at 1,000</sub> | **100× faster**<br><sub>995 ms</sub> |
| symbolic | 100,000 | —<br><sub>skipped: timeout at tick at 10,000</sub> | —<br><sub>skipped: timeout at tick at 1,000</sub> | **12 s** |
| rebuild | 1,000 | **25 s** | not comparable<br><sub>r[999].h did not resolve</sub> | **374× faster**<br><sub>66 ms</sub> |
| rebuild | 10,000 | —<br><sub>skipped: its load at 1,000 took 25 s</sub> | not comparable<br><sub>r[9999].h did not resolve</sub> | **134 ms** |
| rebuild | 100,000 | —<br><sub>skipped: its load at 1,000 took 25 s</sub> | not comparable<br><sub>r[99999].h did not resolve</sub> | not comparable<br><sub>r[99999].h did not resolve</sub> |

## Memory

After the load: the growth of the JS heap and, under it, the size of the core's wasm linear memory (which never shrinks). Two kinds of memory, so no ratio.

| Shape | Size | JS | Rust | cells |
|---|---|---|---|---|
| depth | 1,000 | heap +152 MB<br><sub>wasm 7.5 MB</sub> | heap +0.0 MB<br><sub>wasm 295 MB</sub> | heap +1.8 MB<br><sub>wasm 2.3 MB</sub> |
| depth | 10,000 | heap +1417 MB<br><sub>wasm 67 MB</sub> |  | heap +1.9 MB<br><sub>wasm 9.3 MB</sub> |
| depth | 100,000 |  |  | heap +0.0 MB<br><sub>wasm 87 MB</sub> |
| breadth | 1,000 | heap +151 MB<br><sub>wasm 8.3 MB</sub> | heap +0.0 MB<br><sub>wasm 373 MB</sub> | heap +1.8 MB<br><sub>wasm 2.3 MB</sub> |
| breadth | 10,000 | heap +1404 MB<br><sub>wasm 74 MB</sub> |  | heap +1.9 MB<br><sub>wasm 9.9 MB</sub> |
| breadth | 100,000 |  |  | heap +0.0 MB<br><sub>wasm 85 MB</sub> |
| inversion | 1,000 | heap +151 MB<br><sub>wasm 7.5 MB</sub> | heap +0.0 MB<br><sub>wasm 220 MB</sub> | heap +1.8 MB<br><sub>wasm 2.3 MB</sub> |
| inversion | 10,000 | heap +1396 MB<br><sub>wasm 67 MB</sub> |  | heap +2.0 MB<br><sub>wasm 9.4 MB</sub> |
| inversion | 100,000 |  |  | heap +0.0 MB<br><sub>wasm 83 MB</sub> |
| symbolic | 1,000 | heap +106 MB<br><sub>wasm 8.3 MB</sub> | heap +0.0 MB<br><sub>wasm 1264 MB</sub> | heap +1.8 MB<br><sub>wasm 3.1 MB</sub> |
| symbolic | 10,000 | heap +945 MB<br><sub>wasm 74 MB</sub> |  | heap +1.8 MB<br><sub>wasm 18 MB</sub> |
| symbolic | 100,000 |  |  | heap +0.0 MB<br><sub>wasm 161 MB</sub> |
| rebuild | 1,000 | heap +401 MB<br><sub>wasm 5.6 MB</sub> | heap +1.7 MB<br><sub>wasm 1.3 MB</sub> | heap +1.8 MB<br><sub>wasm 3.2 MB</sub> |
| rebuild | 10,000 |  | heap +1.7 MB<br><sub>wasm 1.3 MB</sub> | heap +1.8 MB<br><sub>wasm 17 MB</sub> |
| rebuild | 100,000 |  | heap +1.7 MB<br><sub>wasm 1.3 MB</sub> | heap +1.8 MB<br><sub>wasm 17 MB</sub> |

<details><summary>Every measurement</summary>

| Fixture | Core | Status | Load | Tick (median, p90, n) | Floored | Heap | Wasm | Check |
|---|---|---|---|---|---|---|---|---|
| floor | JS | ok | 207 ms | 2.86 ms, 3.86 ms, 20 | yes | 5.8 MB | 1.2 MB | ok |
| floor | Rust | ok | 58 ms | 0.14 ms, 0.23 ms, 20 | yes | 1.7 MB | 1.2 MB | ok |
| floor | cells | ok | 52 ms | 23 µs, 95 µs, 20 | yes | 1.7 MB | 1.4 MB | ok |
| depth-1000 | JS | ok | 7.6 s | 507 ms, 640 ms, 20 |  | 152 MB | 7.5 MB | ok |
| depth-1000 | Rust | ok | 1.9 s | 75 ms, 105 ms, 20 |  | 0.0 MB | 295 MB | ok |
| depth-1000 | cells | ok | 160 ms | 50 µs, 0.14 ms, 20 |  | 1.8 MB | 2.3 MB | ok |
| depth-10000 | JS | ok | 97 s | 8.5 s, 10 s, 3 |  | 1417 MB | 67 MB | ok |
| depth-10000 | Rust | error at load |  |  |  |  |  |  |
| depth-10000 | cells | ok | 720 ms | 0.42 ms, 0.78 ms, 20 |  | 1.9 MB | 9.3 MB | ok |
| depth-100000 | JS | skipped: its load at 10,000 took 97 s |  |  |  |  |  |  |
| depth-100000 | Rust | skipped: error at load at 10,000 |  |  |  |  |  |  |
| depth-100000 | cells | ok | 4.9 s | 2.57 ms, 2.72 ms, 20 |  | 0.0 MB | 87 MB | ok |
| breadth-1000 | JS | ok | 7.2 s | 488 ms, 588 ms, 20 |  | 151 MB | 8.3 MB | ok |
| breadth-1000 | Rust | ok | 2.1 s | 47 ms, 60 ms, 20 |  | 0.0 MB | 373 MB | ok |
| breadth-1000 | cells | ok | 203 ms | 79 µs, 0.19 ms, 20 |  | 1.8 MB | 2.3 MB | ok |
| breadth-10000 | JS | ok | 103 s | 6.7 s, 7.1 s, 3 |  | 1404 MB | 74 MB | ok |
| breadth-10000 | Rust | error at load |  |  |  |  |  |  |
| breadth-10000 | cells | ok | 760 ms | 0.25 ms, 0.57 ms, 20 |  | 1.9 MB | 9.9 MB | ok |
| breadth-100000 | JS | skipped: its load at 10,000 took 103 s |  |  |  |  |  |  |
| breadth-100000 | Rust | skipped: error at load at 10,000 |  |  |  |  |  |  |
| breadth-100000 | cells | ok | 5.3 s | 2.00 ms, 2.33 ms, 20 |  | 0.0 MB | 85 MB | ok |
| inversion-1000 | JS | ok | 7.1 s | 995 ms, 1.0 s, 3 |  | 151 MB | 7.5 MB | ok |
| inversion-1000 | Rust | ok | 1.9 s | 0.28 ms, 5.78 ms, 20 | yes | 0.0 MB | 220 MB | c0 = -998, expected -994; c999 = 1, expected 5 |
| inversion-1000 | cells | ok | 176 ms | 64 µs, 0.14 ms, 20 |  | 1.8 MB | 2.3 MB | ok |
| inversion-10000 | JS | error at tick | 87 s |  |  | 1396 MB | 67 MB |  |
| inversion-10000 | Rust | error at load |  |  |  |  |  |  |
| inversion-10000 | cells | ok | 713 ms | 0.56 ms, 1.73 ms, 20 |  | 2.0 MB | 9.4 MB | ok |
| inversion-100000 | JS | skipped: error at tick at 10,000 |  |  |  |  |  |  |
| inversion-100000 | Rust | skipped: error at load at 10,000 |  |  |  |  |  |  |
| inversion-100000 | cells | ok | 4.9 s | 3.50 ms, 3.70 ms, 20 |  | 0.0 MB | 83 MB | ok |
| symbolic-1000 | JS | ok | 7.0 s | 619 ms, 732 ms, 20 |  | 106 MB | 8.3 MB | ok |
| symbolic-1000 | Rust | timeout at tick | 40 s |  |  | 0.0 MB | 1264 MB |  |
| symbolic-1000 | cells | ok | 253 ms | 38 ms, 43 ms, 20 |  | 1.8 MB | 3.1 MB | ok |
| symbolic-10000 | JS | timeout at tick | 99 s | 15 s, 15 s, 1 |  | 945 MB | 74 MB |  |
| symbolic-10000 | Rust | skipped: timeout at tick at 1,000 |  |  |  |  |  |  |
| symbolic-10000 | cells | ok | 995 ms | 374 ms, 448 ms, 20 |  | 1.8 MB | 18 MB | ok |
| symbolic-100000 | JS | skipped: timeout at tick at 10,000 |  |  |  |  |  |  |
| symbolic-100000 | Rust | skipped: timeout at tick at 1,000 |  |  |  |  |  |  |
| symbolic-100000 | cells | ok | 12 s | 3.5 s, 3.6 s, 3 |  | 0.0 MB | 161 MB | ok |
| rebuild-1000 | JS | ok | 25 s | 6.6 s, 8.0 s, 3 |  | 401 MB | 5.6 MB | ok |
| rebuild-1000 | Rust | ok | 68 ms | 0.20 ms, 0.34 ms, 20 | yes | 1.7 MB | 1.3 MB | r[999].h did not resolve |
| rebuild-1000 | cells | ok | 66 ms | 1.75 ms, 3.17 ms, 20 |  | 1.8 MB | 3.2 MB | ok |
| rebuild-10000 | JS | skipped: its load at 1,000 took 25 s |  |  |  |  |  |  |
| rebuild-10000 | Rust | ok | 67 ms | 0.20 ms, 0.29 ms, 20 | yes | 1.7 MB | 1.3 MB | r[9999].h did not resolve |
| rebuild-10000 | cells | ok | 134 ms | 18 ms, 26 ms, 20 |  | 1.8 MB | 17 MB | ok |
| rebuild-100000 | JS | skipped: its load at 1,000 took 25 s |  |  |  |  |  |  |
| rebuild-100000 | Rust | ok | 97 ms | 0.19 ms, 0.39 ms, 20 | yes | 1.7 MB | 1.3 MB | r[99999].h did not resolve |
| rebuild-100000 | cells | ok | 118 ms | 0.34 ms, 0.69 ms, 20 |  | 1.8 MB | 17 MB | r[99999].h did not resolve |
| homework | JS | ok | 1.2 s | 9.86 ms, 13 ms, 20 |  | 25 MB | 1.9 MB |  |
| homework | Rust | unsupported at tick | 82 ms |  |  | 1.8 MB | 2.1 MB |  |
| homework | cells | ok | 106 ms | 0.13 ms, 0.35 ms, 20 |  | 1.9 MB | 1.6 MB |  |
| lesson | JS | ok | 1.1 s | 17 ms, 20 ms, 20 |  | 22 MB | 1.8 MB |  |
| lesson | Rust | ok | 191 ms | 0.69 ms, 0.92 ms, 20 |  | 6.0 MB | 2.4 MB |  |
| lesson | cells | ok | 127 ms | 39 µs, 0.13 ms, 20 | yes | 1.9 MB | 1.5 MB |  |
| sir | JS | ok | 14 s | 2.9 s, 3.1 s, 3 |  | 216 MB | 3.7 MB |  |
| sir | Rust | ok | 99 ms | 0.13 ms, 0.35 ms, 20 | yes | 1.8 MB | 2.5 MB |  |
| sir | cells | ok | 125 ms | 0.19 ms, 0.38 ms, 20 |  | 1.8 MB | 3.6 MB |  |
| venn | JS | ok | 1.8 s | 95 ms, 112 ms, 20 |  | 35 MB | 4.7 MB |  |
| venn | Rust | unsupported at tick | 140 ms |  |  | 1.8 MB | 4.7 MB |  |
| venn | cells | unsupported at tick | 124 ms |  |  | 1.8 MB | 1.6 MB |  |

</details>
