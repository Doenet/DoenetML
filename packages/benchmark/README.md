# @doenet/benchmark

The performance suite: how the JS core, the Rust core and the cells core
compare on update time, load time, memory, state storage size and bundle
size. `PLAN.md` records the decisions; this file is how to use it.

It is a decision suite, re-run as the cores change, with raw results
committed. It is not a regression gate: timings carry product budgets as
reference lines, and only bundle size fails anything.

## The corpus

One manifest per fixture in `fixtures/*.json`. `npm run fixtures` lists them
and checks that each resolves to text.

| Field | Meaning |
|---|---|
| `name` | The file name without `.json`. Synthetic shapes are `shape-N`. |
| `tier` | `real` (a document an author would write) or `synthetic` (one mechanism at three sizes). |
| `mechanism` | What the fixture exercises, one line. |
| `source` | Where the DoenetML comes from: `{"file": "x.doenet"}` in `fixtures/`, `{"path": "..."}` relative to the repository root, or `{"generate": "spec"}` for `cells-docgen` (output cached in `fixtures/generated/`, ignored by git). |
| `steps` | The interaction script. The driver cycles through it and times every step; consecutive steps alternate values so each one changes something. |
| `structural` | The structural change, in the same form, or `null`. A structural step rebuilds the document (a repeat's length, a conditional's case). |
| `notes` | Anything a reader of the table needs to know. |

A step is `{"action", "target", ...}`. `target` is a name path as the
document resolves it (`p3.mi`). Actions, with the core action they map to:

| Action | Fields | Core action |
|---|---|---|
| `movePoint` | `x`, `y` | `movePoint` |
| `updateValue` | `value` | `updateRawValue` then `updateValue` on a math or text input |
| `submitAnswer` | | `submitAnswer` on an answer |
| `triggerActions` | | `triggerActions` on a triggerSet |

Generated fixtures are written for the cells core and use three things the
JS core does not have: `<numberInput>`, `<answer response="$mi">` and
`maxNumber` on a repeat. `src/fixtures.mjs` rewrites them (to `<mathInput>`
with a `prefill`, to an input inside the answer, and away) so every core
reads the same text.

### Real documents

| Fixture | What it is |
|---|---|
| `homework` | Twelve calculus problems with math inputs, answers, hints and feedback. The reference document for the load and storage budgets. Written for the suite. |
| `lesson` | Prose: sections of text and math with one graph and two inline exercises, what PreTeXt embeds. Written for the suite; stands in for the PreTeXt sample article, which is PreTeXt XML, not DoenetML. |
| `sir` | The SIR simulation: function iterates feeding polylines and a table, with parameters bound to inputs. |
| `venn` | The JS core's memory-bench document: shaded Venn regions behind toggles, eight answers. |
| `adventure-1` | A three-way conditional over graphs of points, chosen by an input. |

### Synthetic shapes

`chain`, `fanout` and `repeat` at 100, 1,000 and 10,000; `symchain` and
`answers` at 10, 100 and 1,000. Plus the Rust core's two benchmark
documents, `rust-thousand-chain` and `rust-thousand-star`, so it has rows it
can run.

## Reference budgets

| Measurement | Budget |
|---|---|
| Interactive tick, browser frame latency | 16 ms |
| Structural tick, browser | 50 ms |
| Load, text to first render, `homework` | 100 ms |
| Memory, marginal per viewer on a page | 20 MB |
| State storage, `homework` after the script | 2 KB raw |
| Bundle, brotli, everything a page fetches | 1 MB |
