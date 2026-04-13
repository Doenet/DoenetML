# PreFigure Auto-Sliders Feature: Implementation Status & Handoff

## Overview

This document summarizes Phase 1 of the PreFigure auto-sliders feature: the proof-of-concept for draggable points. It includes what has been implemented, what's been tested, and what remains to complete the feature for full release.

**Status**: MVP complete for points. Ready for review and integration. Future phases for other components and advanced options planned.

---

## What Has Been Implemented (Phase 1)

### 1. Graph-Level Control

**File**: `packages/doenetml-worker-javascript/src/components/Graph.js`

- **`addSliders` state variable**: Boolean that gates slider rendering
- **`draggablePointsForSliders` state variable**: Computed list of eligible draggable points
  - Filters for: `draggable=true`, `fixed=false`, `fixLocation=false`, `addSliders != "none"`
  - Returns array of objects with: `componentIdx`, `pointNumber`, `{x,y}` coordinates, `label`, `labelHasLatex`, display rounding properties (`displayDigits`, `displayDecimals`, `displaySmallAsZero`, `padZeros`), and per-point `addSliders` string

### 2. Per-Point Control

**File**: `packages/doenetml-worker-javascript/src/components/Point.js`

- **`addSliders` attribute**: Text, `toLowerCase: true`, default `"both"`
  - Valid values: `"none"`, `"both"`, `"xOnly"`, `"yOnly"`
  - `valueForTrue: "both"`, `valueForFalse: "none"` (for `addSliders="false"`)
  - **Important**: `validValues` are declared camelCase for autocomplete, but `toLowerCase: true` ensures runtime storage is lowercase. The `preprocessAttributesObject()` utility lowercases all property names and values, so comparisons in code must use lowercase strings: `"xonly"`, `"yonly"`, `"none"`, `"both"`.

### 3. React Renderer

**Files**:
- `packages/doenetml/src/Viewer/renderers/prefigure.tsx`: Main slider UI integration
- `packages/doenetml/src/Viewer/renderers/utils/SliderUI.tsx`: Reusable `<input type="range" />` component with transient/final state distinction

**Features**:
- Renders up to 2 sliders per eligible draggable point (x-only, y-only, or both)
- Respects per-point `addSliders` setting
- Label text shows rounded coordinate values matching point display rules
- Handles transient (during-drag) vs. final (mouseup) state
- Snap-back behavior: constrained points (e.g., `<constrainToGrid />`) snap to their valid coordinate on mouseup
- Full rounding support: `displayDigits`, `displayDecimals`, `displaySmallAsZero`, `padZeros`

### 4. Slider Callout Wiring

**File**: `packages/doenetml/src/Viewer/renderers/graph.tsx`

- `callAction` prop now passed to `Prefigure` component
- Allows sliders to dispatch `movePoint` actions directly to point components

### 5. Display Rounding

**Function**: `roundForDisplay()` in `packages/utils/src/math/math.ts`

- Applies `displayDigits`, `displayDecimals`, `displaySmallAsZero` via math-expressions library
- Used in `formatCoordinateForSlider()` to ensure slider labels match coordinate display in `<number>` components
- Also respects the point's `padZeros` setting if present (pads with trailing zeros to match decimal/digit count)

### 6. Schema & Autocomplete

**Files**: `packages/static-assets/src/generated/{doenet-relaxng-schema.json, doenet-schema.json}`

- Schema regenerated to include `addSliders` attribute on `<point>`
- Autocomplete offers camelCase values for user convenience

### 7. Tests

**File**: `packages/test-cypress/cypress/e2e/prefigure/prefigureSliders.cy.js`

11 passing Cypress tests covering:
1. Basic slider rendering and unconstrained point movement
2. Snap-back behavior for constrained points
3. Filtering of fixed/non-draggable points
4. Stable numbering when draggability changes
5. Display rounding consistency with `<number>` display
6. Padding zeros with `padZeros` attribute
7. `addSliders="none"` suppression
8. `addSliders="xOnly"` (x-slider only)
9. `addSliders="yOnly"` (y-slider only)
10. Default `addSliders="both"` when graph has `addSliders`
11. `addSliders="false"` equivalent to `"none"`

---

## Key Design Decisions

### 1. Slider Precision (Step Size)

Step size is currently fixed at `1/100th` of the graph range (e.g., xStep = (xMax - xMin) / 100). No user-configurable precision attribute. Could be improved in future iterations based on UX feedback.

### 2. Serialization of `addSliders` Values

- Source code declares `validValues: ["none", "both", "xOnly", "yOnly"]` in camelCase for autocomplete
- The `preprocessAttributesObject()` utility automatically lowercases all `validValues` entries when `toLowerCase: true` is set
- Runtime storage is always lowercase: `"none"`, `"both"`, `"xonly"`, `"yonly"`
- All code comparisons (notably in prefigure.tsx renderer) use lowercase strings
- User-written XML always accepts camelCase (e.g., `addSliders="xOnly"`) because the attribute parser ensures case-insensitive matching

### 3. Slider Behavior

- **Transient vs. Final**: Slider input events are transient (painted live); mouseup/touchend events are final (snapshot to core)
- **Constrained Points**: Points with constraints (e.g., `<constrainToGrid />`) snap back to their valid value on mouseup
- **Graph-Level Gate**: If `<graph addSliders>` is absent or `false`, no sliders render regardless of per-point settings

### 4. Display Rounding in Slider Labels

Slider labels use the same `roundForDisplay()` function as `<number>` components. This ensures consistency. The `padZeros` option pads with trailing zeros to the specified decimal or digit count, matching typical number formatting behavior.

---

## Remaining Work for Full Release

### Phase 2A: Other Components (Required for MVE)

**Objective**: Extend auto-sliders to other draggable graphical objects

**Note**: This requires careful design per-component because different shapes have different degrees of freedom.

- **Circle**: Sliders for `{center.x, center.y, radius}` (3 DOF). Consider `addSliders` options:
  - `"center"` (x, y sliders)
  - `"radius"` (radius slider)
  - `"both"` (all three)
  - `"none"` (no sliders)
  
- **Line/Segment**: Depends on anchoring model:
  - If anchored to two endpoints: `addSliders` could control `{point1.{x,y}, point2.{x,y}, ...}` (4+ DOF)
  - If anchored to a point + angle + length: options might be `"position"`, `"angle"`, `"length"`, etc.
  - Requires discussion with maintainers on intended semantics

- **Rectangle/Polygon**: Similar complexity. Options might be `"vertices"`, `"center"`, `"width"`, `"height"`, etc.

**Approach**:
1. For each component type, define a sensible set of `addSliders` options
2. Add the attribute and default to each component
3. Update the corresponding renderer (e.g., `jsxgraph.tsx` or a new renderer)
4. Make sure sliders don't interfere with existing drag interactions
5. Add tests for each component type

### Phase 2B: User Configuration for Step Size

**Objective**: Allow authors to control slider step/precision

**Options to consider**:
- Graph-level `sliderStep` attribute (global precision for all sliders)
- Per-point `sliderStep` attribute (fine-grained control)
- Auto-derive from `displayDecimals` or `displayDigits` (simplest, data-driven)

### Phase 3: Advanced Features

- **Slider Placement**: Above/below the graph, inline, or in a sidebar
- **Slider Ranges**: Per-point overrides for slider min/max (not tied to graph bounds)
- **Cumulative Labels**: Multi-point scenarios where certain sliders are linked
- **Animations**: Play/pause controls to animate slider sequences
- **Keyboard Navigation**: Arrow keys to fine-tune coordinates (accessibility improvement)

---

## Testing Checklist

### Before Opening PR

- [x] All 11 Cypress tests pass (prefigureSliders.cy.js)
- [x] Schema regenerated (`npm run build:schema`)
- [x] Code formatted with Prettier
- [x] No `testCode.doenet` files committed
- [x] No untracked `.md` files in repo root committed

### For Code Review

**Focus areas**:
1. **Cascading Defaults**: Verify that defaults are applied consistently (Graph.js DVs, Point.js attribute defaults, prefigure.tsx fallbacks)
2. **Rounding Accuracy**: Run the display-rounding test and verify slider labels match `<number>` display
3. **Snapshot/Transient Logic**: Ensure constrained point snap-back is correct
4. **Accessibility**: Check ARIA labels, keyboard navigation (if supported), screen reader compatibility
5. **Performance**: Large graphs with many draggable points — ensure UI remains responsive
6. **Edge Cases**: Points with 2D constraints (e.g., on a curve), 3D points (should be silently dropped), missing attributes

### Future Test Coverage

- Add test for graph-level `addSliders=false` overriding per-point `addSliders`
- Performance test: 50+ draggable points with sliders
- Accessibility audit: keyboard-only interaction, screen reader comprehension

---

## File Structure Summary

```
packages/
├── doenetml-worker-javascript/
│   └── src/components/
│       ├── Graph.js           (addSliders SV, draggablePointsForSliders SV)
│       └── Point.js           (addSliders attribute)
├── doenetml/
│   └── src/Viewer/renderers/
│       ├── prefigure.tsx      (slider UI, label formatting, callAction wiring)
│       ├── graph.tsx          (callAction prop pass-through)
│       └── utils/
│           └── SliderUI.tsx   (range input component)
├── utils/
│   └── src/math/
│       └── math.ts            (roundForDisplay function)
├── test-cypress/
│   └── cypress/e2e/prefigure/
│       └── prefigureSliders.cy.js  (10 tests)
└── static-assets/src/generated/
    ├── doenet-relaxng-schema.json
    └── doenet-schema.json     (Point.addSliders added)
```

---

## For Future Agents: Getting Started

### Quick Orientation

1. **Understand the flow**:
   - `Point.js` defines `addSliders` attribute (camelCase values, lowercased at runtime)
   - `Graph.js` computes `draggablePointsForSliders` state variable (list of eligible points)
   - `prefigure.tsx` renders sliders based on that list
   - Slider changes call `movePoint` actions via `callAction`

2. **Familiarize with rounding**:
   - `roundForDisplay()` in `packages/utils/src/math/math.ts`
   - Takes `displayDigits`, `displayDecimals`, `displaySmallAsZero`
   - `padZeros` support via `.toString(params)` with `padToDecimals`/`padToDigits`

3. **Review tests**:
   - `prefigureSliders.cy.js` covers all Phase 1 scenarios
   - Good reference for expected behavior and edge cases

### Common Modifications

- **Changing slider step size**: Modify `const xStep = ...` in prefigure.tsx around line 760
- **Adding a Graph-level config**: Extend `Graph.js` with a new state variable, add to `draggablePointsForSliders` dependency
- **Adding a Point-level config**: Extend `Point.js` attribute, add to `Graph.js` variableNames list, use in prefigure.tsx
- **Adjusting label format**: Modify `formatCoordinateForSlider()` in prefigure.tsx
- **Component filtering logic**: Update the filter condition in Graph.js `draggablePointsForSliders` definition

### Debugging Tips

- **"My sliders don't appear"**: Check that `Graph.addSliders` is true AND `effectiveRenderer` is `"prefigure"` AND point passes filter (draggable, not fixed, not fixLocation)
- **"Labels show wrong values"**: Verify `displayDigits`, `displayDecimals`, `displaySmallAsZero` are passed to `formatCoordinateForSlider()`. Check `roundForDisplay()` return type.
- **"Snap-back doesn't work"**: Ensure `getCoreCoordinates()` returns non-null and `movePoint` is called with `transient: false`
- **"Autocomplete shows lowercase"**: Schema generation issue; re-run `npm run build:schema` to pick up latest attribute definitions

---

## Notes for Commit Message

```
Implement draggable-point sliders for PreFigure graphs (Phase 1)

- Add per-point addSliders attribute (none/both/xOnly/yOnly) to control which sliders render
- Add Graph-level draggablePointsForSliders state variable to identify eligible points
- Implement SliderUI component with transient/final state tracking
- Integrate sliders into prefigure.tsx with runnable snapshot behavior
- Support full display rounding (displayDigits, displayDecimals, displaySmallAsZero, padZeros)
- Add 11 Cypress tests covering all Phase 1 scenarios
- Regenerate schema for autocomplete support

Tested with constrained points, fixed points, multi-point graphs, rounding and padding configurations.
```

