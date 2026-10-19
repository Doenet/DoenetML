# Coverage: 2026-10-19-claude-cloud-b686555cd

Machine **claude-cloud** (Intel(R) Xeon(R) Processor @ 2.10GHz, 4 cores, 16093 MB, Linux 6.18.44-fc-v139 x64, Node v22.22.0); commit `b686555cd`; 2026-10-19.

Builds: JS: source, bundled by scripts/bundle-driver.mjs; Rust: wasm-pack --release, without logging features; cells: wasm-pack --release (npm run build -w packages/cells-core).

What each core can run: every fixture of the run, synthetic and real. ✓ means it loaded, ticked and left the values the fixture expects; a real document has no value check. ✗ gives the values that were wrong. A timeout is 120 s for the load, 15 s for a tick.

| Fixture | JS | Rust | cells |
|---|---|---|---|
| depth-1000 | ✓ | ✓ | ✓ |
| depth-10000 | ✓ | error at load: unreachable | ✓ |
| depth-100000 | skipped: its load at 10,000 took 97 s | skipped: error at load at 10,000 | ✓ |
| breadth-1000 | ✓ | ✓ | ✓ |
| breadth-10000 | ✓ | error at load: unreachable | ✓ |
| breadth-100000 | skipped: its load at 10,000 took 103 s | skipped: error at load at 10,000 | ✓ |
| inversion-1000 | ✓ | ✗ c0 = -998, expected -994; c999 = 1, expected 5 | ✓ |
| inversion-10000 | error at tick: killed by SIGSEGV | error at load: unreachable | ✓ |
| inversion-100000 | skipped: error at tick at 10,000 | skipped: error at load at 10,000 | ✓ |
| symbolic-1000 | ✓ | timeout at tick | ✓ |
| symbolic-10000 | timeout at tick | skipped: timeout at tick at 1,000 | ✓ |
| symbolic-100000 | skipped: timeout at tick at 10,000 | skipped: timeout at tick at 1,000 | ✓ |
| rebuild-1000 | ✓ | ✗ r[999].h did not resolve | ✓ |
| rebuild-10000 | skipped: its load at 1,000 took 25 s | ✗ r[9999].h did not resolve | ✓ |
| rebuild-100000 | skipped: its load at 1,000 took 25 s | ✗ r[99999].h did not resolve | ✗ r[99999].h did not resolve |
| homework | ✓ (no value check) | unsupported at tick: typing into a mathInput (the Rust core has no mathInput) | ✓ (no value check) |
| lesson | ✓ (no value check) | ✓ (no value check) | ✓ (no value check) |
| sir | ✓ (no value check) | ✓ (no value check) | ✓ (no value check) |
| venn | ✓ (no value check) | unsupported at tick: action triggerActions in the Rust core | unsupported at tick: [cells core gap] action `triggerSet.triggerActions` |
