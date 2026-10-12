# Plan 3: line, circle and polygon as operator chains

The brief is `docs/history/instructions3.md`. This file records the decisions reached
before implementation. Vocabulary is in `CONTEXT.md`; the hard-to-reverse
decision is ADR 0006. Results, the inverse-branch table and the recorded
deviations are the "Plan 3" section of `results/NOTES.md`; the per-test
adapter output is `results/raw/plan3-adapter-2026-10-05.txt`.

## The question

Hand-written definitions are already operations. The open question is whether
*inverses* expressed as local operator inverses can match DoenetML's inverse
behavior for its most complicated components, and if not, what more an inverse
needs. Two sub-questions:

1. **Build time or compute time.** How much of the current `<line>` and
   `<circle>` inverse complication is build-time variety (many ways to
   specify the shape) that a build-time choice of operator chain dissolves?
2. **Context.** Does any inverse inherently need more than its inputs, their
   current values and the requested value?

## Bar for the verdict

Unchanged from plan 2. A snag is **fatal** if a component needs a custom
forward or inverse function in the core, or a per-component branch; **noted**
if it needs a new generic core concept. Data annotations on operators (which
input an instruction writes, which inverse rule it uses) are data. Geometric
operators (`Circumcenter`, `Distance`, `Atan2`, `PolarOffset`) are first-class
instructions with their own inverse rules; they are math functions with no
knowledge of components and clear the bar. The write-up lists every such
operator with its inverse rule in one table.

## Scope

Components: `<line>` in every mode (two through points; one point plus
`slope`, `parallelTo` or `perpendicularTo`; `equation`), `<circle>` in all
nine specification cases, `<lineSegment>` (as a direction source and because
it is two points), `<polygon>` with `rigid`, `preserveSimilarity` and
`allowDilation`, and `<constrainToGrid>` on points, with `constrainTo` a line
or circle only if it is one more projection operator. `fixed` turns a
component's essential cells into fixed cells; `draggable` is read by the
action and not sent.

Declared gaps (the adapter reports them as gaps, not failures): labels,
styles and theme descriptions, display digits and decimals, scientific
notation, 3D lines, warnings and bad-input diagnostics, `hideOffGraphIndicator`,
`propIndex` and array notation on through points, sticky groups,
`rotationHandle`, `<vector>` and `<ray>` as direction sources.

## Oracle and harness

The oracle is the current core's vitest suites `line.test.ts` (69 tests),
`circle.test.ts` (46) and the rigid tests of `polygon.test.ts` (11), run
unmodified against the prototype through a third `DOENET_TEST_CORE` adapter
modelled on `test-core-rust.ts`, on a branch of Charles's fork of DoenetML,
pointed at the prototype's wasm build by an environment variable. Nothing is
committed there without Charles's say-so.

Every asserted value is matched by default. A benign deviation is allowed
when the current core's choice is arbitrary and the prototype's is simpler,
recorded once per cause, never per test. Known deviations going in: `slope`,
`xintercept`, `yintercept` are invertible here and read-only there; through
angles are recomputed from current cells rather than saved, so degenerate
configurations may differ; corners where the current core's post-correction
declines to act.

## Mechanisms decided

- **Fan-out inverse.** An instruction's inverse may write several inputs.
- **Multi-output instructions.** One instruction may own several output
  cells. Requests in one tick on outputs of the same instruction are gathered;
  unspecified outputs take their current values; the inverse runs once on the
  vector. This reproduces the current core's workspace merge.
- **Point groups, no second pass** (ADR 0006, revised after the first
  build). A whole-shape drag requests the shape's points together as one
  point group; an inverse that moves several points produces one. The
  request engine asks what each point would actually become (lookahead:
  inversion on a scratch copy, forward evaluation, nothing written) and, if a
  strict subset is held back by the same shift, shifts the rest. A free line
  or polygon has no instruction of its own, so a vertex defined from its
  siblings is not a cycle. A `rigid` polygon keeps one identity instruction
  whose inverse projects onto a rigid motion or similarity, because the
  document asked for the coupling. The first build put the rule inside a
  per-shape instruction; that made self-referencing shapes cycles, and
  Charles asked that the interaction behavior not limit what documents can
  say.
- **Equation lowering.** A linear equation with numeric or cell-valued
  coefficients lowers to three coefficient cells at build time, with the
  current core's orientation normalization; the equation state variable is
  rendered from them. An equation the build cannot lower yields a NaN line.
- **Slope-defined line.** Keeps an essential distance cell (default 1) for
  the second point, so asserted coordinates match.
- **Circle angles** are recomputed from current cells at inversion time, not
  saved by the forward pass.

## Order of work

1. vitest adapter against the existing components, so the gap list exists.
2. Circle: nine cases, fan-out, `Circumcenter`, shape-preserving center drag.
3. Line: equation lowering, slope and direction modes, line segment.
4. `constrainToGrid` with lookahead; `constrainTo` line or circle if cheap.
5. Rigid polygon.
6. Write-up in `results/NOTES.md`, operator table, one 10k-circle sanity run.

## Deliverables

`docs/history/plan-3.md` (this file), ADR 0006, glossary terms, the adapter on the
fork branch, minimal SVG renderers with drag for line, circle and polygon, a
verdict section in `results/NOTES.md` answering both sub-questions with a
table classifying every current-core inverse branch as dissolved at build
time, a local inverse, or needing lookahead. No new performance fixtures
beyond the sanity run.
