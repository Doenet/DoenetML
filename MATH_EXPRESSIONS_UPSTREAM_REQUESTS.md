# math-expressions: what DoenetML still needs

**For:** maintainers of [`Doenet/math-expressions`](https://github.com/Doenet/math-expressions)
**Against:** `siefkenj/math-expressions@doenet`, `7a18c9c`
**Date:** 2026-08-04

The detail lives in [`upstream_requests/`](upstream_requests/), one file per request, each
self-contained enough to file as an issue. This page is the cover note. Nothing that has already been
fixed is repeated here — see the git history of this file if you want the record of what was.

DoenetML has switched permanently to the Rust engine. There is no JavaScript engine to fall back to,
so everything below is on the path to shipping.

## Your last round: both fixes verified, and one of ours was wrong

We pinned `7a18c9c`, rebuilt, and re-ran everything before writing this. Your reply is preserved
verbatim at the bottom of this file.

**Item 1 — display rounding: confirmed fixed**, and your account of the mechanism is right down to the
double rounding. We reproduced the bug at `970c1c3` and its absence at `7a18c9c` through the JS API
rather than the Rust tests, because the JS API is the surface we consume:
`round_numbers_to_precision_plus_decimals(2e21, 3, 2).tree` is now `2e+21`. It cleared **14** of our
failures, not the 8 we attributed to it — the five `*List and rounding, from strings` tests and
`mathInput > display small as zero` were the same defect wearing different clothes. Your js-compat
differential is unchanged at 1,384 failures across both pins, and we diffed the failing *set* rather
than the count: byte-identical. Dropping the `1e-12` tolerance was the right call.

**Item 2 — `parseScientificNotation`: you are right and we were wrong.**
[09](upstream_requests/09-parse-scientific-notation-ignored.md) is withdrawn. Every probe in that
report was lowercase, and the case we should have read is pinned four lines above the uppercase cases
we did not: `"1.2e-3": ["+", ["*", 1.2, "e"], -3]`.

**We are also declining the lowercase opt-in**, so please do not build it. All 30 places our tests set
the attribute use uppercase markup (`1E-12`, `3E2`, `1E-6`, `5E+1`); the lowercase spellings in those
files are JS expected values, not input we parse. A second grammar would buy us nothing today and
would put a Doenet-shaped divergence into a shared parser. If authors report students typing `7e-12`,
we will come back with evidence rather than a hypothesis.

**Item 3 — stack safety: your correction is accurate** and we have stopped repeating our summary. For
the record, "closes the vector end-to-end" came from your plan's §6 step 2, which still says it — that
is the text that needs updating. We confirmed all three of your points against `7a18c9c`: one
`tear_down` call site, `MAX_PARSE_DEPTH` enforced only in `shared_grammar.rs`, `try_from_js`
uncapped.

## Still open — three items

**1. [WASM32 stack safety](upstream_requests/03-wasm32-stack-safety.md)** — unchanged in severity, and
we can add to it. Your two vectors, plus a third:

- `unflatten_left` / `unflatten_right` — **this one is on a path we exercise.** We call
  `me.utils.unflattenLeft` in
  `packages/doenetml-worker-javascript/src/components/Math.js:1486`, on an authored expression, in
  the inverse-definition path for a `<math>` with modifiable children.
- `substitute_var` composing — reachable for us only through nested `<substitute>` components, which
  is authored rather than student input.
- **The caret handler builds deep `Pow` trees in a loop, bypassing `MAX_PARSE_DEPTH`.** Your
  `tests/parse_adversarial.rs` already documents it, as the `#[ignore]`d
  `superscript_nesting_overflows_known_bug`. This is the one that worries us: `^` is a character a
  student types into a math input, and nothing between the keystroke and the recursion bounds it. It
  also means "the cap bounds parser-produced trees" is too generous — it does not bound all of them.

**2. [`.tree` hands back `{"$":"Inf"}` where legacy handed back `Infinity`](upstream_requests/10-tree-returns-tagged-non-finite.md)**
— the case you asked us to send. Eleven of our twelve are that shape, and it is wider than the
rounding functions: `me.fromText("oo").tree` is `{"$":"Inf"}` on a plain parse, with nothing
round-tripped through `fromAst`. Thirteen of your own 1,384 are the same assertion in four spec
files, including all three `quick_rounding.spec.ts` entry points.

The counter-argument is in your source — tagged in both directions, because `{"$":"None"}` has no JS
scalar. Coming *out*, we think it inverts: `None` never had a legacy scalar to lose,
`evaluate_to_constant()` already untags, and the `fromAst(x).tree` fixpoint survives because
`from_ast` still reads both spellings. If you would rather not, say so and we will adapt our consumers
and close it — they are our `typeof x === "number"` checks.

**3. [Signed zero is dropped](upstream_requests/11-negative-zero-not-preserved.md)** — the twelfth
failure, and a value rather than a tag. `(0)(-1)` folds to exact `0`, so `1/((0)(-1))` is `+∞` where
legacy gave `−∞`. Three of your `slow_simplify` specs pin the legacy behaviour and currently fail,
one with the division left unevaluated: `expected [ '/', 6, +0 ] to deeply equal -Infinity`. Low
severity for us — one test, authored content — but it is the same theme as the single residual we
found in the rounding fix, where `round_numbers_to_decimals(-0.001, 2)` now returns `+0` where legacy
returned `-0`.

## Where we are

`packages/doenetml-worker-javascript`: **265 failures of 3,436 executed — 92.3% passing.**

Five pins in a row of progress with no regressions: `cdc5343` → `02293bf` fixed 36 tests,
`02293bf` → `08bd4dc` fixed 10, `08bd4dc` → `970c1c3` fixed 59, `970c1c3` → `7a18c9c` fixed 14. None
broke anything. `02293bf` also let us delete the last two workarounds in our seam — with **no change
in results either way**, which is how we verify an upstream fix actually covers our usage.
`packages/math/src/engine-rust.ts` is now a straight re-export.

On top of that, one fix on our side cleared **65 more, breaking none**: the coordinate/array cluster
and most of the `unexpected value null` cluster turned out to be a single bug of ours, and not one we
need anything from you for. Our inverse definitions encode "this vector component is deliberately
unset" as a **hole** in the AST array. The old engine stored that array by reference, so the hole
survived `fromAst(...).tree`; yours round-trips through JSON, where a hole becomes `null` and
`from_ast` rejects it — correctly. The throw aborted the whole update transaction, so dragging a point
reported nothing and changed nothing. We replaced the hole with an explicit sentinel. Flagging it only
because it is the cleanest example of a hazard worth warning the next migrator about: a representation
whose meaning lived in JS reference semantics, silently becoming by-value.

What is left is ours except for items 2 and 3 above: 16 unattributed `matchesPattern` cases, 7
residual `unexpected value null` call sites, 12 tagged-value/signed-zero failures, and 230 not yet
re-triaged since the coordinate fix landed. The per-cluster ledger is in
[`upstream_requests/README.md`](upstream_requests/README.md).

One test of ours went red on the bump, and it is worth reading because it is not a regression. Our
`solveequations` text assertion compared a numerically-found root with the ideal literal `-4.52365`,
which is a display-rounding tie at 5 significant digits. The literal is stored as
`-4.52364999999999995` and rounds to `-4.5236`; the root the solver finds sits a hair above the tie
and rounds to `-4.5237`. The old code computed `v · 10⁴` as *exactly* `-45236.5` and rounded both of
them up, so two errors cancelled and the test passed. Correct rounding pulled them apart. Fixed on our
side by asserting the rendered text explicitly.

### How we check your fixes now

The pattern that produced this round, and the one we will keep using:

1. Reproduce at the old pin and the new one **through the JS API**, not the Rust tests. Item 1's whole
   story was that `value` was right and only `valueForDisplay` was wrong.
2. Diff the failing *set* between pins, not the count. Equal counts can hide a swap; ours were
   byte-identical, which is what "no regressions" ought to mean.
3. Read the spec that defines the behaviour before filing. Item 2 was uppercase-only in a corpus we
   had not opened, and the third stack-safety vector was an `#[ignore]`d test in yours.
4. Print with `String()`, never `JSON.stringify` — `JSON.stringify(Infinity)` is `"null"`. That has
   now cost us one wrong report and nearly cost us a missed fix.

## Reproducing

```bash
git submodule update --init --recursive          # vendor/math-expressions @ 7a18c9c
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

## Response (yours, on `7a18c9c`)

**Item 1 — display rounding: fixed.** Your read was right down to the mechanism. The float branch of
`Number::round_to_decimals` computed `(v · 10^d).round() / 10^d`, and both steps round: `2e23` is not
representable (`5^23 > 2^53`), so `2e21 · 100` was already wrong before the division made it worse.
Exact values never took that branch, which is why a `<number>` with a typed literal was fine and a
computed one was not, and why asking for more digits recovered — a larger `digits` drives `d`
negative, and `10^-19` happened to survive the round trip.

Rounding now goes through the float's exact binary value (`BigRational::from_float` is lossless),
rounds there, and returns the nearest f64 to the decimal that produces. That is what legacy was doing
with `parseFloat(math.format(v, {notation: "fixed", precision: n}))` — the decimal-string round trip
you inferred. Ties are unchanged (away from zero, resolved against the stored value, so `2.675` → 
`2.67`).

The differential corpus generated from your engine now matches **bit-exactly** on
`round_numbers_to_precision_plus_decimals`; it previously needed a `1e-12` relative tolerance, which
we have removed so the next divergence of this kind cannot hide under it.

**Item 2 — `parseScientificNotation`: not a defect; your repro reads a different case.** The option is
honored, and always was — but only for **uppercase `E`**, and only when the exponent ends the
expression or is followed by `, | ) } ]`. Both restrictions are legacy's, and the lowercase one is
load-bearing rather than an oversight: `e` is Euler's number in this grammar, so `1.2e-3` is
`1.2·e − 3`. Your own spec asserts exactly that (`spec/quick_text-to-ast.spec.js`, and it is still
asserted in our port), so we cannot widen the rule without breaking it.

```js
new me.converters.textToAstObj({ parseScientificNotation: true }).convert("7E-12");  // → 7e-12   ✓
new me.converters.textToAstObj({ parseScientificNotation: false }).convert("7E-12"); // → ["+",["*",7,"E"],-12]
new me.converters.textToAstObj({ parseScientificNotation: true }).convert("7e-12");  // → ["+",["*",7,"e"],-12]  (Euler)
```

So: neither honour-differently nor drop. What we have done instead is make the rule impossible to
misread — it is now stated on the option itself in both parsers, and pinned from both sides
(uppercase honored, lowercase not, delimiter required) in `tests/parser_options.rs` and
`spec/quick_doenet_display_rounding.spec.ts`.

That leaves the real question yours: students type `7e-12`. If DoenetML wants that to parse as
scientific notation, say so and we will add it as an explicit opt-in (a distinct value of the option,
so `1.2e-3` keeps its legacy meaning by default). We did not add it unilaterally because it changes a
grammar decision your own corpus depends on.

**Item 3 — stack safety: still open, and your summary of it is slightly optimistic.** Step 1
(iterative `Drop`) and step 2 (parser depth cap) are done, but they do not close the vector
end-to-end. The cap bounds *parser-produced* trees only, and `tear_down` runs at exactly one call
site — the wasm handle's `Drop` — so it covers neither the ~90 recursive traversals in the core nor
the intermediate trees those passes drop internally. Measured on a 1 MB stack, release profile, the
weakest passes (`flatten`, `serde::to_js`, `to_text`, `canonicalize`) trap at roughly **1,800 levels**;
in a debug build `to_js` traps at **126**, which is below the 128 that `from_js` will admit.

Two vectors are reachable from your side today and are not behind the parser cap:

- `unflatten_left` / `unflatten_right` turn width into depth with no bound. `["+", a1, …, a100000]`
  is depth 2 as JSON — serde_json's 128-deep limit never fires — and becomes a 100,000-deep tree that
  is then serialized and dropped recursively.
- `substitute_var` composes: `e = e.substitute_var("x", e)` **doubles** depth per call, so a dozen
  calls from a JS loop clears 1,800.

We are taking the cheap half first — explicit caps on `try_from_js` and `unflatten_*`, and small-stack
tests for the four heavy passes — rather than blocking on the full iterative-fold port (steps 3–5),
which is the larger piece of work. Flagging the two vectors above in case either is on a path you
already exercise.

**Verification.** Rust: 661 tests, 0 failing; clippy clean. The js-compat differential across 6,289
tests is unchanged at 1,384 failures — no regressions from either change, and the 7 new boundary tests
all pass. The rounding fix has no local test that was failing before, because the case only shows up
at your display path; `spec/quick_doenet_display_rounding.spec.ts` now covers it at the library
boundary in the form you filed it.

**One note on your remaining clusters.** "12 tagged-value leaks into `.tree` consumers" may be ours,
not yours: `me.round_numbers_to_decimals(-Infinity, 2).tree` is `{$: "-Inf"}`, where legacy gave
`-Infinity`. The tag is how non-finite values cross the wasm boundary, and `evaluate_to_constant()`
untags on the way back, but `.tree` does not. If those 12 are that shape, send one and we will take
it.
