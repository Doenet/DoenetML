# @doenet/doenetml

## 0.7.17

### Patch Changes

- 25c28ed: Every enumerated attribute value now ships with a description that flows into editor autocomplete and the context-help panel. The `ValidValueEntry` type requires `description`, and bare-string `validValues` entries are no longer accepted. Pure boolean primitives no longer render an "Allowed values" row in the help panel (autocomplete for `true`/`false` is unchanged).
- 87318b9: Support per-value descriptions on enumerated attribute values. Each entry of an attribute's `validValues` can now be declared as `{value, description}` instead of a bare string; the description flows through schema generation into editor autocomplete (as the completion item's documentation tooltip) and into the context-sensitive help panel (as a definition list under "Allowed values"). Both shapes remain accepted so components can migrate gradually. Schema and help surfaces preserve the casing the author wrote — `toLowerCase` continues to govern only runtime case-insensitive matching, not how values are displayed. Migrated `<video>` (`size`, `displayMode`, `horizontalAlign`), `<slider>` (`type`), `<answer>` (`simplifyOnCompare`), and `<award>` (`simplifyOnCompare`) as worked examples.
- c62a1b7: Open attribute-value autocomplete immediately after typing `=`. The completion menu now appears with the canonical quoted form in the dropdown (e.g. `"full"`) while still matching on the bare value — so typing `<math simplify=` and picking `"full"` produces `<math simplify="full"`. Typing a partial value right after `=` without a quote (e.g. `<math simplify=ful`) filters the menu and replaces the typed prefix with the fully quoted value on selection. When the author types `"` first, dropdown items display without surrounding quotes since they are already in the source. For free-text attributes that have no enumerated values (e.g. `name`), typing a bare prefix after `=` (e.g. `<aa name=foo`) now offers a single `"foo"` hint that wraps the typed value in quotes on acceptance — an expert who types `"` first sees no menu.
- 3ae54ac: Show schema descriptions in autocomplete. Component-type, attribute, and property completions now display the same component summaries and attribute/property descriptions used by the context-sensitive help panel. Bare `$name` ref completions show `(<type>, line N)` as detail (matching CodeMirror's gutter) and the referent's component summary as documentation, making it easy to disambiguate names that shadow each other. Alias-aware: a `<row>` inside `<matrix>` pulls its docs from the `matrixRow` aliased entry, mirroring the help panel.

    Schema description text now renders inline markdown in both surfaces. Authors writing `componentDocs.summary` or attribute/property descriptions can use `` `code` `` (e.g. `` `<answer>` ``), `*em*`, and `**strong**`; these render as `<code>`/`<em>`/`<strong>` in the autocomplete info popup and the help panel. Anything else is emitted as literal text. Component summaries that previously contained bare `<tag>` references have been updated to use backtick-quoted form for proper rendering.

- ac1ab81: Extend the editor's context-sensitive help panel to cover ref names. When the cursor is on a bare `$name` or on the segment of a member ref that resolves to a named child element (e.g. `$sec.bi` where `<section name="sec"><booleanInput name="bi"/></section>`), the panel now shows a sentence-form line — `$sec.bi references <booleanInput> on line 1.` — followed by the target component's summary and a link to its reference page. Descendants take precedence over same-named properties, matching runtime ref-resolution rules. AST-only resolution: repeat-introduced names (`valueName`/`indexName`) and multi-part chains beyond two segments still need the Rust resolver and remain tracked in #1086.
- d32a6da: Add a context-sensitive help tab to the editor's diagnostics panel. When the cursor is on a component, attribute, or `$ref.property`, the panel shows the relevant description and a link to the corresponding `/reference/<slug>` docs page. Components can override the slug via `componentDocs.docsSlug` (or set it to `null` to suppress the link), and parents can redirect sugar-rewritten children via `componentDocs.childAliases` so e.g. `<row>` inside `<matrix>` shows `<matrixRow>`'s help. Adds a new `docsURL` prop on `DoenetEditor` (default `https://docs.doenet.org`) so embedding apps can point at staging or local docs builds.
- cddfe34: `diagnosticsSummaryCallback` on `DoenetEditor` and `setDiagnosticsCallback` on `DoenetViewer` now receive a second argument, `doenetML`, containing the source string the viewer was rendering when those diagnostics were produced. Consumers can use this to correlate diagnostics with the document version that triggered them rather than the (potentially newer) editor buffer. Existing single-argument consumers remain valid — passing a callback with fewer parameters than the declared signature is still allowed by TypeScript.
- 44ec6cc: Fix `diagnosticsSummaryCallback` in `DoenetEditor` to fire once per diagnostics update, including when the counts are unchanged. Previously the effect was keyed off a memoized counts object, so a viewer re-run that produced the same counts would silently skip the callback. Inline callbacks are now tracked through a ref so they don't refire the effect on every parent render, and `initialDiagnostics` defaults to a stable reference so unrelated parent re-renders don't refire downstream memos and effects.
- 9650a0f: Replace `isAccessibleCallback` with `diagnosticsSummaryCallback` in `DoenetEditor`. The new callback receives an object with counts for `warningsCount`, `errorsCount`, `infosCount`, `accessibilityLevel1Count`, and `accessibilityLevel2Count` instead of a single boolean. The callback is only invoked after diagnostics have been received from the viewer.
- d3c3e43: Add programmatic control of the `<DoenetEditor>` diagnostics/responses panel:
    - New `initialOpenTab` prop opens the panel on the given tab when the editor mounts. Valid IDs: `"errors" | "warnings" | "info" | "accessibility" | "responses"`.
    - `<DoenetEditor>` now accepts a `ref` exposing a `DoenetEditorHandle` with `openDiagnosticsTab(tabId)` and `closeDiagnosticsPanel()` for runtime control.
    - The iframe wrapper (`@doenet/doenetml-iframe`) supports the same prop and ref handle, with calls made before the iframe finishes loading queued and replayed on ready.

- 0f7357d: Exclude properties derived from `excludeFromSchema` attributes. When an attribute is marked `excludeFromSchema: true` and creates a companion state variable via `createStateVariable`, that state variable is now also excluded from the schema. This stops `collaborateGroups`, `modifyIndirectly`, and `permid` from leaking into autocomplete and context-help despite their backing attributes already being hidden. Tracked in #1089.
- feae758: Improve list-item first-child alignment for section/task/problem-style numbering when content starts with block renderers.

    This update standardizes list-item alignment signals across block components, updates section and sideBySide rendering to top-align numbering with block-first content, and adds Cypress coverage for the new behavior (including answer and choiceInput cases).

- f20f4d0: `DoenetEditorHandle` (the imperative ref handle on `<DoenetEditor>`) now exposes `updateRenderedView()`, the programmatic equivalent of clicking the editor's "Update" button. Consumers can call it before reading diagnostics to flush any pending edits from the editor buffer to the viewer, ensuring the next `diagnosticsSummaryCallback` reflects the current source rather than stale state. The method is a no-op when there is nothing to update (matching the visually-disabled button), and warns when invoked with `showViewer={false}`. The new method is plumbed through `@doenet/standalone`'s `renderDoenetEditorToContainer` handle and across the `@doenet/doenetml-iframe` ComLink boundary, including the same queue-and-replay treatment used for the existing `openDiagnosticsTab` / `closeDiagnosticsPanel` methods.
- 79c7d37: Stabilize `<DoenetEditor>` callback identity. The `doenetmlChangeCallback`, `immediateDoenetmlChangeCallback`, and `documentStructureCallback` props are now routed through ref mirrors, so the editor's internal `useCallback` hooks (and the imperative handle exposed via `ref`) no longer churn when consumers pass inline arrow functions. Also fixes a stale-closure bug where the unmount cleanup could fire the original `doenetmlChangeCallback` instead of the latest one.
- c2248b4: Fix `<video>` with a YouTube source so the player reloads correctly when the YouTube id changes (for example when `youtube` is bound to a `choiceInput` or any reactive value), and so the player initializes once the YouTube IFrame API finishes loading. Previously the new video silently failed to load and stale internal timers could throw against the destroyed player.

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
