# PreFigure Conversion Utilities

This folder contains graph-to-PreFigure conversion logic extracted from `Graph` for maintainability and growth.

## Organization

- `common.js`
  - Shared low-level helpers: XML escaping, numeric/point formatting, handle generation, stable sorting.
- `label.js`
  - Label rendering concerns: plain text vs latex, `\(...\)` delimiter replacement, point label alignment mapping.
- `style.js`
  - Style translation from Doenet selected styles to PreFigure attributes.
- `components/`
  - Component-specific geometry converters (point, line-like, vector, circle, polygon/polyline).
- `descendant.js`
  - Dispatcher that routes each graphical descendant to the correct component converter and normalizes warning behavior.
- `graph.js`
  - Graph-level XML assembly: dimensions, bbox, axes mode, axis labels, and aggregation of converted descendants.
- `stateVariable.js`
  - `returnGraphPrefigureXMLStateVariableDefinition()` to keep state variable wiring out of `Graph.js`.

## Extension Workflow (Adding a New Component)

1. Add a converter in `components/<component>.js`
   - Keep it geometry-focused and pure.
   - Return `null` for invalid/incomplete geometry.
2. Register it in `descendant.js`
   - Route by `descendant.componentType`.
   - Reuse centralized warning behavior for unsupported or invalid elements.
3. Update dependencies in `stateVariable.js`
   - Add a new `*Descendants` dependency with required `variableNames`.
  - If a variable is only present on some inherited subtypes, set `variablesOptional: true` on that dependency config.
   - Include it in the merged `descendants` array.
4. Add/adjust tests in `src/test/tagSpecific/graph-prefigure.test.ts`
   - Cover happy path XML shape.
   - Cover warning cases if style/geometry fallbacks are expected.

## Design Principles

- **Single responsibility**: geometry conversion lives in component files; cross-cutting concerns live in shared modules.
- **Pure transformations**: conversion helpers should be deterministic and side-effect free, except appending warnings passed by caller.
- **Centralized warnings**: keep warning text and behavior consistent via shared dispatch/build layers.
- **Stable output ordering**: sort descendants by component index/name before conversion for reproducible XML.
- **Inheritance-aware dedupe**: descendant queries can match inherited component types (for example, a `polygon` can also match `polyline`; an `endpoint` can also match `point`). Always dedupe configured descendants by `componentIdx` before conversion.
- **Specific-over-generic precedence**: dedupe keeps the last match seen for a given `componentIdx`. Order `GRAPHICAL_DESCENDANT_CONFIGS` from generic to specific when overlap exists, so specific configs override generic matches.
- **Behavior preservation first**: refactors should keep generated XML and warning semantics unchanged unless a behavior change is intentional and tested.

## Inheritance and Dedupe Details

Doenet descendant dependencies include inherited component matches. This means a single concrete component can appear in multiple configured descendant lists.

Example overlaps:

- `polygon`-family (`polygon`, `triangle`, `rectangle`) may also appear in `polyline` matches.
- `endpoint` / `equilibriumPoint` may also appear in `point` matches.

To avoid duplicate XML output:

1. Build the combined configured descendant list in config order.
2. Deduplicate by `componentIdx`.
3. Keep the last match for each `componentIdx` (so later configs win).

Why `variablesOptional` matters:

- Some base-type configs intentionally include subtype-only variables (for example `point` requesting `open` so endpoint-like points can render unfilled).
- `variablesOptional: true` allows that dependency to resolve even when the variable does not exist on the base component.

Regression tests in `graph-prefigure.test.ts` include a guard that fails when dedupe is removed and polygon-family shapes are duplicated.

## Testing Guidance

- Prefer focused tests in `graph-prefigure.test.ts` for conversion behavior.
- Validate both:
  - emitted XML fragments, and
  - warning presence/wording when applicable.
- Run:
  - `npm run test -- --run src/test/tagSpecific/graph-prefigure.test.ts`
