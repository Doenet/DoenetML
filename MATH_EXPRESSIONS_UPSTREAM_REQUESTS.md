# math-expressions: what DoenetML still needs

**For:** maintainers of [`Doenet/math-expressions`](https://github.com/Doenet/math-expressions)
**Against:** the pinned `vendor/math-expressions` submodule revision — `siefkenj/math-expressions@doenet`

This is the ledger the seam refers to: where the Rust engine diverges from the shape
`packages/math/src/vendored/math-expressions.d.ts` describes, the divergence is recorded here rather
than hidden behind a widened type or a local patch in `packages/math/src/engine-rust.ts`.

## Open — one item

**The vendored type surface is wider than the engine.** 48 of the 114 members
`packages/math/src/vendored/math-expressions.d.ts` declares on `Expression` are `undefined` at
runtime on the Rust engine: the elementwise numeric methods (`abs`, `exp`, `log`, `log10`, `sqrt`,
`sign`, `re`/`im`/`conj`, `factorial`, `gamma`, `erf`, and the whole trig/hyperbolic family
including `atan2`), the matrix/vector helpers (`perform_matrix_multiplications`,
`perform_vector_scalar_multiplications`, …), and a handful of one-offs (`clean`,
`common_denominator`, `substitute_abs`, `log_subscript_to_two_arg_log`,
`normalize_angle_linesegment_arg_order`, `equalsViaFiniteField`, `toGuppy`, `operators`).

Nothing in DoenetML calls any of them today, so nothing is broken — but TypeScript currently accepts
`expr.sin()` and it fails at runtime. Reproduce with:

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

## Nothing else is open

Every *behavioral* request previously filed here has landed upstream. Re-verified against the
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

## Not upstream's — ours to decide

These are behavioral differences, not defects, and the decision belongs to DoenetML:

- **Sparse arrays reaching `fromAst`.** `Point.js` builds `Array(n+1)` and fills only the
  components being set; `JSON.stringify` turns the holes into `null`, which the engine correctly
  rejects with `unexpected value null`. A hole means "no desired value for this component"; mapping
  it to `{"$":"None"}` is a semantic choice, so it is deliberately left unfixed rather than guessed
  at.
- **Text output no longer pads container delimiters** — `(0, 0)` where the legacy printer wrote
  `( 0, 0 )`. `toLatex` is unchanged (`\left( 1, 2 \right)` keeps its spacing); only the text
  renderer moved. Test expectations were updated to match.
- **ODE float-precision assertions.** Some tests compare two *independent* integrations with an
  exact `.eq()`. They now differ in the last couple of bits. Those assertions want `closeTo`.

## Adding an entry

Reproduce it from `import me from "math-expressions"` alone, note the submodule revision you
checked against, and say what the legacy library did. An entry that cannot be reproduced without
DoenetML's own code is a DoenetML bug, not an upstream request.
