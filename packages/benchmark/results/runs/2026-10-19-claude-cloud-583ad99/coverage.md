# Coverage: 2026-10-19-claude-cloud-583ad99

Machine **claude-cloud** (Intel(R) Xeon(R) Processor @ 2.80GHz, 4 cores, 16093 MB, Linux 6.18.44-fc-v139 x64, Node v22.22.0); commit `583ad99`; 2026-10-19.

Builds: JS: source, bundled by scripts/bundle-driver.mjs; Rust: wasm-pack --dev at opt-level 3, without logging features; cells: wasm-pack --release (npm run build -w packages/cells-core).

What each core can run: every fixture of the run, synthetic and real. ✓ means it loaded, ticked and left the values the fixture expects; a real document has no value check. ✗ gives the values that were wrong. A timeout is 15 s for the load, 15 s for a tick.

| Fixture | JS | Rust | cells |
|---|---|---|---|
| depth-1000 | ✓ | ✓ | ✓ |
| depth-10000 | timeout at load | timeout at load | ✓ |
| depth-100000 | timeout at load | timeout at load | ✓ |
| breadth-1000 | ✓ | ✓ | ✓ |
| breadth-10000 | timeout at load | timeout at load | ✓ |
| breadth-100000 | timeout at load | timeout at load | ✓ |
| inversion-1000 | ✓ | ✗ c0 = 2, expected 6; c999 = 1001, expected 1005 | ✓ |
| inversion-10000 | timeout at load | timeout at load | ✓ |
| inversion-100000 | timeout at load | timeout at load | ✓ |
| symbolic-1000 | ✓ | timeout at load | ✓ |
| symbolic-10000 | timeout at load | timeout at load | ✓ |
| symbolic-100000 | timeout at load | timeout at load | ✓ |
| rebuild-1000 | timeout at load | ✗ r[999].h did not resolve | ✓ |
| rebuild-10000 | timeout at load | ✗ r[9999].h did not resolve | ✓ |
| rebuild-100000 | timeout at load | ✗ r[99999].h did not resolve | ✗ r[99999].h did not resolve |
| homework | ✓ (no value check) | unsupported at tick: typing into a mathInput (the Rust core has no mathInput) | ✓ (no value check) |
| lesson | ✓ (no value check) | ✓ (no value check) | ✓ (no value check) |
| sir | timeout at load | ✓ (no value check) | ✓ (no value check) |
| venn | ✓ (no value check) | unsupported at tick: action triggerActions in the Rust core | unsupported at tick: [cells core gap] action `triggerSet.triggerActions` |
