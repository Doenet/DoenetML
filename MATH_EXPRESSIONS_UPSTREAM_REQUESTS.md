# math-expressions: what DoenetML still needs

**For:** maintainers of [`Doenet/math-expressions`](https://github.com/Doenet/math-expressions)
**Against:** the pinned `vendor/math-expressions` submodule revision — `siefkenj/math-expressions@doenet`

This is the ledger the seam refers to: where the Rust engine diverges from the shape
`packages/math/src/vendored/math-expressions.d.ts` describes, the divergence is recorded here rather
than hidden behind a widened type or a local patch in `packages/math/src/engine-rust.ts`.

## Open — two items

**`substitute_component` accepts a receiver that is not a container, and answers.** Legacy validated
the head at each level of the path and the index range, throwing `expected list, tuple, vector, or
array` / `component out of range`. The compat method validates nothing: `me.fromText("x*y")
.substitute_component(0, 5)` returns `5·y` where legacy threw, and an out-of-range index returns
`undefined` — breaking the "every method hands back an `Expression`" contract the rest of the port
keeps, so the caller fails one line later with `Cannot read properties of undefined`. `Math.js`'s
`substituteMathIntoExpression` walks a path built from the expression's own structure, so it should
not hit either case, but it has no guard of its own. `get_component` has the same shape: its
container check runs on the receiver only, and the rest of the path is delegated to a wasm entry
point that indexes the operands of *any* operator — `me.fromText("(x*y, 3)").get_component([0,0])`
answers `x` where legacy threw. (`@doenet/math`'s `getComponent` restores the legacy contract for
the one DoenetML call site that used the throw as a type test; nothing covers the nested path.)

**The vendored type surface is wider than the engine.** 48 of the 114 members
`packages/math/src/vendored/math-expressions.d.ts` declares on `Expression` are `undefined` at
runtime on the Rust engine: the elementwise numeric methods (`abs`, `exp`, `log`, `log10`, `sqrt`,
`sign`, `re`/`im`/`conj`, `factorial`, `gamma`, `erf`, and the whole trig/hyperbolic family
including `atan2`), the matrix/vector helpers (`perform_matrix_multiplications`,
`perform_vector_scalar_multiplications`, …), and a handful of one-offs (`clean`,
`common_denominator`, `substitute_abs`, `log_subscript_to_two_arg_log`,
`normalize_angle_linesegment_arg_order`, `equalsViaFiniteField`, `toGuppy`, `operators`).

Nothing in DoenetML calls any of them today — re-verified by grepping every one of the 48 across
`packages/*/src` and `packages/*/test`, whose only hits are `Math.atan2` and commented-out code — so
nothing is broken. But TypeScript accepts `expr.sin()` and it fails at runtime.

That second sentence has only just become true, and for a reason worth recording. Until this pass
the declarations reached no consumer at all: `vite-plugin-dts` generates a `.d.ts` per `.ts` source
but does not copy hand-written ones, so `packages/math/dist/types.d.ts` shipped a
`from "./vendored/math-expressions"` that resolved to nothing, `skipLibCheck` swallowed the
`TS2307`, and every `import me from "math-expressions"` was typed `any`. TypeScript accepted
`expr.sin()` because it accepted *everything*. `copyDtsFiles` fixes that, which is what puts the
width of this surface back in play. Reproduce with:

```bash
npm run build -w packages/math
node --input-type=module -e '
import me from "./packages/math/dist/index.js";
console.log(me.fromText("x+1").sin);   // undefined
'
```

Either port them, or narrow the vendored declarations to what the engine implements. Narrowing is
the safer half and does not need upstream — but it should be one edit, made deliberately, rather
than a member quietly disappearing each time the snapshot is refreshed.

## Closed

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
- **`evaluate_to_constant` answers `null`, not `NaN`, for an expression it cannot evaluate.** Legacy
  answered `NaN` unless asked for `null` with `{nan_for_non_numeric: false}`; the compat layer
  always behaves as `false`, and does not read the option. Keeping the two apart is worth having —
  `NaN` is a value an expression can genuinely evaluate *to* (`0/0`), and DoenetML's undefined-slope
  grading depends on the difference — but `null` is the more dangerous one to leak into arithmetic,
  because it coerces to `0` rather than propagating. DoenetML tests for it at every boundary through
  `isNumericConstant`/`evaluateToNumber` (`src/utils/math.ts`); a new call site that forgets will
  fail silently, not loudly.
- **Text output no longer pads container delimiters** — `(0, 0)` where the legacy printer wrote
  `( 0, 0 )`. `toLatex` is unchanged (`\left( 1, 2 \right)` keeps its spacing); only the text
  renderer moved. Test expectations were updated to match.
- **ODE float-precision assertions.** Some tests compare two *independent* integrations with an
  exact `.eq()`. They now differ in the last couple of bits. Those assertions want `closeTo`.

## Adding an entry

Reproduce it from `import me from "math-expressions"` alone, note the submodule revision you
checked against, and say what the legacy library did. An entry that cannot be reproduced without
DoenetML's own code is a DoenetML bug, not an upstream request.
