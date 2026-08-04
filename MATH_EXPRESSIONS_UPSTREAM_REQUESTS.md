# math-expressions: what DoenetML still needs

**For:** maintainers of [`Doenet/math-expressions`](https://github.com/Doenet/math-expressions)
**Against:** `siefkenj/math-expressions@doenet`, `970c1c3`
**Date:** 2026-08-04

The detail lives in [`upstream_requests/`](upstream_requests/), one file per request, each
self-contained enough to file as an issue. This page is the cover note. Nothing that has already been
fixed is repeated here — see the git history of this file if you want the record of what was.

DoenetML has switched permanently to the Rust engine. There is no JavaScript engine to fall back to,
so everything below is on the path to shipping.

## Still open — one item

**[WASM32 stack safety](upstream_requests/03-wasm32-stack-safety.md)** — a crash class reachable from
student input, and already your own `STACK_SAFETY_PLAN.md`. Deep expressions can overflow the ~1 MB
shadow stack, including on `Drop`, and the input arrives from a text box. Steps 1 and 2 of your plan —
iterative `Drop`, parser depth cap — close the vector end-to-end.

That is the entire list. The other two items we were tracking are fixed in `970c1c3`:
`evaluate_to_constant()` now reports ±Infinity rather than `null`, and the printer implements the
ECMAScript scientific-notation threshold with `avoidScientificNotation` honored.

We also filed one of these wrongly and want that on the record: we claimed `panic = "abort"` was why
wasm panics reached us as a bare `unreachable`. It was not — std runs the panic hook before aborting;
what was missing was a hook at all, since the default writes to a stderr that goes nowhere on
wasm32-unknown-unknown. You installed one for 1,958 bytes and the diagnosability problem is gone.

## Where we are

`packages/doenetml-worker-javascript`: **344 failures of 3,436 executed — 90.0% passing.**

Four pins in a row of progress with no regressions: `cdc5343` → `02293bf` fixed 36 tests,
`02293bf` → `08bd4dc` fixed 10, `08bd4dc` → `970c1c3` fixed 59. None broke anything. `02293bf` also
let us delete the last two workarounds in our seam — with **no change in results either way**, which
is how we verify an upstream fix actually covers our usage. `packages/math/src/engine-rust.ts` is now
a straight re-export.

Essentially everything left is ours: 61 coordinate/array mismatches from a bug in our own dependency
resolution, 16 unattributed `matchesPattern` cases, 15 blank-comparison scoring failures in our
`booleanLogic.js`, 12 tagged-value leaks into `.tree` consumers, and 8 scientific-notation
expectations of ours that now need updating to match the engine. The per-cluster ledger is in
[`upstream_requests/README.md`](upstream_requests/README.md).

## Reproducing

```bash
git submodule update --init --recursive          # vendor/math-expressions @ 970c1c3
npm run build -w packages/math
cd packages/doenetml-worker-javascript
npx vitest run -t '@group1'                      # and @group2, @group3
npx vitest run -t '^(?!.*@(?:group1|group2|group3))'   # group4
```

Every engine-level claim is reproducible in isolation, without DoenetML:

```js
import me from "math-expressions";
console.log(String(me.fromAst(-Infinity).evaluate_to_constant()));
```

That form is what moved nine items off this list and onto ours — printed with `String()`, not
`JSON.stringify`, which renders `Infinity` as `null` and cost us a wrong report.
