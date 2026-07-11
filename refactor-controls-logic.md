# Plan: Refactor Controls Logic

## TL;DR
Consolidate 8 separate `draggableXForControls` state variables (~800 lines in Graph.js) into:
1. A single state variable `graphicalDescendantsForControls` that returns a flat, document-ordered array of typed control payloads using `variablesOptional`.
2. A per-type static config map that captures what variables to request and how to build each payload — replacing repetitive boilerplate.

Renderer changes are mostly search-and-replace. Worker changes are moderate but well-contained.

---

## Relevant Files

- `packages/doenetml-worker-javascript/src/components/Graph.js` — L21-108 (helpers), L656-670 (graphicalDescendants), L674-1520 (8 state variables to replace). NEW: single state variable + static config map.
- `packages/doenetml/src/Viewer/renderers/graph.tsx` — L100-163: 8 boolean checks → 1 check.
- `packages/doenetml/src/Viewer/renderers/graphControls/GraphControlsRoot.tsx` — props type, family dispatch order.
- `packages/doenetml/src/Viewer/renderers/graphControls/model.ts` — Union type for discriminated control items.
- `packages/doenetml/src/Viewer/renderers/graphControls/families/*.tsx` — 8 family components: swap filtered typed arrays for filtered unified array.

---

## Steps

### Phase 1: Worker (Graph.js)
1. Define static per-type config array (ordered, not a plain keyed object). Each entry: `{ componentType: string, variableNames: string[], buildPayload(stateValues, componentIdx, n) → payload | null }`.
   - **Order matters**: most-specific types first — triangle, rectangle, regularPolygon before polygon. When matching a descendant to a config entry, use `componentInfoObjects.isInheritedComponentType` — the loop picks the **first** matching entry. A triangle matches the triangle entry before it can match the polygon entry, eliminating the `componentType === "polygon"` guard entirely.
   - Helper functions `resolveCompositeControlsMode`, `extractControlDisplaySettings`, `hasValid2DNumericalVertices` are still used, called from `buildPayload` closures.
2. Add a single `graphicalDescendantsForControls` state variable:
   - `dependencyType: "descendant"` with all 8 componentTypes listed.
   - `variablesOptional: true` with the union of all variables any type needs.
   - Definition receives `componentInfoObjects`; iterates descendants in document order; for each, walks the config array and calls `isInheritedComponentType` to find the first match; calls `buildPayload`; pushes non-null result (with `controlType` discriminator) onto the flat result array.
3. Keep the 8 old state variables temporarily if needed for backward compatibility, or remove them entirely if no other consumers exist.

### Phase 2: Model types (model.ts)
4. Add a `controlType` discriminator field to each existing `GraphControlX` type.
5. Export a `GraphControlItem` union type: `GraphControlPoint | GraphControlCircle | ... | GraphControlVector`.

### Phase 3: Renderer (graph.tsx + GraphControlsRoot.tsx)
6. In `graph.tsx`: replace 8 boolean checks with a single `Array.isArray(SVs.graphicalDescendantsForControls) && SVs.graphicalDescendantsForControls.length > 0`.
7. In `GraphControlsRoot.tsx`: replace 8 typed array props with `graphicalDescendantsForControls: GraphControlItem[]`. Family components still receive SVs (no change to call sites), but the type reflects the new shape.

### Phase 4: Family components
8. In each family component, replace `SVs.draggableXForControls` with `(SVs.graphicalDescendantsForControls ?? []).filter((item): item is GraphControlX => item.controlType === "x")`. Order of render within each family is unchanged. The flat array preserves document order, but the current renderer still groups output by family until a follow-up PR finalizes cross-type ordering.
9. Keep the existing family render sequence in GraphControlsRoot for now, and document clearly that it is a temporary grouping order. A follow-up PR can replace this with a single dispatch loop to achieve true cross-type document order.

### Phase 5: Cleanup
10. Remove the 8 old `draggableXForControls` state variables from Graph.js.
11. Remove helper imports/usages that are now inlined in the config map.

---

## Verification
1. Run existing Cypress tests for graph controls (packages/test-cypress).
2. Manually test current ordering behavior: create a DoenetML with interleaved component types (e.g., point, vector, point) and verify the unified payload stays in source order while the renderer still groups controls by family until the follow-up PR lands.
3. Check polygon+triangle+rectangle deduplication still works correctly.
4. Confirm `variablesOptional` handles requests for type-specific variables (e.g., `headDraggable`) on types that don't have them (e.g., point) without errors.

---

## Decisions / Scope
- **Included**: Worker consolidation, model types, renderer + family adaptations, polygon inheritance fix, and explicit documentation that renderer ordering is still temporary.
- **Excluded**: Actual author-controlled reordering UI (just fix automatic document order for now).
- **Excluded**: Adding new component types beyond the existing 8 (that's a follow-on task enabled by this refactor).

---

## Further Considerations
1. **True cross-type document ordering**: Families still render in a temporary hard-coded type order (Points → Circles → ...) even after this change. This is intentionally deferred to a follow-up PR. To get truly interleaved rendering order, GraphControlsRoot would need a single dispatch loop.
2. **Backward compatibility**: If anything outside Graph.js reads the old SVs (e.g., tests, external consumers), those references must be updated when removing old variables.
3. **variablesOptional scope**: The union of all 8 types' variable names may be large; verify it doesn't cause perf issues vs. the current per-type queries.
