# math-expressions: what DoenetML still needs

**For:** maintainers of [`Doenet/math-expressions`](https://github.com/Doenet/math-expressions)
**Against:** the pinned `vendor/math-expressions` submodule revision — `siefkenj/math-expressions@doenet`

This is the ledger the seam refers to: where the Rust engine diverges from the shape
`packages/math/src/vendored/math-expressions.d.ts` describes, the divergence is recorded here rather
than hidden behind a widened type or a local patch in `packages/math/src/engine-rust.ts`.

## Open — three items

1. `substitute_component`/`get_component` validate nothing.
2. The engine is missing 48 of the legacy surface's members.
3. Nine declared parameters the engine accepts and ignores.

The declaration side of items 2 and 3 has been settled — the published and vendored `.d.ts` files
now say what the engine does — so what is open in each is engine work, not documentation.

**`substitute_component` accepts a receiver that is not a container, and answers.** Legacy validated
the head at each level of the path and the index range, throwing `expected list, tuple, vector, or
array` / `component out of range`. The compat method validates nothing: `me.fromText("x*y")
.substitute_component(0, 5)` returns `5·y` where legacy threw, and an out-of-range index returns
`undefined` — breaking the "every method hands back an `Expression`" contract the rest of the port
keeps, so the caller fails one line later with `Cannot read properties of undefined`. The one
DoenetML call site — `invertMath` in `Math.js` (the `substitute_component` at `Math.js:1943`) —
walks a path taken from `inverseMaps[piece].components`, built from the expression's own structure,
so it should not hit either case, but it has no guard of its own. `get_component` has the same shape: its
container check runs on the receiver only, and the rest of the path is delegated to a wasm entry
point that indexes the operands of *any* operator — `me.fromText("(x*y, 3)").get_component([0,0])`
answers `x` where legacy threw. (`@doenet/math`'s `getComponent` restores the legacy contract for
the one DoenetML call site that used the throw as a type test; nothing covers the nested path.)

**The engine is missing 48 of the members the legacy surface declared.** The elementwise numeric
applications (`abs`, `exp`, `log`, `log10`, `sqrt`, `sign`, `re`/`im`/`conj`, `factorial`, `gamma`,
`erf`, and the whole trig/hyperbolic family including `atan2` — 37 of them), the matrix/vector
helpers (`perform_matrix_multiplications`, `perform_matrix_scalar_multiplications`,
`perform_vector_scalar_multiplications`), and a handful of one-offs (`clean`,
`common_denominator`, `substitute_abs`, `log_subscript_to_two_arg_log`,
`normalize_angle_linesegment_arg_order`, `equalsViaFiniteField`, `toGuppy`, `operators`) are
`undefined` at runtime. **This is the ask: port them.** Nothing in DoenetML calls any of them
today — re-verified by grepping every one across `packages/*/src` and `packages/*/test`, whose only
hits are `Math.atan2` and commented-out code — so nothing is broken, but the drop-in is incomplete
by that much.

**The declarations no longer claim otherwise.** Until the twenty-second pass the 48 were declared
on `Expression` and mirrored on `Context`, so TypeScript accepted `expr.sin()` and it failed at
runtime. They have been removed from both the published
`types/math-expressions.d.ts` and this repo's vendored copy — 96 declarations, plus `Context`'s own
`ZmodN` and `parser_parameters`, which are Context-only properties and so fell outside the
`Expression` audit that measured the 48. A `.d.ts` whose job is to describe a drop-in earns nothing
by promising members that are not there: keeping them made the failure a compile-time *success* and
a runtime `TypeError`, which is the worse of the two places to find out. Removing them moves the
report to `tsc`, names the member, and costs a caller who was going to fail anyway nothing.

What is left is checkable, and was checked against the built package rather than read off the
source: every member either interface declares — 66 on `Expression`, 87 on `Context` — is present
at runtime. Reproduce both halves with:

```bash
npm run build -w packages/math
node --input-type=module -e '
import me from "./packages/math/dist/index.js";
console.log(me.fromText("x+1").sin);   // undefined — the gap
'
npm run typecheck                       # unchanged by the narrowing: nothing called them
```

That the declarations reached no consumer at all until recently is worth keeping, because it is why
this only became visible late: `vite-plugin-dts` generates a `.d.ts` per `.ts` source but does not
copy hand-written ones, so `packages/math/dist/types.d.ts` shipped a
`from "./vendored/math-expressions"` that resolved to nothing, `skipLibCheck` swallowed the
`TS2307`, and every `import me from "math-expressions"` was typed `any`. TypeScript accepted
`expr.sin()` because it accepted *everything*. `copyDtsFiles` fixed that, which is what put the
width of this surface in play at all.

The names are enumerated in a comment at the end of `Expression` in both files, and one goes back
the moment the engine implements it — the list is the gap, not a decision to leave it open.

**A worse class than the missing members: declared parameters the engine ignores.** A missing
method throws. A parameter that is declared, accepted and dropped compiles, runs, and answers the
question you did not ask. Two of these were found by accident — `match` was declared to take
`allow_permutations?: boolean` when the implementation takes an options object, so a bare `true`
took the *no-options* path; `evaluate_to_constant` was declared `| null` when it never returns one
— which prompted a member-by-member audit of the declaration file against `lib/` at the
twenty-first pass. Nine more, all verified by running the built package:

| member | declared | does |
| --- | --- | --- |
| `simplify(assumptions?, max_digits?)` | two options params | arity 0 — both dropped |
| `simplify_logical(assumptions?)` | assumptions | arity 0 |
| `collect_like_terms_factors(assumptions?, max_digits?)` | two params | arity 0 |
| `simplify_ratios(assumptions?)` | assumptions | arity 0 |
| `expand(no_division?)` | "if true, don't expand divisions" | arity 0 — always expands |
| `derivative(variable, story?)` | "array to capture steps" | arity 1 — array left empty |
| `equalsViaReal/Complex(other, options?)` | `EqualsOptions` | arity 1 — tolerances have no effect |
| `isAnalytic(options?: … \| string[])` | a `string[]` arm | reads it as an options object, so every flag is `false` — `match(true)` again |
| `Context.toString(expr, params?)` | "convert to text" | returns `"[object Object]"`; the expression-first mirror deliberately skips `Object.prototype` members, so it was never wired |

None is reachable from DoenetML — re-verified by grepping every one across `packages/*/src` — so
nothing here is broken today. All nine now say so in the published declarations (`@deprecated`,
"accepted and ignored", the way `nan_for_non_numeric` already did), the `string[]` arm is gone and
`Context.toString` is no longer declared. **That is the honest half, not the fix**: the engine
should either honor these parameters or upstream should drop them. Two further findings from the
same audit were fixed outright rather than documented, because both were failures rather than
divergences: `add_unit` passed its argument straight to a wasm entry point typed `&str`, so the
`Expression` the declaration invites produced `RuntimeError: memory access out of bounds` (fixed
with the same `varName` coercion `critical_points` already used, pinned in
`quick_doenet_open_items.spec.ts`); and `evaluate()` marshals its bindings through a `Float64Array`,
so a declared-legal `Complex` binding silently became `NaN` and the declared `Complex` *return*
never occurs — now declared `NumericBindings → number`, with `f()` named as the complex path.

**A third of the same class, which that pass's sweep missed.** The `add_unit` fix reported having
swept the remaining string-taking entry points and found them all guarded. `parse_text` and
`parse_latex` — `me.fromText` and `me.fromLatex`, the two most-used entry points in the package —
were not: a number, an `Expression` or a plain object was `RuntimeError: memory access out of
bounds`, and an array tree `arg.charCodeAt is not a function`. The module recovers, so this is a
bad error rather than a corrupted heap, but it is an engine-internal one, and DoenetML renders the
parser's complaint into `<mathInput showPreview>`. Fixed at the twenty-second pass with a `TypeError`
naming the argument type — a throw rather than `add_unit`'s coercion, because `fromText` is declared
to take a `string` and no other value has a faithful reading, so nothing that used to succeed
changed. The rest of the sweep was re-run at runtime, entry by entry, and does hold.

Six further divergences were filed at the twenty-first pass because each needed a decision about
intent rather than an edit. **They were decided at the twenty-second, one verdict each, every one
measured against the built package first.**

| divergence | verdict |
| --- | --- |
| `Context.assumptions` declared a variable-keyed map, is an object of methods | declaration narrowed to the object it is (per-variable facts under `byvar`) |
| `Context.get_assumptions(string[])` — the one declared shape — answers `undefined`; returns a `Tree`, not an `Assumptions` | declaration corrected: `string \| [string[]] \| Expression \| Tree` → `Tree \| undefined`. The nested list is legacy's own spelling — `slow_assumptions.spec.ts`, which mirrors legacy's suite, queries `[["x"]]` |
| `Context.from` and `create_discrete_infinite_set` can answer `undefined` | declared `\| undefined`; it is legacy's failure value and callers must check |
| `Context.class` declared an AST constructor, takes a wasm handle | declared `new (handle: never, …)`, so `new me.class(tree)` is a compile error instead of an object whose every method fails. Use `me.fromAst`. Legacy parity gap, still open |
| `solve_linear` answers a frozen `ABSENT_EXPRESSION` whose `.tree` is `undefined` | **accepted**, and said so in the declaration: legacy handed back an `Expression` to read `.tree` off, and declaring `\| undefined` would break exactly the callers the stand-in exists for. Test the `.tree`, not the result |
| `Expression.match` drops `allow_extended_match`, which the free `utils.match` honors | **fixed**, not documented — `Expression.match` now delegates to the shared implementation, which is what its own comment already claimed, and `MatchOptions` declares the option because it now works from both entry points |

The five declaration changes are also in this repo's vendored copy; the two files still differ only
by the trailing v3 block and one Prettier line wrap, which is the check the vendored header
describes.

## Closed

### `det`/`trace` compared unequal to their own value — fixed at the current pin

**Found at the fourteenth pass, fixed at the fifteenth.** `\det\begin{pmatrix}1&2\\3&4\end{pmatrix}`
simplified to `-2` and compared `false` against `-2`; `trace` and `5` behaved the same way. This was
the engine's *third* numeric path, and the one grading depends on: `equals` samples through
`eval_complex`, whose `head_evaluable` (`eval_numeric/complex.rs`) asked
`special_functions::eval1` whether a head was evaluable. `det` had no kernel at all and `trace`'s
was a scalar identity that cannot see inside a `Matrix`, so `is_opaque_atom` classified the whole
application as an **opaque variable** and sampled it as a fresh unknown, which agrees with `-2` at
no point. `evaluate_to_constant` answered `null` on the same expression, so the divergence was
wider than first recorded (the fourteenth pass reported it as `-2` there, measured through a
`substitute` that simplifies on the way).

The legacy JavaScript library answered `-2`, `5` and `true` to every one of these, so it was a
regression rather than a gap.

The reduction that gets the right answer lived one layer away, in `normalize/fold_apply.rs`'s
`det`/`trace` arm over `crate::matrix::{det, trace}`, which `simplify` reached and the sampler
never consulted. It is now `matrix::scalar_reduction`, called by both, so one place decides which
applications have a scalar value; `head_evaluable` takes the arguments rather than just their
count so it can ask, and `free_symbols` follows by descending into the matrix as it already did for
any other evaluable application. A matrix the reducers decline (non-square, over the size caps)
still comes back as the opaque `OtherOp` residual and is still sampled as an unknown. Separately,
`DET` gained the scalar identity kernel `TRACE` already had — mathjs's `det(2) = 2`, which legacy
also implemented — so the degenerate scalar spelling agrees on all three paths too.

Pinned in the crate's `tests/matrix.rs`, the compat suite's `quick_doenet_compat_pr84.spec.ts`, and
DoenetML's `appliedFunctionSymbols.test.ts` (whose `NO_SCALAR_KERNEL` exemption for `det` — the
place the omission had been codified, exactly as `erf`'s was — is now empty). All verified to fail
against the unfixed engine.

### `mod((7,3))` compared unequal to `1` — fixed at the current pin

**Found and fixed at the sixteenth pass, by asking what else the `det` split could reach.** Same
two layers, same failure shape, different way in: an extra pair of parentheses. Legacy's text
parser wrote one tree for `mod(7,3)` and `mod((7,3))` — a head applied to a tuple — so the extra
parentheses cost nothing and both answered `1`. This parser keeps the spellings apart, and only
`normalize/fold_apply.rs` put them back together, spreading a single list argument before folding.
The sampler did not, and `known_function("mod", 1)` is false, so `simplify(mod((7,3)))` was `1`
while `equals(mod((7,3)), 1)` was `false` and `evaluate_to_constant` was `None`. `nPr` and `nCr`
are the other two heads whose folder takes the arity the spread produces.

The spread is now `normalize::spread_list_argument`, `pub(crate)` and consulted by both layers,
which is `matrix::scalar_reduction`'s shape one function over. The arity check still happens
downstream on the spread list, so `abs((-3,5))` stays symbolic on both layers rather than being
forced into a two-argument `abs`. Pinned in `tests/equality.rs`, `normalize/fold_apply.rs` and the
compat suite, verified to fail against the unfixed engine.

Two things had to be measured before the fix could be the right one, and both are worth recording
because the obvious fix is the wrong one. The crate's own open ledger had described this as
`is_variadic` testing "has an exact folder" rather than "is an aggregate" — i.e. as the *fold*
over-spreading. Narrowing the fold to the aggregates makes `mod((7,3))` stop being `1`, which is a
regression against `math-expressions@2.0.0-alpha94`, not a fix; the spreading is legacy parity and
the sampler was the half that was wrong. And that entry's example,
`["apply","mod",["tuple",7,3]]`, never took the branch at all: the JS deserializer flattens a tuple
argument into an argument list first, so a DoenetML tree could not reach it and only the text
parser could.

Related, and **also fixed at the current pin** — filed at the seventeenth pass, taken on at the
eighteenth. The spread above reaches only the heads whose *spread* arity is evaluable, which is the
subset that reached grading. Underneath it was a serialization problem, not an equality one:
`f((x, y))` parsed to `Apply(f, [Seq(Tuple, [x, y])])` and `f(x, y)` to `Apply(f, [x, y])`, and both
serialize to the identical JS AST `["apply","f",["tuple","x","y"]]`, which deserializes back to the
second. So `me.fromText("f((1,2))").tree` equalled `me.fromText("f(1,2)").tree` byte for byte while
`x.equals(me.fromAst(x.tree))` was `false` — an expression that was not equal to itself after a
round trip through its own `.tree`.

**It did not reach grading, and that was measured rather than reasoned.** `checkEquality.js` hands
raw `.tree` values to `check_equality`, which rebuilds both operands with `me.fromAst` immediately
before `.equals()` — so an `<answer>` awarded full credit for `sin((7,3))` against `sin(7,3)`, and
`<boolean>$m1 = $m2</boolean>` was `true` while the underlying objects compared `false`. What it
did reach is **display**: a `<mathInput>` holding `\sin\left(\left(x,y\right)\right)` rendered
with its inner parentheses, and after a save/restore through `serializedComponentsReviver` the same
saved JSON rendered without them. Legacy is stable across the same round trip, so it was a
regression — a rendering one.

The fix is in the **parsers**, not in canonicalization, because the printers read the raw tree: a
canonical-form fix would have repaired `equals` and left the display wrong. `parse::common::apply`
flattens a lone `Tuple` argument exactly as `expr::serde::try_from_js` always has, and every
`Expr::Apply` both parsers build now goes through it. Only a lone tuple flattens — in
`f((x, y), z)` the inner tuple is one of two arguments and round-trips intact. `spread_list_argument`
keeps its place for the list kinds that are *not* `Tuple`.

Fixing it exposed a second, older divergence one layer down, which is why `floor((x,y))` had
"changed notation outright" in the filing: the LaTeX printer's bracket notations were guarded on
`args.len() == 1` and fell through to `head\left(…\right)` otherwise, spelling the head as a
command that does not exist — `abs(x, y)` rendered as `\abs\left( x, y \right)` and `sqrt(x, y)`
as `\sqrt\left( x, y \right)`, neither of which MathJax can render. That was reachable from any
stored tree before the parser change, which merely routed more spellings into it. They now wrap the
tuple, which is what the JS AST says the argument is and exactly what legacy rendered.

And **fixed at the current pin** after being filed once: the sweep accompanying the `det`
fix concluded that `rootof`, the one remaining registry definition with no evaluation, was
unreachable because `canonicalize` rewrites `Apply(rootof, …)` into the `Expr::RootOf` leaf. The
rewrite is conditional — `from_apply_args` has to be able to read the polynomial argument, and
`expr_to_upoly` read only a *sum of monomials* — so a factored spelling stayed an opaque
application and `rootof((x-1)(x-2), 0)` compared unequal to `1` and to `rootof(x^2-3x+2, 0)`, the
same number. `expr_to_upoly` now multiplies and adds polynomials, capped on products only (a
monomial sum grows no coefficients, so capping it would narrow `rootof(x^70 - x^69, 0)`, which the
old reading accepted via the squarefree radical).

Nothing here reaches DoenetML — `rootof` is in neither of DoenetML's applied-function lists, and
the leaves `critical_points()` produces are canonical by construction — so this is recorded rather
than requested. It was fixed upstream instead of left filed because it is a self-inconsistency in
the engine's own new surface, which ships to npm as `math-expressions@3.x`.

### Odd roots of a negative number — fixed at the current pin

**Was the headline open item through ten review passes; fixed in the eleventh.** `x^(1/n)` was
evaluated on the principal complex branch while `nthroot`/`cbrt` and the perfect-power fold read
it on the real one — so the branch depended on whether the radicand happened to be a perfect power
(`(-8)^(1/3)` → `-2` but `(-2)^(1/3)` → `0.6300 + 1.0911i`), `equals` told the same number apart
from itself (`equals((-8)^(1/3), (-2)^(1/3)·4^(1/3))` was false), and four DoenetML `<answer>`
cases that scored 1 on legacy `math-expressions@2.0.0-alpha93` scored 0 (measured end to end on
both trees at the tenth pass).

The fix reads `Pow(negative real, p/q)` with odd `q` on the **real** branch, at the three sites the
tenth pass's recipe named: `rule_radical`'s `Pow` arm in `normalize/simplify.rs` pulls the sign out
(`(-2)^(1/3) → -2^(1/3)`) so the certified-constant tape never sees a negative base — the
load-bearing site, since `evaluate_to_constant` runs `simplify_core` and the certified tape before
any evaluator; `eval_complex`'s `Pow` arm takes the same branch for sampling, gated structurally on
an exact rational exponent with an odd denominator (`odd_root_exponent` also matches the raw
quotient-node shape, because that walk is `evaluate_many`'s per-point fallback); and
`CBRT::eval1`/`NTHROOT::eval2` follow, so the root spellings sample like the power spelling. Even
roots, `(-8)^0.3333` (= `3333/10000`), complex bases and the `i`-literal realness pins all stay
put — pinned with the rest of the matrix in the crate's `tests/odd_root_real_branch.rs`, the compat
suite's `quick_doenet_grading_gaps.spec.ts` (both verified to fail against the unfixed engine), and
DoenetML's `answerValidation/oddRootsOfNegatives.test.ts` (which carries its own wrong-answer
controls, so it cannot pass vacuously).

The related `is_real(cbrt(-8)) = false` incompleteness (`Facts::of_constant` classifies by
`eval_complex`, which now answers the real branch for these) is resolved for the odd-root shapes by
the same change; the broader "non-realness does not propagate through `+`/`*`/`^`" incompleteness
is unchanged and remains deliberately declined — see the "Non-realness does not propagate through
`+`, `*` or `^`" entry in `vendor/math-expressions/active-plans/PR84_REVIEW_KNOWN_ISSUES.md`.

### Everything earlier

Every other *behavioral* request previously filed here has landed upstream. Re-verified against the
current pin by probing the built package directly:

```bash
npm run build -w packages/math
node --input-type=module -e '
import me from "./packages/math/dist/index.js";
console.log(me.fromText("0/0").simplify().tree);            // NaN, not 0
console.log(me.fromText("floor(55.33)").simplify().tree);   // 55
console.log(me.fromText("abs(-3)").simplify().tree);        // 3
console.log(me.fromText("log_2(2^3)").simplify().tree);     // 3
console.log(me.fromText("1+x+2").evaluate_numbers({skip_ordering: true}).tree);
console.log(me.fromAst(me.fromText("3")).tree);             // 3 — Expression accepted
console.log(me.simplify(me.fromText("x+x")).tree);          // context-level family
console.log(typeof me.fromAst(Infinity).tree);              // "number", not a {"$":…} tag
console.log(me.fromAst(5.252e-13).toString());              // scientific notation is used
'
```

Concretely, all of the following once had entries here and no longer reproduce:

| Was | Now |
| --- | --- |
| `simplify()` folded no numeric-function applications | folds them |
| `0/0` simplified to `0` | `NaN` |
| `evaluate_numbers({skip_ordering: true})` threw | returns `["+", 1, "x", 2]`, order preserved |
| `log_b(b^n)` was not simplified | `log_2(2^3)` → `3` |
| `fromAst` rejected an `Expression` where a tree was expected | unwrapped by `astReplacer`, recursively |
| no context-level operation family (`me.simplify(expr)`) | present |
| `.tree` handed back `{"$":"Inf"}` / `{"$":"NaN"}` | untagged to JS `Infinity` / `NaN` |
| the Rust printer never used scientific notation | uses it |
| `default_order` was a compat-layer no-op | backed by `normalize::default_order` |
| `substitute` replaced bindings left-to-right, so one could capture the next | simultaneous, as legacy was |
| `variables(true)` ignored its argument, reporting `x_1` as `x` | reports the subscripted name |
| `f()` threw `Invalid ast` on any tree holding `±Infinity`/`NaN` | compiles and evaluates them |

## Not upstream's — ours to decide

These are behavioral differences, not defects, and the decision belongs to DoenetML:

- **Sparse arrays reaching `fromAst`** — *settled, not open.* `Point.js`, `Ray.js`, `Vector.js` and
  `DirectionComponent.js` build a vector AST component-by-component and leave holes in it;
  `JSON.stringify` turns those into `null`, which the engine correctly rejects with `unexpected
  value null`. A hole means "no desired value for this component", and rather than ask the engine to
  guess, DoenetML now says so explicitly: `markUnspecifiedComponents` writes the
  `UNSPECIFIED_COMPONENT` marker into the empty slots, and `preprocessMathInverseDefinition` and
  `EssentialValueWriter` read it back. See `packages/doenetml-worker-javascript/src/utils/math.ts`.
- ~~**`evaluate_to_constant` answers `null`, not `NaN`, for an expression it cannot evaluate.**~~
  *Settled the other way at the twentieth pass, and this entry was still stating the old behaviour
  in the present tense two passes later.* The reasoning was that keeping "cannot evaluate" and
  "evaluates to `NaN`" apart was worth having. It was not: `null` is *anti*-poisoning in JavaScript
  (`Number(null)` is `0`, `null + 5` is `5`, `null > -1` is `true`, `Number.isNaN(null)` is
  `false`), so a value that did not exist behaved like zero in every consumer not individually
  taught to test for it — roughly fourteen grading defects, found one at a time. The compat layer
  answers `NaN` now, as legacy did, and the declarations say `number | Complex`.
  `nan_for_non_numeric` is accepted and ignored; nothing distinguishes the two cases, and code that
  needs to should ask `expr.variables()`. `isNumericConstant`/`evaluateToNumber`
  (`src/utils/math.ts`) stay at the boundaries for the `Complex` arm, which a `number`-typed state
  variable still cannot hold.
- **Text output no longer pads container delimiters** — `(0, 0)` where the legacy printer wrote
  `( 0, 0 )`. `toLatex` is unchanged (`\left( 1, 2 \right)` keeps its spacing); only the text
  renderer moved. Test expectations were updated to match.
*(An "ODE float-precision assertions" entry stood here — tests comparing two independent
integrations with an exact `.eq()` were said to differ in the last couple of bits. It no longer
reproduces and is retired rather than restated: `src/test/dynamicalsystem/` is 5 files / 16 tests,
all passing at the current pin, and the only change this diff makes to that directory is container
delimiters in `cobwebpolyline.test.ts`. No assertion was loosened to get there.)*

## Adding an entry

Reproduce it from `import me from "math-expressions"` alone, note the submodule revision you
checked against, and say what the legacy library did. An entry that cannot be reproduced without
DoenetML's own code is a DoenetML bug, not an upstream request.
