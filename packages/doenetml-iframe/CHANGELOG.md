# @doenet/doenetml

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
