# Results

Rendered by `scripts/render-results.mjs` on 2026-10-15 at commit `b9c97db54`. CPU: Intel(R) Core(TM) i7-10510U CPU @ 1.80GHz. Raw records: `raw/node-2026-10-15.jsonl`, `raw/browser-2026-10-15.jsonl`, `raw/bundle-2026-10-15.jsonl`, `raw/memory-*.json`.

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

**What the first run says.** The cells core runs every synthetic shape and two of the five real documents; the JS core runs every real document but exceeds the 60 s budget on load for every 1,000-plus repeat and fanout and for the SIR simulation; the Rust core runs nothing in this corpus (its adapter passes the JS core's action names through and the Rust core has its own, and it rejects the text chains that are its own benchmark documents the same way). Where both the JS and cells cores run a document, the gap depends on the metric and its floor. Core ticks in Node are three to four orders of magnitude apart (chain-100: 320 ms against 0.15 ms; fanout-100: 341 ms against 0.37 ms), as the prototype found, and the documents that gave the prototype its largest ratios now exceed the budget in the JS core, so they yield no ratio at all. Loads are one to two orders apart (25 to 50×) because this suite's load starts from DoenetML text and the cells figure carries a fixed floor of about 100 ms (the TypeScript parser, wasm instantiation, the adapter's setup) that the prototype excluded by starting from DAST bytes. Browser step latency is floored at one vsync for the cells core and two for the JS core, so it says little; the drag lag, which has no such floor, is about 60× apart on chain-100 (181 ms against 3 ms, with the JS core answering 10 of 61 moves). Memory is about a tenth. The cells core's three real-document blanks are one unsupported tag each (`<feedback>`, `<em>`, `<styleDefinition>`), which is gap-closing input.

**Against the budgets.** In the browser the cells core meets the 16 ms tick on every document under about 1,000 components and the 50 ms rebuild up to 1,000 iterations; its loads meet the 100 ms budget only for the smallest documents, and its 10,000-size loads are seconds, which the prototype's own measurements attribute to the renderer (React's first render and JSXGraph), not the core. The JS core meets neither budget on any fixture. On memory, one more JS-core viewer on a page costs about 175 MB (430 MB for one, 949 MB for four, in iframes), one more cells viewer about 11 MB (222 MB and 254 MB), against a budget of 20 MB. On storage, the cells core's saved state for a drag, a typed expression and a submitted answer is tens of bytes; the JS core's `coreState` for the same is several hundred, and the envelope a host stores is kilobytes because `coreInfo` carries the initial render tree. On bundle size, the cells viewer build is 0.87 MB brotli against the 1 MB budget, the JS core's eager set 4.4 MB; the delta the cells core would add to standalone is not yet measurable.

**Cross-check against the prototype's tables** (`RESULTS.md` in the cells-prototype archive, 2026-10-09). The two suites measure different things on purpose, so the numbers differ in the expected directions. Natively, criterion put a chain-1000 tick at 14 µs and a chain-10000 tick at 132 µs on the core alone; the Node driver reads 0.3 ms and 2.6 ms through the test-core adapter, whose per-action path (resolve the name, build the request, cross the wasm boundary, snapshot) is the rest. Load: criterion's 4.6 ms for chain-1000 from DAST JSON becomes about 270 ms in Node, of which about 30 ms is the TypeScript parser and the rest wasm instantiation and the adapter's setup, stages the prototype excluded by design. In the browser the prototype loaded chain-1000 in 55 ms from a pre-parsed binary fixture; this suite's 440 ms starts from DoenetML text and parses it in the browser. Rebuild: criterion's 1.9 ms for repeat-1000 and 21 ms for repeat-10000 appear here as 3.1 ms and 36 ms in Node and as 16.5 ms (one vsync) and 124 ms in the browser. The ordering of fixtures and the shape of the scaling match throughout; nothing in the cross-check suggests a regression in the core between the two.

**Things the suite found about itself, fixed before these numbers.** A chain of `<math>` elements is one symbolic expression in every core, so the generator's chain shape, once its input became a `<mathInput>` for the JS core, measured symbolic growth rather than dependency depth (the cells tick grew 200× from 100 to 1,000; the JS core hit a recursion limit); the shapes now use `<number>`. The repeat shape's draggable points sat 5 px apart on one line, so the pointer grabbed a neighbour of the point being watched; the shape now has one free point beside the repeat. A synthetic drag sent 61 moves in a burst; paced at 16 ms, a slow core is measured against real input timing. The cells viewer failed every lookup after the first symbolic edit because its component columns are views over wasm memory and detached when it grew; the table now re-reads them.

**Caveats.** Run-to-run spread on this laptop is large: two Node sweeps a few hours apart differed by 30 to 50 percent on loads and ticks (chain-100 in the JS core ticked at 200 ms in one and 320 ms in the other; the cells core loaded chain-1000 in 170 ms and 270 ms), and several JS-core documents that finished loading in one sweep exceeded the budget in the other. Ratios between cores are stable; absolute figures are not, and a comparison between runs needs `scripts/perf-diff.sh`'s interleaving. The Node figures include the test-core adapters, which are parity tools, not production paths; the browser figures are the fair ones. Each Node measurement runs in a fresh vite-node process, about ten seconds of startup that appears only in `wall_ms`. The error-component check after load is skipped when the budget runs out, so a slow JS-core document may carry errors unnoticed; the corpus was validated for errors in the JS core separately. The memory benchmark's repeat document uses `mod`, which the cells core's math cells do not support, so its document-scaling rows are blank for cells. The JS core's `direct-N` memory scenario puts N viewers in one realm, which the cells viewer cannot do; its rows are iframe only.

## Core only, in Node (ms)

Each core through the shared test-core interface, one process per measurement (`src/run.mjs`). *load* is `createTestCore` on the DoenetML text and includes the parse (*parse* alone is the parser); *tick* is the median of the manifest's first step over 20 rounds; *rebuild* the structural step.

| fixture | javascript load | javascript tick | javascript rebuild | rust load | rust tick | rust rebuild | cells load | cells tick | cells rebuild |
|---|---|---|---|---|---|---|---|---|---|
| adventure-500 | > 60 s at steps |  |  | unsupported: action `mathInput.updateRawValue` |  |  | 258 | 0.29 | 0.22 |
| answers-10 | 836 | 11.3 |  | unsupported: action `mathInput.updateRawValue` |  |  | 84.8 | 0.36 |  |
| answers-100 | 4400 | 12.1 |  | unsupported: action `mathInput.updateRawValue` |  |  | 176 | 0.62 |  |
| answers-1000 | > 60 s at load |  |  | unsupported: action `mathInput.updateRawValue` |  |  | 529 | 0.93 |  |
| chain-100 | 3899 | 320 |  | unsupported: action `point.movePoint` |  |  | 139 | 0.15 |  |
| chain-1000 | > 60 s at steps |  |  | unsupported: action `point.movePoint` |  |  | 272 | 0.31 |  |
| chain-10000 | > 60 s at load |  |  | error: unreachable |  |  | 1296 | 2.57 |  |
| fanout-100 | 5530 | 341 |  | unsupported: action `mathInput.updateRawValue` |  |  | 118 | 0.37 |  |
| fanout-1000 | > 60 s at load |  |  | unsupported: action `mathInput.updateRawValue` |  |  | 331 | 0.35 |  |
| fanout-10000 | > 60 s at load |  |  | error: unreachable |  |  | 1504 | 0.72 |  |
| homework | 1556 | 11.0 |  | unsupported: action `mathInput.updateRawValue` |  |  | unsupported: unsupported tag <feedback> |  |  |
| lesson | 1466 | 29.0 |  | unsupported: action `point.movePoint` |  |  | unsupported: unsupported tag <em> |  |  |
| repeat-100 | 7652 | 8.50 | 317 | unsupported: action `point.movePoint` |  |  | 86.8 | 0.05 | 1.43 |
| repeat-1000 | > 60 s at load |  |  | unsupported: action `point.movePoint` |  |  | 87.6 | 0.09 | 3.11 |
| repeat-10000 | > 60 s at load |  |  | unsupported: action `point.movePoint` |  |  | 224 | 0.84 | 36.2 |
| rust-thousand-chain | 11328 | 0.20 |  | unsupported: action `textInput.updateRawValue` |  |  | unsupported: <textInput> with content other than one reference |  |  |
| rust-thousand-star | 8069 | 0.22 |  | unsupported: action `textInput.updateRawValue` |  |  | unsupported: <textInput> with content other than one reference |  |  |
| sir | > 60 s at load |  |  | unsupported: action `point.movePoint` |  |  | 132 | 0.30 | 4.60 |
| symchain-10 | 712 | 39.7 |  | unsupported: action `mathInput.updateRawValue` |  |  | 117 | 2.03 |  |
| symchain-100 | 3684 | 333 |  | unsupported: action `mathInput.updateRawValue` |  |  | 164 | 6.33 |  |
| symchain-1000 | > 60 s at steps |  |  | > 60 s at load |  |  | 418 | 37.5 |  |
| venn | 4818 | 218 |  | unsupported: action `triggerSet.triggerActions` |  |  | unsupported: unsupported tag <styleDefinition> |  |  |

### Memory and saved state, in Node

*memory* is JS heap growth across the load plus wasm linear memory (the JS core's wasm is the Rust binding its worker holds for DAST normalization). *state* is the session's saved state after the steps, raw / gzipped; for the JS core the `coreState` string, with the whole persistence envelope a host stores in parentheses.

| fixture | javascript memory MB | javascript state | rust memory MB | rust state | cells memory MB | cells state |
|---|---|---|---|---|---|---|
| adventure-500 |  |  |  |  | 3.9 | 18 B / 38 B |
| answers-10 | 10.5 | 650 B / 349 B (1577 B) |  |  | 1.6 | 61 B / 70 B |
| answers-100 | 50.2 | 650 B / 350 B (1577 B) |  |  | 2.1 | 61 B / 70 B |
| answers-1000 |  |  |  |  | 7.7 | 61 B / 70 B |
| chain-100 | 45.5 | 190 B / 131 B (1089 B) |  |  | 1.7 | 49 B / 69 B |
| chain-1000 |  |  |  |  | 3.1 | 48 B / 68 B |
| chain-10000 |  |  |  |  | 17.1 | 46 B / 66 B |
| fanout-100 | 82.3 | 173 B / 135 B (1074 B) |  |  | 1.9 | 31 B / 51 B |
| fanout-1000 |  |  |  |  | 4.9 | 31 B / 51 B |
| fanout-10000 |  |  |  |  | 37.4 | 31 B / 51 B |
| homework | 25.7 | 642 B / 342 B (3207 B) |  |  |  |  |
| lesson | 25.6 | 189 B / 129 B (1688 B) |  |  |  |  |
| repeat-100 | 113.9 | 319 B / 202 B (11.4 KB) |  |  | 1.8 | 46 B / 62 B |
| repeat-1000 |  |  |  |  | 3.3 | 46 B / 62 B |
| repeat-10000 |  |  |  |  | 17.1 | 46 B / 62 B |
| rust-thousand-chain | 120.5 | 2 B / 22 B (860 B) |  |  |  |  |
| rust-thousand-star | 99.4 | 2 B / 22 B (860 B) |  |  |  |  |
| sir |  |  |  |  | 4.0 | 50 B / 70 B |
| symchain-10 | 13.7 | 256 B / 160 B (1166 B) |  |  | 1.7 | 37 B / 57 B |
| symchain-100 | 61.8 | 256 B / 160 B (1166 B) |  |  | 2.0 | 37 B / 57 B |
| symchain-1000 |  |  |  |  | 4.9 | 37 B / 57 B |
| venn | 79.1 | 281 B / 82 B (3835 B) |  |  |  |  |

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
