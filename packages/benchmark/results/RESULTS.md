# Results

Rendered by `scripts/render-results.mjs` on 2026-10-15 at commit `9df7f52e7`. CPU: Intel(R) Core(TM) i7-10510U CPU @ 1.80GHz. Raw records: `raw/node-2026-10-15.jsonl`, `raw/browser-2026-10-15.jsonl`, `raw/bundle-2026-10-15.jsonl`, `raw/memory-*.json`.

A decision suite comparing the JS core, the Rust core and the cells core (see `PLAN.md`). A blank or "unsupported" cell is a result: that core cannot run the document or the action. "> 60 s" is the budget per measurement.

## Reference budgets

Product goals, not gates.

| Measurement | Budget |
|---|---|
| Interactive tick, browser frame latency | 16 ms (one vsync) |
| Structural tick, browser | 50 ms |
| Load, text to first render, homework page | 100 ms: no loading screen |
| Memory, marginal per viewer on a page | 20 MB |
| State storage, homework page after the script | 2 KB raw |
| Bundle, brotli, everything a page fetches | 1 MB |

## Notes

_Hand-written; included verbatim by `scripts/render-results.mjs`. Numbers quoted here are from the first runs on 2026-10-15 and are rounded; the tables below are regenerated from the raw records._

**What the first run says.** The cells core runs every synthetic shape and two of the five real documents; the JS core runs every real document but exceeds the 60 s budget on load for every 1,000-plus repeat and fanout and for the SIR simulation; the Rust core runs seven fixtures once the driver speaks its action names (`move` for a point, `updateImmediateValue` for a text input): the `points` shape, its own two text documents, and three whose numbers are not like-for-like (see below). It has no math input, so every fixture typed into one is a gap for it, and the three 10,000-size documents trap in wasm. Where both the JS and cells cores run a document, the gap depends on the metric and its floor. Core ticks in Node are three to four orders of magnitude apart (chain-100: 320 ms against 0.15 ms; fanout-100: 341 ms against 0.37 ms), as the prototype found, and the documents that gave the prototype its largest ratios now exceed the budget in the JS core, so they yield no ratio at all. Loads are one to two orders apart (25 to 50×) because this suite's load starts from DoenetML text and the cells figure carries a fixed floor of about 100 ms (the TypeScript parser, wasm instantiation, the adapter's setup) that the prototype excluded by starting from DAST bytes. Browser step latency is floored at one vsync for the cells core and two for the JS core, so it says little; the drag lag, which has no such floor, is about 60× apart on chain-100 (181 ms against 3 ms, with the JS core answering 10 of 61 moves). Memory is about a tenth. The cells core's three real-document blanks are one unsupported tag each (`<feedback>`, `<em>`, `<styleDefinition>`), which is gap-closing input.

**The Rust core, where it runs.** On the one shape all three cores run, `points`, loading 100 points takes 1.8 s in the JS core, 0.2 s in the Rust core and 0.12 s in the cells core, and 1,000 points 54 s, 3.0 s and 0.16 s; moving one point takes 5.6 ms, 0.6 ms and 0.03 ms at 100 and 25 ms, 2.6 ms and 0.05 ms at 1,000. On its own text documents, a keystroke that a thousand texts depend on costs the JS core 1.1 s and the Rust core 0.2 s (the cells core refuses a `<textInput>` with literal content). The Rust core's memory is the surprise: 308 MB for chain-1000 and 369 MB for points-1000 against 374 MB and (not measured, timed out) for the JS core and 5 MB for the cells core, nearly all of it wasm linear memory. Its rows for `chain` and `lesson` are not comparable: those documents start from a math input the Rust core does not have, so the chain it loads is broken and its "drag" sets the point's coordinates without the inversion the other two cores perform. The `points` rows are the fair ones.

**Against the budgets.** In the browser the cells core meets the 16 ms tick on every document under about 1,000 components and the 50 ms rebuild up to 1,000 iterations; its loads meet the 100 ms budget only for the smallest documents, and its 10,000-size loads are seconds, which the prototype's own measurements attribute to the renderer (React's first render and JSXGraph), not the core. The JS core meets neither budget on any fixture. On memory, one more JS-core viewer on a page costs about 175 MB (430 MB for one, 949 MB for four, in iframes), one more cells viewer about 11 MB (222 MB and 254 MB), against a budget of 20 MB. On storage, the cells core's saved state for a drag, a typed expression and a submitted answer is tens of bytes; the JS core's `coreState` for the same is several hundred, and the envelope a host stores is kilobytes because `coreInfo` carries the initial render tree. On bundle size, the cells viewer build is 0.87 MB brotli against the 1 MB budget, the JS core's eager set 4.4 MB; the delta the cells core would add to standalone is not yet measurable.

**Cross-check against the prototype's tables** (`RESULTS.md` in the cells-prototype archive, 2026-10-09). The two suites measure different things on purpose, so the numbers differ in the expected directions. Natively, criterion put a chain-1000 tick at 14 µs and a chain-10000 tick at 132 µs on the core alone; the Node driver reads 0.3 ms and 2.6 ms through the test-core adapter, whose per-action path (resolve the name, build the request, cross the wasm boundary, snapshot) is the rest. Load: criterion's 4.6 ms for chain-1000 from DAST JSON becomes about 270 ms in Node, of which about 30 ms is the TypeScript parser and the rest wasm instantiation and the adapter's setup, stages the prototype excluded by design. In the browser the prototype loaded chain-1000 in 55 ms from a pre-parsed binary fixture; this suite's 440 ms starts from DoenetML text and parses it in the browser. Rebuild: criterion's 1.9 ms for repeat-1000 and 21 ms for repeat-10000 appear here as 3.1 ms and 36 ms in Node and as 16.5 ms (one vsync) and 124 ms in the browser. The ordering of fixtures and the shape of the scaling match throughout; nothing in the cross-check suggests a regression in the core between the two.

**Things the suite found about itself, fixed before these numbers.** A chain of `<math>` elements is one symbolic expression in every core, so the generator's chain shape, once its input became a `<mathInput>` for the JS core, measured symbolic growth rather than dependency depth (the cells tick grew 200× from 100 to 1,000; the JS core hit a recursion limit); the shapes now use `<number>`. The repeat shape's draggable points sat 5 px apart on one line, so the pointer grabbed a neighbour of the point being watched; the shape now has one free point beside the repeat. A synthetic drag sent 61 moves in a burst; paced at 16 ms, a slow core is measured against real input timing. The cells viewer failed every lookup after the first symbolic edit because its component columns are views over wasm memory and detached when it grew; the table now re-reads them.

**Caveats.** Run-to-run spread on this laptop is large: two Node sweeps a few hours apart differed by 30 to 50 percent on loads and ticks (chain-100 in the JS core ticked at 200 ms in one and 320 ms in the other; the cells core loaded chain-1000 in 170 ms and 270 ms), and several JS-core documents that finished loading in one sweep exceeded the budget in the other. Ratios between cores are stable; absolute figures are not, and a comparison between runs needs `scripts/perf-diff.sh`'s interleaving. The Node figures include the test-core adapters, which are parity tools, not production paths; the browser figures are the fair ones. Each Node measurement runs in a fresh process, about a second of startup since the driver was prebundled (it was ten seconds under vite-node for the runs recorded here); startup appears only in `wall_ms`. The error-component check after load is skipped when the budget runs out, so a slow JS-core document may carry errors unnoticed; the corpus was validated for errors in the JS core separately. The memory benchmark's repeat document uses `mod`, which the cells core's math cells do not support, so its document-scaling rows are blank for cells. The JS core's `direct-N` memory scenario puts N viewers in one realm, which the cells viewer cannot do; its rows are iframe only.

## Core only, in Node (ms)

Each core through the shared test-core interface, one process per measurement (`src/run.mjs`). *load* is `createTestCore` on the DoenetML text and includes the parse (*parse* alone is the parser); *tick* is the median of the manifest's first step over 20 rounds; *rebuild* the structural step.

| fixture | javascript load | javascript tick | javascript rebuild | rust load | rust tick | rust rebuild | cells load | cells tick | cells rebuild |
|---|---|---|---|---|---|---|---|---|---|
| adventure-500 | > 60 s at structural |  |  | unsupported: typing into a mathInput (the Rust core has no mathInput) |  |  | 294 | 0.32 | 0.24 |
| answers-10 | 802 | 12.3 |  | unsupported: typing into a mathInput (the Rust core has no mathInput) |  |  | 108 | 0.46 |  |
| answers-100 | 4740 | 13.0 |  | unsupported: typing into a mathInput (the Rust core has no mathInput) |  |  | 170 | 0.53 |  |
| answers-1000 | 47820 | 20.0 |  | unsupported: typing into a mathInput (the Rust core has no mathInput) |  |  | 459 | 0.65 |  |
| chain-100 | 3352 | 339 |  | 275 | 0.71 |  | 120 | 0.12 |  |
| chain-1000 | 24099 | 3870 |  | 2272 | 2.38 |  | 411 | 0.41 |  |
| chain-10000 | > 60 s at load |  |  | error: unreachable |  |  | 1168 | 2.25 |  |
| fanout-100 | 6534 | 395 |  | unsupported: typing into a mathInput (the Rust core has no mathInput) |  |  | 147 | 0.28 |  |
| fanout-1000 | > 60 s at load |  |  | unsupported: typing into a mathInput (the Rust core has no mathInput) |  |  | 417 | 0.36 |  |
| fanout-10000 | > 60 s at load |  |  | error: unreachable |  |  | 1820 | 1.14 |  |
| homework | 2170 | 14.6 |  | unsupported: typing into a mathInput (the Rust core has no mathInput) |  |  | unsupported: unsupported tag <feedback> |  |  |
| lesson | 1294 | 22.1 |  | 271 | 2.60 |  | unsupported: unsupported tag <em> |  |  |
| points-100 | 1753 | 5.58 |  | 204 | 0.61 |  | 116 | 0.03 |  |
| points-1000 | 54174 | 25.2 |  | 2977 | 2.55 |  | 163 | 0.05 |  |
| points-10000 | > 60 s at load |  |  | error: unreachable |  |  | 697 | 0.18 |  |
| repeat-100 | 8109 | 11.0 | 387 | unsupported: typing into a mathInput (the Rust core has no mathInput) |  |  | 80.5 | 0.04 | 1.02 |
| repeat-1000 | > 60 s at load |  |  | unsupported: typing into a mathInput (the Rust core has no mathInput) |  |  | 86.0 | 0.09 | 2.53 |
| repeat-10000 | > 60 s at load |  |  | unsupported: typing into a mathInput (the Rust core has no mathInput) |  |  | 128 | 0.46 | 19.7 |
| rust-thousand-chain | 7588 | 1111 |  | 1372 | 216 |  | unsupported: <textInput> with content other than one reference |  |  |
| rust-thousand-star | 8400 | 1066 |  | 1518 | 195 |  | unsupported: <textInput> with content other than one reference |  |  |
| sir | > 60 s at load |  |  | unsupported: typing into a mathInput (the Rust core has no mathInput) |  |  | 122 | 0.19 | 2.67 |
| symchain-10 | 696 | 31.9 |  | unsupported: typing into a mathInput (the Rust core has no mathInput) |  |  | 131 | 2.84 |  |
| symchain-100 | 4113 | 357 |  | unsupported: typing into a mathInput (the Rust core has no mathInput) |  |  | 172 | 6.48 |  |
| symchain-1000 | > 60 s at steps |  |  | unsupported: typing into a mathInput (the Rust core has no mathInput) |  |  | 372 | 28.4 |  |
| venn | 4005 | 160 |  | unsupported: action triggerActions in the Rust core |  |  | unsupported: unsupported tag <styleDefinition> |  |  |

### Memory and saved state, in Node

*memory* is JS heap growth across the load plus wasm linear memory (the JS core's wasm is the Rust binding its worker holds for DAST normalization). *state* is the session's saved state after the steps, raw / gzipped; for the JS core the `coreState` string, with the whole persistence envelope a host stores in parentheses.

| fixture | javascript memory MB | javascript state | rust memory MB | rust state | cells memory MB | cells state |
|---|---|---|---|---|---|---|
| adventure-500 |  |  |  |  | 5.7 | 18 B / 38 B |
| answers-10 | 13.0 | 650 B / 349 B (1577 B) |  |  | 3.5 | 61 B / 70 B |
| answers-100 | 52.8 | 650 B / 350 B (1577 B) |  |  | 3.9 | 61 B / 70 B |
| answers-1000 | 454.1 | 650 B / 351 B (1577 B) |  |  | 9.4 | 61 B / 70 B |
| chain-100 | 48.2 | 190 B / 131 B (1089 B) | 8.1 |  | 3.5 | 49 B / 69 B |
| chain-1000 | 374.0 | 188 B / 131 B (1087 B) | 307.8 |  | 4.8 | 48 B / 68 B |
| chain-10000 |  |  |  |  | 18.8 | 46 B / 66 B |
| fanout-100 | 84.9 | 173 B / 135 B (1074 B) |  |  | 3.7 | 31 B / 51 B |
| fanout-1000 |  |  |  |  | 6.7 | 31 B / 51 B |
| fanout-10000 |  |  |  |  | 39.2 | 31 B / 51 B |
| homework | 28.3 | 642 B / 342 B (3207 B) |  |  |  |  |
| lesson | 28.1 | 189 B / 129 B (1688 B) | 9.3 |  |  |  |
| points-100 | 28.2 | 143 B / 98 B (988 B) | 7.8 |  | 3.5 | 47 B / 58 B |
| points-1000 | 203.4 | 143 B / 98 B (988 B) | 368.6 |  | 4.9 | 47 B / 58 B |
| points-10000 |  |  |  |  | 20.6 | 47 B / 58 B |
| repeat-100 | 116.9 | 319 B / 202 B (11.4 KB) |  |  | 3.6 | 46 B / 62 B |
| repeat-1000 |  |  |  |  | 5.2 | 46 B / 62 B |
| repeat-10000 |  |  |  |  | 19.0 | 46 B / 62 B |
| rust-thousand-chain | 124.4 | 119 B / 100 B (993 B) | 233.0 |  |  |  |
| rust-thousand-star | 101.9 | 113 B / 98 B (987 B) | 148.6 |  |  |  |
| sir |  |  |  |  | 5.9 | 50 B / 70 B |
| symchain-10 | 16.1 | 256 B / 160 B (1166 B) |  |  | 3.5 | 37 B / 57 B |
| symchain-100 | 64.7 | 256 B / 160 B (1166 B) |  |  | 3.8 | 37 B / 57 B |
| symchain-1000 |  |  |  |  | 6.6 | 37 B / 57 B |
| venn | 81.9 | 281 B / 82 B (3835 B) |  |  |  |  |

## Browser end to end (headless Chromium, ms)

Each fixture in each core's viewer (`browser/perf.spec.ts`). *load* is DoenetML text to first render. *drag lag* is, over 60 pointer moves paced at 16 ms, the median time from the oldest unanswered move to the frame that answered it, with how many of the moves got a frame of their own; one vsync is 16.7 ms. *tick* is a step through the core to the next frame; *rebuild* the structural step.

| fixture | javascript load | javascript drag lag | javascript tick | javascript rebuild | cells load | cells drag lag | cells tick | cells rebuild |
|---|---|---|---|---|---|---|---|---|
| adventure-500 | 28728 (> 60 s at steps) |  |  |  | 700 |  | updateValue 16.6 | 16.6 |
| answers-10 | 2030 |  | updateValue 17.3, submitAnswer 16.5 |  | 107 |  | updateValue 16.6, submitAnswer 16.6 |  |
| answers-100 | 5021 |  | updateValue 34.2, submitAnswer 16.3 |  | 159 |  | updateValue 16.6, submitAnswer 16.7 |  |
| answers-1000 | 41060 |  | updateValue 177, submitAnswer 56.4 |  | 424 |  | updateValue 14.5, submitAnswer 16.6 |  |
| chain-100 | 3902 | 181 (10/61) |  |  | 234 | 3.14 (60/61) |  |  |
| chain-1000 | 19555 (> 60 s at steps) |  |  |  | 440 | 9.52 (60/61) |  |  |
| chain-10000 | > 60 s at load |  |  |  | 1292 | 84.6 (60/61) |  |  |
| fanout-100 | 6798 |  | updateValue 652 |  | 391 |  | updateValue 16.7 |  |
| fanout-1000 | > 60 s at load |  |  |  | 1113 |  | updateValue 37.3 |  |
| fanout-10000 | > 60 s at load |  |  |  | 8884 |  | updateValue 321 |  |
| homework | 3743 |  | updateValue 33.2, submitAnswer 17.5 |  | unsupported: page.evaluate: unsupported tag <feedback>
    at Object.load |  |  |  |
| lesson | 3347 | 68.3 (60/61) |  |  | unsupported: page.evaluate: unsupported tag <em>
    at Object.load (eval |  |  |  |
| repeat-100 | 8701 | 55.0 (43/61) |  | 593 | 214 | 0.78 (42/61) |  | 16.6 |
| repeat-1000 | > 60 s at load |  |  |  | 696 | 2.28 (43/61) |  | 16.5 |
| repeat-10000 | > 60 s at load |  |  |  | 4674 | 17.6 (43/61) |  | 124 |
| rust-thousand-chain | 13561 (> 60 s at steps) |  |  |  | unsupported: page.evaluate: <textInput> with content other than one refer |  |  |  |
| rust-thousand-star | 12064 (> 60 s at steps) |  |  |  | unsupported: page.evaluate: <textInput> with content other than one refer |  |  |  |
| sir | > 60 s at load |  |  |  | 415 | 11.5 (19/61) |  | 16.6 |
| symchain-10 | 1803 |  | updateValue 53.0 |  | 109 |  | updateValue 16.7 |  |
| symchain-100 | 3769 |  | updateValue 401 |  | 185 |  | updateValue 16.6 |  |
| symchain-1000 | 26769 (> 60 s at steps) |  |  |  | 583 |  | updateValue 81.3 |  |
| venn | > 60 s at load |  |  |  | unsupported: page.evaluate: unsupported tag <styleDefinition>
    at Obje |  |  |  |

## Memory in the browser (MB)

`packages/memory-benchmark`: proportional set size over the whole Chromium process tree after a forced GC, per embedding scenario; *blank* is the browser alone. The cells viewer has no embed API, so only the iframe scenarios have an equivalent for it.

| scenario | javascript total PSS | cells total PSS | javascript main-realm JS heap | cells main-realm JS heap |
|---|---|---|---|---|
| blank | 181 | 182 | 10 | 10 |
| iframe-1 | 422 | 222 | 38 | 10 |
| iframe-4 | 949 | 254 | 93 | 13 |
| repeat-25 | 514 | error: document did not load: Error: cannot parse math 'mod ( cellN | 38 |  |
| repeat-250 | 781 | error: document did not load: Error: cannot parse math 'mod ( cellN | 51 |  |
| direct-1 | 430 |  | 38 |  |
| direct-4 | 788 |  | 43 |  |

## Bundle size

Everything a page fetches to render a document, raw and brotli (quality 11), as built at the commit in each record (`src/bundle.mjs`).

| set | raw MB | brotli MB | files |
|---|---|---|---|
| javascript (eager set) | 19.6 | 4.4 | 9 |
| javascript (whole dist, no maps) | 59.7 | 13.4 | 1525 |
| rust (wasm only) | 4.1 | 0.6 | 1 |
| cells (viewer build) | 4.0 | 0.9 | 4 |
