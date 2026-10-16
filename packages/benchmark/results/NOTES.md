## At a glance

The three cores on the five measurements, from the runs of 2026-10-15 (Node figures are core only through the test adapters; browser figures are end to end through each core's viewer; the Rust core has no viewer). Full tables follow; the notes below say which cells are comparable.

| | JS core | Rust core | Cells core |
|---|---|---|---|
| **Load**, 100 free points, Node | 1.9 s | 0.20 s | 0.09 s |
| Load, 1,000 free points, Node | 57 s | 2.6 s | 0.16 s |
| Load, 10,000 free points, Node | > 60 s | wasm trap | 0.65 s |
| Load, homework page, browser, text to first render | 3.7 s | no viewer | 0.16 s |
| Load, SIR simulation | > 60 s | unsupported (math input) | 0.12 s Node, 0.42 s browser |
| **Tick**, move one of 1,000 points, Node | 27 ms | 1.9 ms | 0.05 ms |
| Tick, drag lag in the browser, 1,000 points | out of budget after a 43 s load | no viewer | 2.0 ms |
| Tick, drag through a chain of 1,000 numbers (inversion), Node | 3.9 s | not comparable | 0.4 ms |
| Tick, a keystroke read by 1,000 texts, Node | 1.1 s | 0.20 s | unsupported (literal text content) |
| Tick, type into one of 100 answers, Node | 13 ms | unsupported (math input) | 0.5 ms |
| **Structural tick**, change a 100-iteration repeat's count, Node / browser | 387 ms / 593 ms | unsupported (repeat) | 1.0 ms / 16.6 ms |
| **Memory** after loading 1,000 points, Node (heap + wasm) | not measured (load > 60 s) | 368 MB | 5 MB |
| Memory after loading chain-1000, Node | 374 MB | 308 MB | 5 MB |
| Memory per additional viewer on a page, browser (iframes, PSS) | about 175 MB | no viewer | about 11 MB |
| **Saved state** after the script, chain-1000, raw (host envelope) | 188 B (1.1 KB) | none | 48 B |
| Saved state, repeat-100 | 319 B (11.4 KB) | unsupported | 46 B |
| **Bundle**, brotli, what a page fetches | 4.4 MB eager set (13.4 MB whole dist) | 0.6 MB wasm, shipped inside the JS worker | 0.9 MB viewer build |
| **Coverage** of the 25-fixture corpus | every fixture loads or times out; all 5 real documents run | 7 fixtures, 4 comparable: points and its two text documents | all 18 synthetic shapes and 3 of 5 real documents |
| Components | 266 | 18 partial, no math input, repeat, answer or choice | the shapes above; gaps `<em>`, `<styleDefinition>`, text with content |

Reading it in one line: the Rust core is one order of magnitude faster than the JS core where it runs and uses the same memory; the cells core is one to three further orders faster, uses a hundredth of the memory, and is the only one of the three that meets the tick and rebuild budgets, while still missing tags the real documents use.

## Notes

_Hand-written; included verbatim by `scripts/render-results.mjs`. Numbers quoted here are from the first runs on 2026-10-15 and are rounded; the tables below are regenerated from the raw records._

**What the first run says.** The cells core runs every synthetic shape and two of the five real documents; the JS core runs every real document but exceeds the 60 s budget on load for every 1,000-plus repeat and fanout and for the SIR simulation; the Rust core runs seven fixtures once the driver speaks its action names (`move` for a point, `updateImmediateValue` for a text input): the `points` shape, its own two text documents, and three whose numbers are not like-for-like (see below). It has no math input, so every fixture typed into one is a gap for it, and the three 10,000-size documents trap in wasm. Where both the JS and cells cores run a document, the gap depends on the metric and its floor. Core ticks in Node are three to four orders of magnitude apart (chain-100: 320 ms against 0.15 ms; fanout-100: 341 ms against 0.37 ms), as the prototype found, and the documents that gave the prototype its largest ratios now exceed the budget in the JS core, so they yield no ratio at all. Loads are one to two orders apart (25 to 50×) because this suite's load starts from DoenetML text and the cells figure carries a fixed floor of about 100 ms (the TypeScript parser, wasm instantiation, the adapter's setup) that the prototype excluded by starting from DAST bytes. Browser step latency is floored at one vsync for the cells core and two for the JS core, so it says little; the drag lag, which has no such floor, is about 60× apart on chain-100 (181 ms against 3 ms, with the JS core answering 10 of 61 moves). Memory is about a tenth. The cells core's real-document blanks were one unsupported tag each; closing the homework page's (`<feedback>`, `<hint>`, `<selectFromSequence>`, `<choiceInput>`, text answers, a point constrained to a function, and the `creditAchieved` spelling, on 2026-10-15) brought it to three of five, with `<em>` (lesson) and `<styleDefinition>` (venn) left. The homework page then loads in 93 ms in Node and 162 ms to first render in the browser, against a 100 ms budget.

**The Rust core, where it runs.** On the one shape all three cores run, `points`, loading 100 points takes 1.9 s in the JS core, 0.2 s in the Rust core and 0.09 s in the cells core, and 1,000 points 57 s, 2.6 s and 0.16 s; moving one point takes 5.8 ms, 0.6 ms and 0.02 ms at 100 and 27 ms, 1.9 ms and 0.05 ms at 1,000. In the browser, where the Rust core has no viewer, dragging that point in a document of 100 points lags 28 ms in the JS viewer and 1.7 ms in the cells viewer; at 1,000 points the JS viewer takes 43 s to load and runs out of budget, the cells viewer lags 2.0 ms; at 10,000 the cells viewer loads in 5 s and lags 19 ms, with the JS viewer not loading within 60 s. On its own text documents, a keystroke that a thousand texts depend on costs the JS core 1.1 s and the Rust core 0.2 s (the cells core refuses a `<textInput>` with literal content). The Rust core's memory is the surprise: 308 MB for chain-1000 and 369 MB for points-1000 against 374 MB and (not measured, timed out) for the JS core and 5 MB for the cells core, nearly all of it wasm linear memory. Its rows for `chain` and `lesson` are not comparable: those documents start from a math input the Rust core does not have, so the chain it loads is broken and its "drag" sets the point's coordinates without the inversion the other two cores perform. The `points` rows are the fair ones.

**Against the budgets.** In the browser the cells core meets the 16 ms tick on every document under about 1,000 components and the 50 ms rebuild up to 1,000 iterations; its loads meet the 100 ms budget only for the smallest documents, and its 10,000-size loads are seconds, which the prototype's own measurements attribute to the renderer (React's first render and JSXGraph), not the core. The JS core meets neither budget on any fixture. On memory, one more JS-core viewer on a page costs about 175 MB (430 MB for one, 949 MB for four, in iframes), one more cells viewer about 11 MB (222 MB and 254 MB), against a budget of 20 MB. On storage, the cells core's saved state for a drag, a typed expression and a submitted answer is tens of bytes; the JS core's `coreState` for the same is several hundred, and the envelope a host stores is kilobytes because `coreInfo` carries the initial render tree. On bundle size, the cells viewer build is 0.87 MB brotli against the 1 MB budget, the JS core's eager set 4.4 MB; the delta the cells core would add to standalone is not yet measurable.

**Cross-check against the prototype's tables** (the prototype's `RESULTS.md` of 2026-10-09, not in this repository). The two suites measure different things on purpose, so the numbers differ in the expected directions. Natively, criterion put a chain-1000 tick at 14 µs and a chain-10000 tick at 132 µs on the core alone; the Node driver reads 0.3 ms and 2.6 ms through the test-core adapter, whose per-action path (resolve the name, build the request, cross the wasm boundary, snapshot) is the rest. Load: criterion's 4.6 ms for chain-1000 from DAST JSON becomes about 270 ms in Node, of which about 30 ms is the TypeScript parser and the rest wasm instantiation and the adapter's setup, stages the prototype excluded by design. In the browser the prototype loaded chain-1000 in 55 ms from a pre-parsed binary fixture; this suite's 440 ms starts from DoenetML text and parses it in the browser. Rebuild: criterion's 1.9 ms for repeat-1000 and 21 ms for repeat-10000 appear here as 3.1 ms and 36 ms in Node and as 16.5 ms (one vsync) and 124 ms in the browser. The ordering of fixtures and the shape of the scaling match throughout; nothing in the cross-check suggests a regression in the core between the two.

**Things the suite found about itself, fixed before these numbers.** A chain of `<math>` elements is one symbolic expression in every core, so the generator's chain shape, once its input became a `<mathInput>` for the JS core, measured symbolic growth rather than dependency depth (the cells tick grew 200× from 100 to 1,000; the JS core hit a recursion limit); the shapes now use `<number>`. The repeat shape's draggable points sat 5 px apart on one line, so the pointer grabbed a neighbour of the point being watched; the shape now has one free point beside the repeat. A synthetic drag sent 61 moves in a burst; paced at 16 ms, a slow core is measured against real input timing. The cells viewer failed every lookup after the first symbolic edit because its component columns are views over wasm memory and detached when it grew; the table now re-reads them.

**Caveats.** Run-to-run spread on this laptop is large: two Node sweeps a few hours apart differed by 30 to 50 percent on loads and ticks (chain-100 in the JS core ticked at 200 ms in one and 320 ms in the other; the cells core loaded chain-1000 in 170 ms and 270 ms), and several JS-core documents that finished loading in one sweep exceeded the budget in the other. Ratios between cores are stable; absolute figures are not, and a comparison between runs needs `scripts/perf-diff.sh`'s interleaving. The Node figures include the test-core adapters, which are parity tools, not production paths; the browser figures are the fair ones. Each Node measurement runs in a fresh process, about a second of startup since the driver was prebundled (it was ten seconds under vite-node for the runs recorded here); startup appears only in `wall_ms`. The error-component check after load is skipped when the budget runs out, so a slow JS-core document may carry errors unnoticed; the corpus was validated for errors in the JS core separately. The memory benchmark's repeat document uses `mod`, which the cells core's math cells do not support, so its document-scaling rows are blank for cells. The JS core's `direct-N` memory scenario puts N viewers in one realm, which the cells viewer cannot do; its rows are iframe only.

## The count-independent cycle check (ADR 0012), 2026-10-16

_What the check adds to a native load, measured with
`cargo run --release -p cells-bench --example cycle_check_cost` in
`packages/cells-core`: medians of seven interleaved loads per side from the
binary fixtures, on the laptop of the runs above. `check` is the time the
check itself took (`LoadTimings::cycle_check`); it is zero for a document
without a repeat, where the check does not run._

| fixture | load, check off (ms) | load, check on (ms) | check (ms) | check / load off | build, check off (ms) |
|---|---:|---:|---:|---:|---:|
| adventure-1 | 18.65 | 18.92 | 0.00 | 0.0% | 17.75 |
| adventure-3 | 48.45 | 48.05 | 0.00 | 0.0% | 46.41 |
| aliases-1000 | 0.96 | 0.84 | 0.00 | 0.0% | 0.83 |
| answers-10 | 0.35 | 0.33 | 0.00 | 0.0% | 0.28 |
| answers-100 | 2.35 | 2.69 | 0.00 | 0.0% | 2.13 |
| chain-100 | 0.66 | 0.73 | 0.00 | 0.0% | 0.55 |
| chain-1000 | 6.03 | 5.74 | 0.00 | 0.0% | 5.78 |
| chain-100000 | 807.65 | 867.24 | 0.00 | 0.0% | 786.08 |
| circles3-1000 | 25.57 | 24.04 | 0.00 | 0.0% | 24.56 |
| curves-10 | 2.81 | 2.79 | 0.00 | 0.0% | 2.11 |
| curves-100 | 12.85 | 13.14 | 0.00 | 0.0% | 10.10 |
| fanout-100 | 1.09 | 1.05 | 0.00 | 0.0% | 0.96 |
| fanout-1000 | 11.59 | 12.14 | 0.00 | 0.0% | 11.10 |
| fanout-10000 | 128.01 | 124.35 | 0.00 | 0.0% | 123.66 |
| grid-100x10 | 7.56 | 6.90 | 0.00 | 0.0% | 7.26 |
| grid-1000x10 | 62.98 | 61.48 | 0.00 | 0.0% | 61.11 |
| hidden-1000 | 3.30 | 3.59 | 0.00 | 0.0% | 3.08 |
| intchain-1000 | 4.83 | 4.78 | 0.00 | 0.0% | 4.63 |
| points-100 | 0.33 | 0.34 | 0.00 | 0.0% | 0.26 |
| points-1000 | 2.56 | 2.48 | 0.00 | 0.0% | 2.39 |
| points-10000 | 30.42 | 28.34 | 0.00 | 0.0% | 29.23 |
| recur-100 | 0.54 | 0.61 | 0.05 | 8.9% | 0.44 |
| recur-1000 | 3.46 | 3.46 | 0.05 | 1.5% | 3.29 |
| repeat-100 | 0.45 | 0.50 | 0.04 | 9.0% | 0.35 |
| repeat-1000 | 2.85 | 2.81 | 0.04 | 1.6% | 2.52 |
| repeat-10000 | 29.03 | 28.93 | 0.05 | 0.2% | 26.95 |
| select-100 | 2.09 | 2.05 | 0.00 | 0.0% | 1.93 |
| select-1000 | 23.01 | 23.72 | 0.00 | 0.0% | 22.07 |
| selectall-100 | 3.23 | 3.23 | 0.00 | 0.0% | 3.03 |
| selectall-1000 | 36.64 | 36.40 | 0.00 | 0.0% | 34.88 |
| selectflat-100 | 1.00 | 1.00 | 0.00 | 0.0% | 0.88 |
| selectflat-1000 | 8.99 | 9.02 | 0.00 | 0.0% | 8.47 |
| sir | 3.56 | 3.71 | 0.12 | 3.4% | 3.25 |
| sliderchain-10 | 0.10 | 0.11 | 0.00 | 0.0% | 0.06 |
| sliderchain-1000 | 4.07 | 3.95 | 0.00 | 0.0% | 3.87 |
| sliderstack-10 | 0.10 | 0.10 | 0.00 | 0.0% | 0.06 |
| sliderstack-1000 | 4.67 | 4.46 | 0.00 | 0.0% | 4.23 |
| sticky-100 | 1.13 | 1.13 | 0.00 | 0.0% | 0.96 |
| sticky-1000 | 11.37 | 11.55 | 0.00 | 0.0% | 10.25 |
| stickyfree-100 | 1.03 | 1.02 | 0.00 | 0.0% | 0.96 |
| stickyfree-1000 | 10.21 | 10.27 | 0.00 | 0.0% | 10.01 |
| symchain-10 | 1.22 | 1.17 | 0.00 | 0.0% | 0.44 |
| symchain-1000 | 92.05 | 93.98 | 0.00 | 0.0% | 27.38 |
| wording-100 | 3.76 | 3.58 | 0.00 | 0.0% | 3.47 |
| wording-1000 | 41.10 | 39.21 | 0.00 | 0.0% | 39.32 |
| wordingall-100 | 2.69 | 2.87 | 0.00 | 0.0% | 2.47 |
| wordingall-1000 | 29.28 | 28.47 | 0.00 | 0.0% | 27.99 |
| wordingflat-100 | 1.38 | 1.34 | 0.00 | 0.0% | 1.21 |
| wordingflat-1000 | 14.46 | 13.92 | 0.00 | 0.0% | 13.65 |

The check costs 0.04 to 0.05 ms on the repeat fixtures whatever their
iteration count, and 0.12 ms on the SIR simulation, whose probe parses the
document's math once more. It runs on the first build pass, where the
repeats have no iterations, so the probe is the only expansion of their
templates there. Its cost scales with the size of the document outside the
repeats, not with the counts: the probe expands the whole document at one
iteration per repeat. The on and off columns cross on most rows; the
run-to-run noise of a load here is larger than the check.
