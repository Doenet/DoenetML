# @doenet/doenetml

## 0.7.16

### Patch Changes

- bbd2c4f: Fix `sort` and `shuffle` sugar handling when type information is missing or invalid, and improve diagnostics for mixed string/component children.
    - Fall back to `math` (with warning diagnostics) when `type` is invalid.
    - When `type` is omitted, do not apply sugar; instead, if a string child exists, emit warnings telling authors to specify a `type` attribute.
    - Ignore string children in mixed-content cases with explicit warning diagnostics.
    - Add test coverage for the fallback and diagnostics behavior.

- 84e3472: Introduce a new `avoidScientificNotation` number-display attribute and ensure
  number-display settings are applied consistently across worker and viewer
  rendering.
    - Add `avoidScientificNotation` support to core number/math formatting behavior in the worker.
    - Apply number-display parameters consistently through related formatted outputs (including line/function/point/vector/angle/piecewise/ODE displays).
    - Wire number-display formatting through graph controls worker payloads and viewer parsing/model logic so display settings are respected end-to-end.
    - Update generated schema output so inherited number-display attributes are available consistently.
    - Add worker and viewer test coverage for the new/updated display behavior.

## 0.7.15

### Patch Changes

- 2c02091: Generalize point slider controls into an `addControls` feature with graph-level modes. Replace the boolean `addSliders` attribute with `addControls` text attribute supporting `all`, `slidersOnly`, `inputsOnly`, and `none`. Rename the per-point `addSliders` attribute to `addControls` while preserving point-level options (`both`, `xOnly`, `yOnly`, `none`).

    New capabilities in `all` mode: sliders are paired with editable inline axis inputs in their labels, allowing users to both drag and type to adjust coordinates.

    New `inputsOnly` mode: pure text input controls where users can enter single values or ordered pairs, validated as math expressions before committing.

    Authors can now choose the control interaction style that best fits their pedagogical goals: traditional sliders, text input boxes, or a hybrid combining both.

- 3efdb48: Fix a graph controls regression that affected consecutive regularPolygon center moves. Dependency change flags are now preserved during inverse-definition argument construction and then consumed afterward to prevent stale flags from affecting follow-up center moves and restore-state flows.
- 6589ddc: Add graph controls for circles, line segments, and vectors. When `addControls` is enabled on a `<graph>`, circles expose controls for center and radius, line segments expose controls for their two endpoints, and vectors expose controls for their tail and displacement (or head).
- 4bfe856: Add collapsible graph control cards to reduce long scrolling in control-heavy graphs. By default, the first two controls are expanded and remaining controls are collapsed, with consistent behavior across default and prefigure renderers. Each card now has an accessible disclosure button with keyboard support and ARIA semantics.
- be4ff47: Improve graph controls ordering across control types. Controls now follow descendant order by default (instead of rendering grouped by type), and graphical controls support a new `controlOrder` attribute to request an earlier or later position in the controls list. `controlOrder` uses 1-indexed slot semantics: the renderer fills slots 1, 2, 3, ... with the lowest matching control order in each slot, uses `controlOrder=0` controls to fill gaps between positive orders, then places remaining higher orders at the end. A value of `0` (default) has no fixed position; such controls are grouped for gap-filling and do not preserve authored order relative to controls with positive `controlOrder` values.
- 86b0356: Make graph point controls renderer-agnostic by moving controls UI/logic out of the Prefigure renderer into `GraphControls`.

    Controls now appear consistently regardless of graph renderer selection, while preserving `addControls` graph/point mode behavior (`all`, `slidersOnly`, `inputsOnly`, `none`; and `both`, `xOnly`, `yOnly`, `none`).

    This also removes duplicated controls code from `prefigure.tsx` and keeps Prefigure focused on prefigure runtime/render concerns.

- 8ab58a5: Add graph controls for polygons, triangles, regular polygons, and rectangles. When `addControls` is enabled on a `<graph>`, polygons and triangles can expose center controls, regular polygons can expose center and radius controls, and rectangles can expose center, width, and height controls based on their `addControls` mode and draggable settings.
- 0d7e316: Add center state-variable support for polylines, polygons and triangles in the worker layer.
    - Polyline now exposes a public renderer-facing center location computed from the average of vertex coordinates, with symbolic math support for derived polygon and triangle components.
    - Polyline now supports a semantic center-move action that polygon center movement delegates to through the shared base implementation.
    - Triangle now supports moveTriangleCenter by delegating to the shared polygon/polyline center movement behavior.
    - Add targeted worker tests covering polygon center computation, symbolic center behavior, center-driven translation, constrained center-driven translation, and triangle center movement.

- ae3d871: Fix PreFigure curve rendering for implicit-multiplication expressions. Functions like `(x-2)(x-5)` or `3x` now render correctly in the PreFigure renderer; previously these produced invalid formula strings that the PreFigure parser dropped silently.
- 665f4b1: Add `sliderPosition` support for PreFigure point sliders. Authors can now place sliders on the `left`, `right`, `top`, or `bottom` of the graph, with `left` as the default. Side placements responsively fall back to `top` or `bottom` on narrow layouts, and keyboard focus now lands on the graph itself before the sliders so PreFigure annotations remain accessible.
- f506092: Suppress implicit PreFigure accessibility annotations when authors do not provide an `<annotations>` block. We now emit an empty `<annotations>` container in generated PreFigure XML and only initialize `diagcess` when authored annotations are present, preventing unintended auto-generated annotation text from appearing.
- 9bfb8c3: Fix responsive styling of input boxes in graph controls. Input boxes now properly shrink to fit available space when the screen width decreases, both for `addControls="all"` and `addControls="inputsOnly"` modes, including scalar controls and point controls.

## 0.7.14

### Patch Changes

- 6efb167: Add a dynamic `annotations-skeleton` autocomplete snippet for prefigure graphs.

    When authoring inside a `<graph renderer="prefigure">`, autocomplete now offers `annotations-skeleton`, which inserts an `<annotations>` tree derived from authored graphical descendants. The generated author-facing annotation text now covers supported prefigure graphical component types (including authored `<function>`), uses explicit coordinate labels where appropriate for accessibility, and includes guidance when a referenced graphical component is unnamed.

    This change also aligns Ray coordinate aliases with generated annotation references by supporting `.endpoint.x/.y/.z` and `.through.x/.y/.z` access patterns in core state variables.

- a0f76aa: Fix PreFigure annotation refs that target functions in graphs. An annotation like `<annotation ref="$f" />` now resolves when `f` is a `<function>` rendered via an adapted `<curve>`, while preserving existing behavior and warnings for invalid or out-of-graph refs.
- 0c67635: Add initial PreFigure rendering support for `<curve>` elements.

    It adds conversion for function, parameterized, and bezier curves, and includes support for piecewise and interpolated function definitions (including piecewise children that are interpolated). It also adds diagnostics for unsupported curve definitions.

- fd1f9ec: Update the default PreFigure runtime pins used by the viewer.

    The published Doenet packages now default to `@doenet/prefigure@0.5.15` and
    `diagcess@1.4.1` for PreFigure rendering, aligning the built-in CDN defaults
    with the latest synchronized PreFigure runtime update.

- 552d4b3: Fix LSP schema validation and autocomplete for enum attributes that also support boolean aliases.

    Attributes like `simplify`, `simplifyOnCompare`, `addSliders`, and `sort` now accept presence form and explicit `"true"`/`"false"` without warnings, while autocomplete continues to prioritize the author-facing enum values.

- 7436aa7: Add Phase 1 PreFigure point sliders with graph- and point-level control.

    When using `<graph renderer="prefigure" addSliders>`, draggable points can now render coordinate sliders below the graph. Authors can control slider behavior per point with a new `<point addSliders="none|both|xOnly|yOnly">` attribute (default `both`). Slider labels follow point display rounding settings, including padded zero formatting, and constrained points snap to valid values on release.

- 90204e9: Fix PreFigure renderer so local WASM readiness cancels slow or failed service fallback.

    When the local WASM runtime is not yet warm, the renderer previously committed exclusively to the remote build service. Two flaws resulted: if the service failed the diagram was never rendered, and if WASM became ready during a slow service call the renderer still waited for the network round-trip.

    Both issues are resolved by racing the service request and the local warmup in parallel. When the WASM runtime becomes ready first, the in-flight service request is aborted and the diagram is compiled locally. When the service responds first its result is used immediately (existing behavior). If the service fails but warmup later succeeds, the diagram is still rendered locally instead of showing an error.

- f4ff6fd: Replace `sortResults` boolean attribute with `sort` text attribute for `selectFromSequence` and `selectPrimeNumbers` components. The new `sort` attribute accepts three values: "unsorted", "increasing", and "decreasing". Backward compatibility is maintained through deprecation shims that automatically convert `sort="true"` to `sort="increasing"` and `sort="false"` to `sort="unsorted"`.

## 0.7.13

### Patch Changes

- 75725e5: Improve DoenetML editor autocomplete for references.

    The editor now suggests in-scope names after `$`, offers descendant names and
    properties after `.` on references, and handles completion reopening more
    reliably while typing, deleting, and accepting completions.

- 66d0ddb: Add isAccessibleCallback feature to EditorViewer
- e604d76: expose schemaSubarrays-derived properties in generated Doenet schema to improve documentation
- 544c619: Add graph attributes to control axis tick visibility.

    Graphs now support `displayXAxisTicks` and `displayYAxisTicks`. Tick labels inherit from the corresponding tick visibility setting unless `displayXAxisTickLabels` or `displayYAxisTickLabels` is explicitly specified.

- b380ebc: Improve reference autocomplete behavior by wiring Rust-backed resolver logic and fixing completion visibility/index handling.

    This includes better scope filtering for names, indexed reference completions for takesIndex components, and repeat synthetic name support in autocomplete flows.

- 9ad3a40: Change `<selectPrimeNumbers>` and `<samplePrimeNumbers>` attributes from `minValue`/`maxValue` to `from`/`to`, and add deprecation shims for the old attributes.
- ec9b81f: connect external labels to inputs and answers with `for` attributes

## 0.7.12

### Patch Changes

- 3834b7f: Add DoenetML graph annotation support for PreFigure-rendered graphs.

    This adds conversion of nested graph annotations to PreFigure XML and improves related diagnostics and annotation handling.
