## v0.7.10

## 0.7.22

### Patch Changes

- 97d65a5: Editor: Add bidirectional click-to-navigate between the source editor and the rendered preview.

    Clicking a rendered element now moves the editor's cursor to (and reveals/centers) its source location, and moving the editor's cursor scrolls the preview to follow, debounced so it doesn't fight active typing. Works in both the VS Code extension's preview panel and `DoenetEditor`'s built-in CodeMirror editor. Clicks on a graph navigate to the `<graph>` source, clicks on the graphical elements inside it (point, vector, line, ray, lineSegment, circle, polygon, polyline) navigate to the element's own source, and drag releases don't navigate.

    Implementation notes: the core now includes each component's source `position` in its renderer instructions; `DocViewer` maintains an id-to-position map from that stream to power a delegated capture-phase click handler and a `scrollToSourceOffset` prop; the line-family renderers report clicks on their JSXGraph elements through a `DocContext` callback at the same click-vs-drag disambiguation point that powers `triggerWhenObjectsClicked`. Content brought in by a copy (e.g. `$g` or `<graph extend="$g">`) navigates to the copy the author wrote where it renders, not to the copied component's original definition.

    Also fixes `@doenet/codemirror`'s library build, whose Vite config pointed `lib.entry` at `CodeMirror.tsx` instead of `index.ts` — silently dropping any runtime (non-type-only) export added to `index.ts` from the built bundle that `@doenet/doenetml` consumes.

- c205608: Editor: fix the code editor's text-selection highlight so highlighted (selected) text stays legible, especially in dark mode.

    The selection highlight was rendering with CodeMirror's built-in light lavender (`#d7d4f0`) in every mode: the theme's own selection rule never took effect (CodeMirror's base theme targets the selection with a higher-specificity selector), and the editor was never told it was in dark mode, so it also fell back to CodeMirror's light-mode defaults. On the dark canvas the near-white and brightly-colored syntax tokens were then washed out under the pale highlight — and clicking away from the editor made it worse, reverting the blurred selection to the base light-gray default.

    The dark-mode selection is now a dark navy (`#092c4d`) that keeps every syntax token — down to the dim comment gray — at WCAG AA contrast (≥ 4.5:1) while still reading as a selection, and light mode now correctly uses its intended neutral gray. The override matches CodeMirror's base-theme selector for both the focused and blurred states, and the theme now passes the real brightness to CodeMirror so its base defaults align.

    The light-mode comment color is also darkened slightly (`#656d76` → `#5c636d`) so highlighted comments clear WCAG AA against the light selection background too (they previously sat at ~4.1:1); it remains above AA on the white canvas.

    Adds `@doenet/codemirror` Cypress component tests (`selectionAccessibility.cy.tsx`) that select highlighted code and assert the WCAG contrast between each rendered token color and the actual selection-background color, in light mode, dark mode, and after the editor is blurred. (`cy.checkA11y` can't be used for this: axe-core cannot resolve CodeMirror's separate selection layer / `::selection` pseudo-element and instead compares tokens against a phantom white background.)

- 07b1f24: Graphing: add new ways to define a `<lineSegment>` via `slope`, `length`, `midpoint`, and `midpointOffset` attributes, plus a public `midpoint` property giving its actual midpoint.

    A `<lineSegment>` can now be positioned without giving both endpoints explicitly:

    - `midpoint` (attribute) — a reference point on the segment, located at its midpoint by default.
    - `slope` and `length` — the segment's x-y direction and its signed defining length (a negative `length` flips the endpoints). The public `length` state variable still reports the Euclidean distance between the endpoints.
    - `midpointOffset` (clamped to `[-1, 1]`) — where the `midpoint` point sits along the segment: `-1` = first endpoint, `0` = midpoint, `1` = second endpoint.
    - `midpoint` (property) — a public state variable giving the segment's actual midpoint (the average of its endpoints), with `midpoint.x`/`midpoint.y` access and a translation inverse. It equals the `midpoint` attribute point when `midpointOffset` is `0` and differs from it when `midpointOffset` is nonzero.

    These combine so a segment can be defined by an endpoint plus `midpoint`, an endpoint plus `slope`/`length`, `midpoint` plus `slope`/`length`, or `slope`/`length` alone. When one endpoint and `midpoint` are given, the second endpoint is placed so the given point sits at the `midpointOffset` position of the segment — by default the midpoint, so `endpoints="(1,2)" midpoint="(2,3)"` yields endpoints `(1,2)` and `(3,4)`. Dragging a graph handle keeps the opposite endpoint fixed while the midpoint tracks its position, and dragging a referenced endpoint translates the segment (for the slope/length cases). When none of the new attributes are given, behavior is unchanged. The generated schema recognizes the new attributes in editor diagnostics.

    Closes #1376.

- 59a0ded: VS Code extension: Keep the preview window's scroll position when the source is refreshed.

    Previously, every refresh of the preview (saving the document, pressing Force
    Refresh, or switching editors) rebuilt the rendered activity and reset the
    preview's scroll position to the top. The preview now records its scroll
    position when new source arrives and re-applies it while the viewer re-renders,
    clamped to the content height (so a shorter document lands at its bottom rather
    than jumping to the top). Restoration stops as soon as the user scrolls or
    interacts with the preview, or after a few seconds.

- bfe075d: Added style palettes: named, coordinated sets of style definitions selectable with the new `<stylePalette>` component. The six standard styles are now the `default` palette, joined by eight more — the colorblind-friendly `okabeIto` (Okabe-Ito), `tolBright`, `tolMuted`, and `tolHighContrast` (Paul Tol), and `ibm` (IBM Design Library); a pure-luminance `grayscale` for readers who distinguish styles by lightness alone; and `categorical` (ten maximally varied hues) and `grumpyNarwhal` (six saturated hues that go neon in dark mode) for documents that need many obviously different styles. Every palette is WCAG-checked in light and dark mode, varies marker shapes and line widths alongside colors, and carries curated style-description color words.

    A palette selection scopes to its containing section and resets that subtree's base styles; `<styleDefinition>` overrides still apply on top, and style numbers beyond the palette's size cycle through the palette. Every palette has at least four styles, and the documentation now advises reserving style numbers 1-4 for the most important distinctions. Style number 1 always renders text in the ordinary document text color, so selecting a palette never recolors prose that specifies no style number. Palette names autocomplete in the editor, and the context-help panel resolves styles against the active palette.

## 0.7.21

### Patch Changes

- c470948: Support `addChildren`/`deleteChildren` on more parent components.

    The `addChildren` (and `deleteChildren`) actions, previously available only on `<graph>`, now also work on `<stickyGroup>` and all sectioning components — `<section>`, `<subsection>`, `<subsubsection>`, `<paragraphs>`, `<part>`, `<task>`, `<aside>`, `<objectives>`, `<problem>`, `<exercise>`, `<question>`, `<activity>`, `<example>`, `<definition>`, `<note>`, `<theorem>`, `<proof>`, `<problems>`, and `<exercises>`. For example, a `<callAction actionName="addChildren">` can now add a `<point>` to a `<stickyGroup>` inside a `<graph>`, or add a `<graph>` to a `<section>` or `<problem>`.

    The underlying mechanism (a `<_dynamicChildren>` internal child appended during normalization, plus shared worker actions that delegate to it) has been generalized so additional parent components can opt in with minimal changes.

    The `<callAction>` schema now accepts arbitrary children, since the children of a `<callAction actionName="addChildren">` are the (serialized) components to be added and can be any component type.

    Closes #1361.

- b2ad13e: Align list-item section numbers consistently.

    Section numbers for list-rendered sections (for example `<problem>`s inside `<problems>`, including through a `<cascade>`) now line up at the decimal regardless of how the content wraps, the container width, or whether an item starts with text or with an element. Previously a number could drift horizontally as its content wrapped, as the viewport narrowed, or when the item's first child was a plain string.

- 728cadf: Editor: Fix autocomplete when typing a tag immediately before another tag.

    When typing an element name directly in front of an existing tag (e.g.
    `<nu|<text>` or `<text><nu|</text>`), error recovery parsed the half-typed tag as a complete element, so the editor suggested a bogus close-tag completion (`/nu>`) and the completion menu would not open. The cursor is now recognized as still typing the open tag name, so element-name completions are offered and the menu opens — whether reached by typing or by invoking completion explicitly (Ctrl+Space) at that position, and including when `<` is typed just before another tag. In unclosed containers, the normal parent close-tag option is preserved and inserts a complete close tag even when completion is invoked before typing `<`.

    Element/tag-name suggestions now match the typed text as a substring and rank prefix matches first, so you don't have to remember how a tag name begins — typing `<num` offers `number` and `numberList` first, then `isNumber` and other tags containing `num`. The suggestions are also consistent however the menu is reached (typing, Ctrl+Space, or deleting back to a shorter prefix), where previously the visible set depended on what was cached when the menu first opened.

    Invoking completion in the body of an unclosed element (e.g. `<text><math>|</text>`) now offers that element's child components alongside its closing tag, and accepting the closing tag inserts it at the cursor instead of overwriting the end of the opening tag.

    Closes #1328.

- 27bd3db: Update the bundled MathJax from 4.1.0 to 4.1.3.

    Doenet now loads MathJax `4.1.3` (from 4.1.0) for the copy it injects when a
    page provides none, and the VS Code preview's Content-Security-Policy allowlist
    is bumped to match. The `4.1.x` line is bug-fix only: 4.1.3 notably fixes
    infinite-loop crashes in the semantic-enrichment/speech code, a Safari rendering
    bug for math in `overflow: auto` containers, and assorted TeX edge cases; 4.1.1
    and 4.1.2 improved dark-mode contrast and accessibility. This also aligns the
    version Doenet injects with what host pages that ship a floating `mathjax@4`
    tag (e.g. PreTeXt books) now load, so typesetting is consistent whether Doenet
    loads MathJax itself or reuses a host-provided engine.

    Note: MathJax 4.1.2 corrected the LaTeX size macros (`\large`, `\tiny`, etc.) to
    use standard LaTeX sizes.

- 16f0ba8: Clicking the math in a button's label now activates the button. Previously, when a button's label contained math (e.g. a `<callAction>` with a `<label>` holding an `<m>`), MathJax intercepted clicks on the math and the button did nothing.
- 40e3ff5: Answer: fix the check-work button getting stuck on "Checking..." for a choice answer with inline math inside a repeat in a `<cascade>`.

    A `<choice>` computes its `text` from its inline children's `hiddenIgnoreParent` so that it ignores the visibility it inherits from ancestors (a choice's text feeds an answer's credit-achieved dependencies, and inside a `<cascade>` ancestor visibility changes after a submission). However, `hiddenIgnoreParent` still climbed up to ancestor sections through its source composite's `hidden` — so a choice with an `<m>` placed inside a `<repeat>`/`<repeatForSequence>` within a `<cascade>` still depended on the cascade's credit-based visibility. Submitting such an answer changed its own credit-achieved dependencies, which immediately reset `justSubmitted` to `false`, leaving the "Check Work" button spinning indefinitely. `hiddenIgnoreParent` now recurses through the source composite's and adapter source's `hiddenIgnoreParent` instead of `hidden`, so it no longer depends on ancestor-section visibility.

- 0bbad39: Fix circular dependency when referencing `choice.selected` inside the same `<choice>`.

    `$c1.selected` (or a `<conditionalContent>` whose condition references `$c1.selected`) inside `<choice name="c1">` previously threw a "Circular dependency detected" error. The root cause was that `choiceInput.indicesMatchedByBoundValue` always declared a dependency on `choiceChildren.text` even when `bindValueTo` is absent — a dependency that is never used in that case. This created a resolver-blocker cycle:

    `allSelectedIndices` → `indicesMatchedByBoundValue` → `c1.text` → composite expansion of `$c1.selected` → `c1.selected` → `childIndicesSelected` → `selectedIndices` → `allSelectedIndices`

    The fix makes `indicesMatchedByBoundValue` only declare the `choiceChildren.text` dependency when `bindValueTo` is actually set, breaking the cycle.

    Closes #1399.

- 45e18eb: Choice inputs no longer hide embedded text inputs, redirect nested interactive input clicks to the outer choice, or show the outer choice focus ring while those embedded controls are focused.

    Closes #1398.

- 52d3488: Editor: Add `initialOpenTab` attribute to `<codeEditor>` to control which diagnostics/responses tab opens initially.

    The new attribute accepts: `none` (panel closed), `first` (first available tab, default), `errors`, `warnings`, `info`, `accessibility`, `responses`, or `help`.

- 27bd3db: Viewer: coexist with a MathJax that the host page already provides.

    `DoenetViewer` / `DoenetEditor` previously wrapped content in
    `better-react-mathjax`'s `MathJaxContext`, which unconditionally assigned
    `window.MathJax = config` and appended its own MathJax `<script>` — with no
    check for a MathJax the host page had already loaded. When a Doenet activity was
    embedded in a page that loads its own MathJax (e.g. PreTeXt books), this clobbered
    the host's live engine with a plain config object and/or raced a second engine,
    causing intermittent, load-order-dependent failures to render.

    Doenet now loads MathJax through a coexisting loader: if a live MathJax engine
    is already present it is reused and `window.MathJax` is never overwritten; if a
    MathJax `<script>` is already on the page (including a deferred one) Doenet waits
    for it instead of injecting a second copy; only when no MathJax is present does
    Doenet load its own. This also removes the duplicate engine (and its extra
    worker) that was previously loaded per embedded activity.

    Two new controls are exposed on `DoenetViewer` / `DoenetEditor` (and, for the
    standalone build, as `data-doenet-mathjax-url` / `data-doenet-use-existing-mathjax`
    attributes and `renderDoenet*ToContainer` config keys):

    - `mathjaxUrl` — the MathJax script URL to load when the page provides none.
    - `useExistingMathjax` — force reuse of a host-provided MathJax even when it is
      not yet detectable (e.g. the host loads it after Doenet mounts).

    Reusing a host engine means the host's MathJax version governs typesetting;
    MathJax 3.x–4.x are supported for reuse.

    Closes #1433.

- d9de421: feat: add `collapsible` and `startOpen` attributes to all sectioning components.

    Previously, `collapsible` was hardcoded to `false` in the base sectioning component and only `<aside>` and `<proof>` exposed it as a user-settable attribute (defaulting to `true`). All other sectioning components (`<section>`, `<example>`, `<theorem>`, etc.) could not be made collapsible by the author.

    `collapsible` is now declared on the base `SectioningComponent` with a default of `false`, so every sectioning component inherits the attribute. The shared `startOpen` attribute is now available on every sectioning component and controls the initial state only when `collapsible` is enabled: it defaults to `true` in the base class, while `<aside>` and `<proof>` continue to default to `collapsible="true"` plus `startOpen="false"` — no behavior change for existing documents.

    Closes #1393.

- 9728e26: New `colorInputsSeparately` attribute on `<answer>`: when set, each input is
  colored based on the awards that reference it rather than all inputs sharing the
  same overall credit color. Works with `<fractionInput>` (coloring numerator and
  denominator boxes independently) and with multiple `<mathInput>`s connected via
  `forAnswer`. Requires `numAwardsCredited` ≥ 2 for meaningful results.

    Also renames `forceIndividualAnswerColoring` → `colorAnswersSeparately` on
    sectioning components (section, exercise, problem, etc.) for naming consistency.
    The old name is deprecated and rewritten at parse time with a warning.

    Closes #1389.

- affed83: Editor: Fix context-sensitive help when the cursor sits on a tag boundary.

    When the cursor is immediately before a tag (e.g. `|<text/>`, including after whitespace or indentation), the help panel now reports the surrounding context — the parent element, or the document top level — instead of claiming the cursor is inside the element and suggesting its children. The same now holds when the cursor sits between a closed child and its parent's close tag (e.g. `<p><math>x</math>|</p>` or `<p><math/>|</p>`), where the panel reports the parent (`p`) rather than the just-closed child (`math`). When the cursor is inside a self-closing tag's `/>` (e.g. `<text/|>`), the panel now shows element-level help rather than the element's children.

    Closes #1327.

- ab57ea2: Dark mode: make it actually work and meet WCAG AA.

    - The viewer/editor now own the theme: the `darkMode` prop accepts
      `"light" | "dark" | "system"` (system tracks `prefers-color-scheme` live) and
      the resolved theme is written to a `data-theme` attribute on the viewer/editor
      root and the viewer paints its own `--canvas` background, so standalone
      embeds do not rely on the host page for the dark canvas/text/JSXGraph-axis
      CSS variables to take effect. Stray `.dark` selectors, description surfaces,
      hint/solution/feedback reveal buttons, and portaled popovers were unified
      onto `[data-theme]`. The `darkMode` prop now defaults to `"system"`
      (previously `"light"`), so an embedded `DoenetViewer`/`DoenetEditor` follows
      the user's OS/browser theme preference unless the host pins a theme.
    - Style definitions now derive a dark-mode color (and color word) from an
      author's light-mode color instead of mirroring it. Graphic/marker/line colors
      are lightened until they clear WCAG AA against the dark canvas where possible
      at their rendered opacity. A
      `textColor`/`backgroundColor` is adapted by inverting each color's lightness
      independently (so e.g. white-on-black becomes black-on-white). Because each
      color is derived from itself alone, the result is independent of the order in
      which the colors were authored and of whether they were split across
      parent/child style blocks, and it preserves the author's figure/ground
      relationship without "fixing" an intentionally low-contrast pairing. When an
      otherwise-accessible light-mode text color (or text/background pair) happens
      to invert to an inaccessible dark-mode value, an accessibility diagnostic is
      emitted (with a suggested `textColorDarkMode`/`backgroundColorDarkMode` value,
      targeting the attribute the diagnostic is anchored to, that restores
      sufficient contrast).
      Author-supplied contributors to the rendered contrast (including backgrounds,
      opacity, and `*ColorDarkMode` values) that fail AA likewise emit a diagnostic,
      mirroring the existing light-mode check.
    - The six built-in style presets had their dark-mode colors recomputed to meet
      WCAG AA.
    - Fixed renderer pieces that went invisible (or low-contrast) on the dark
      canvas: math notation lines (fraction bars / square-root vincula in
      `<mathInput>`), the `<mathInput>` insertion caret (#397), the JSXGraph
      keyboard-focus outline (#396), editable `<curve>` through/control-point
      handles, draggable polygon/polyline vertex highlights, the
      `<summaryStatistics>` table border, the `<orbitalDiagram>` and
      `<subsetOfRealsInput>` number-line graphics, the on-canvas (unchecked)
      graph-control toggle buttons, and the inline `<choiceInput>` dropdown (control
      and the portaled menu, which is given an elevated dark surface) — all now
      track the theme via `--canvasText` / `--canvas` (or doc-level dark mode for
      the portaled menu).
    - The editor's diagnostic hover tooltip (including the accessibility-contrast
      warnings) used CodeMirror's light default surface, so its text rendered
      white-on-white in dark mode; it now uses an elevated dark surface with
      recolored, AA-legible heading/code accents.
    - The PreFigure renderer (`<graph renderer="prefigure">`) is now dark-mode
      aware: the generated diagram XML depends on the document theme, so line,
      marker, and fill colors use their derived dark-mode values, and the axes/ticks
      (which PreFigure draws black by default, invisible on the dark canvas) get a
      light stroke matching the JSXGraph axes. Tick labels are MathJax
      `currentColor` and already follow `--canvasText`.
    - Added dark-mode accessibility (cypress-axe) coverage across renderer
      categories, plus computed-style regression tests for the caret, focus outline,
      and fraction bar.

    Closes #966 (complete dark mode), #396, #397. Contributes dark-mode contrast
    coverage toward #1324.

- 6412d89: Editor dark mode: theme the CodeMirror code area, syntax highlighting, autocomplete icons, diagnostics/responses/help panels, viewer controls bar, and resizable handles for WCAG AA contrast in dark mode.

    Adds cypress-axe color-contrast coverage for representative editor authoring surfaces in dark mode.

    Closes #1366.

- dcf1019: Dark mode: keep viewer, editor, and iframe error states and graph UI legible.

    Error banners, renderer-load failures, and editor footer menus now use theme-aware colors, graph drag handles now follow live dark-mode changes, and smart labels use dark-mode-aware colors on JSXGraph canvases. This also adds dark-mode accessibility coverage for disabled check-work buttons.

- e0254ea: fix: convert remaining hardcoded light-mode colors in renderers to dark-mode-aware CSS variables

    Fixes all remaining DoenetML renderer elements that displayed poorly or fell below WCAG AA contrast in dark mode after PR #1381. Replaces hardcoded colors with new theme variables (`--errorText`, `--indicatorHoverBlue`, `--buttonHoverBlue`, `--doenetTagColor`) and dark-mode values for the existing `--lightBlue/Green/Red/Orange` hover variables.

- fa58c22: Dark mode: theme the virtual keyboard.

    With `darkMode="dark"` the virtual keyboard now renders in dark mode in the viewer, editor, and iframe wrappers: the tray, key faces, special keys, focus-ring offset, and tab indicator all switch to dark-surface colors. The tray receives `data-theme` directly on its `#virtual-keyboard-tray` element so the theme is applied even though the tray portals to `document.body` outside the viewer's `data-theme` wrapper. When multiple documents share the singleton tray, it follows the active document's resolved theme, routes key events only to the focused owner, and keeps the last active document's theme while focus moves into the tray or temporarily leaves all registered owners. All dark-mode keyboard colors meet WCAG AA contrast.

    Closes #1367.

- f4391f8: Disabled `<textInput>` controls inside `<graph>` now use the same muted disabled styling as other text inputs instead of appearing enabled.

    Closes #1289.

- 172d797: Viewer: stop flashing raw LaTeX while inline math updates (e.g. dragging a point).

    Inline math that references a changing value — like `$P` for a dragged point, or
    a `<number>`/`<line>` bound to it — is rendered with `better-react-mathjax`'s
    `<MathJax dynamic>`, which writes the new raw LaTeX into the DOM and typesets it
    asynchronously. When updates outpaced MathJax (e.g. a point referenced many
    times, dragged), the raw LaTeX (`\left( 3, 4 \right)`) stayed visible during the
    drag, and its update effect could drop the final typeset, leaving one copy stuck
    showing raw LaTeX until the next unrelated re-render.

    These value-display renderers (`<m>`/`<me>`/`<men>`, point, number, line, vector,
    angle, label, answer, and response/label helpers) now render through a new
    double-buffered `DynamicMath` component: it typesets the new LaTeX on an
    off-screen buffer and swaps the result in only once it is ready, keeping the
    previously rendered math on screen meanwhile. Rapid updates are coalesced to the
    latest value (so nothing is left un-typeset) and throttled. The math therefore
    stays rendered throughout a drag — momentarily stale during a fast drag, but
    never showing raw LaTeX and never blanking.

    Math inside inputs and some labels (e.g. `<mathInput>` previews) still uses the
    previous path and is unaffected by this change.

- 9e78216: Editor: Ctrl/Cmd+S now refreshes pending source edits when focus is anywhere in the editor-viewer, including the rendered document, without triggering the viewer's Reset behavior when no code changes are pending. When the button is showing Reset, its tooltip now omits the Ctrl/Cmd+S hint.

    The shortcut follows the platform convention used by the code editor — Cmd+S on macOS, Ctrl+S elsewhere — and ignores AltGr/Alt combinations so AltGr+S still inserts a character.

- 2bd7f0a: Give patterned fills a translucent background instead of a fully transparent one.

    A closed shape with a non-solid `fillStyle` (horizontal, vertical, diagonal, backdiagonal, dots, diamonds) now renders as two layers: a background the color of the graph canvas at `fillOpacity`, and the pattern itself in `fillColor` at `fillPatternOpacity`. Previously the area behind the pattern was fully transparent. A `solid` fill is unchanged — `fillColor` at `fillOpacity`.

- 3803d38: `<fractionInput>` now colors its numerator and denominator input box borders by submitted correctness inside an `<answer>`, matching the correctness feedback already shown by `<mathInput>` and `<textInput>`.

    When correctness coloring is enabled, the fraction as a whole also exposes its validation state in accessible text without implying that the numerator and denominator are graded separately.

    Closes #1388.

- b2bdb5a: Fix the `<fractionInput>` fraction bar (vinculum) not rendering on high-DPI displays.

    The bar was drawn as a `border-bottom` on an empty, zero-height table cell inside a `border-collapse: collapse` table. On high-DPI (e.g. Retina) screens the browser snaps that collapsed hairline to the device-pixel grid and rounds it away to nothing, so the vinculum disappeared in Chrome, Safari, and Brave on those displays. It is now painted as a solid 2px-high block (`background-color: currentColor`), which rasterizes reliably at any `devicePixelRatio`.

- c0db375: Add a `<fractionInput>` component.

    `<fractionInput>` renders a numerator input box above a denominator input box, separated by a fraction bar; each box accepts a math value like a `<mathInput>`. It exposes `numerator`, `denominator`, and `value` (the numerator divided by the denominator) properties, supports `prefillNumerator`/`prefillDenominator` attributes, links two-way to a math child or `bindValueTo` target, and works as the input inside an `<answer>` (with check-work integration).

    This also clarifies the `value`/`immediateValue` help-text descriptions for the math inputs (`mathInput`, `matrixInput`, `fractionInput`): `value` is described simply as the input's value, and `immediateValue` as the value reflecting the user's in-progress edits.

    Closes #1342.

- 32a7054: Graphing: add `lineStyle` and `lineWidth` attributes to `<function>`.

    When a function is graphed, it now accepts the same per-component line style overrides as the equivalent wrapped `<curve>`. The generated schema also recognizes these attributes in editor diagnostics.

    Closes #1356.

- 35ae4b0: Graph: revise closed-shape `fillStyle` patterns and add `fillPatternOpacity`.

    Closed shapes in graphs (`polygon`, `circle`, `angle`, `regionBetweenCurves`, and `regionBetweenCurveXAxis`) now support patterned fills via `fillStyle` and separate pattern opacity via `fillPatternOpacity`.

    Available `fillStyle` values are:

    - `solid` (default — existing behavior unchanged)
    - `horizontal` — horizontal line pattern
    - `vertical` — vertical line pattern
    - `diagonal` — diagonal lines (/)
    - `backDiagonal` — back-diagonal lines (\\)
    - `dots` — dots pattern
    - `diamonds` — filled diamonds pattern

    The `dots` and `diamonds` patterns are drawn from the BANA (Braille Authority of North America) Texture Palette for Tiger Embossers, intended for tactile graphics. Pattern fills now use `fillPatternOpacity` (default `1`) instead of the solid-fill `fillOpacity` default (`0.3`).

    The previous `crosshatch` and `diagonalCrosshatch` values are replaced by `dots` and `diamonds`, respectively.

    The JSXGraph interactive renderer supports all patterns. The PreFigure renderer uses the native `fill-pattern` attribute (available from prefig 0.6.7). Filled circles and polygons also include the pattern wording in their text style descriptions (such as `styleDescription` and `fillStyleDescription`).

    Closes #1386.

- 103095a: Graph: rename the `xscale` and `yscale` properties to `xScale` and `yScale`.

    The casing now matches the other graph limit properties (`xMin`, `xMax`, `yMin`, `yMax`). Because DoenetML resolves property references case-insensitively, existing documents that use `xscale`/`yscale` (e.g. `$g.xscale`) continue to work unchanged—the canonical name reported by the schema and autocomplete is now `xScale`/`yScale`. (The unrelated `xscale`/`yscale` attributes of `<function>`, which set interpolation scales, are unaffected.)

- 2aba692: Graph: make `xScale` and `yScale` settable.

    The `xScale` and `yScale` properties of a `<graph>` were previously read-only derived values (`xMax − xMin` and `yMax − yMin`). They now have inverse definitions, so binding to or otherwise setting them adjusts the axis limits: the midpoint of the corresponding limits is held fixed while both ends move symmetrically so that the difference matches the requested scale (e.g. setting `xScale` updates `xMin` and `xMax` around their shared midpoint). Non-finite and non-positive values are rejected (a non-positive scale would make the minimum ≥ the maximum), and the underlying `xMin`/`xMax` (and `yMin`/`yMax`) inverse logic—including the `fixAxes` refusal—is reused.

- 0a58d4d: Image: resolve `source="doenet:<id>"` against a configurable media URL.

    When an `<image>` specifies `source="doenet:abcdefg"`, the image now loads from `doenetImagesUrl + "/" + imageId` (the middle slash is omitted when `doenetImagesUrl` already ends with `/`). The `doenetImagesUrl` is a new optional prop on `<DoenetViewer>` and `<DoenetEditor>` (defaulting to `https://doenet.org/api/media`), mirroring the existing `doenetViewerUrl` prop.

    Only a source that is exactly `doenet:<id>` (an alphanumeric id) is treated as a media reference; any other `doenet:` source (such as a legacy `doenet:cid=<hash>` form) renders the image placeholder rather than requesting an unknown URL.

- 6764722: Image: add open-license attribution to `<image>`.

    `<image>` gains a set of new attributes for crediting open-licensed images. A new `licenseCodes` attribute accepts a fixed set of open-license codes (the Creative Commons licenses, `CC0`, `PDM`, plus `GFDL`, `FAL`, `OGL`, `MIT`, and `APACHE-2.0`); codes are matched case-insensitively and offered in editor autocomplete in their canonical case, and specifying two codes marks the image as dual-licensed. A new `licenseVersion` attribute selects the Creative Commons URL version (default `4.0`; ignored by other licenses). From the codes the worker derives public `licenseNames` and `licenseUrls`. New `licenseName`/`licenseUrl` attributes provide a fallback used only when no `licenseCodes` are given.

    New optional attributes `imageName`, `authorName`, `authorUrl`, and `originalUrl` supply the rest of the attribution. The viewer renders a Creative Commons "TASL"-style credit sentence (e.g. `"Squirrel" by Jane Doe is licensed under a Creative Commons Attribution 4.0 license.`) at the bottom of the image's `<description>` — and shows the same description disclosure UI even when no `<description>` is authored. The license clause is phrased by kind: Creative Commons reads "a <name> <version> license", other licenses read "the <name>", and public-domain dedications read "is in the public domain (<name>)"; dual licenses are joined with "or".

    The recognized license list is exported from `@doenet/doenetml` and `@doenet/doenetml-iframe` (`mediaLicenses`, `getMediaLicenseInfo`, `getMediaLicenseDisplay`, `creativeCommonsVersions`, `defaultCreativeCommonsVersion`, and the `MediaLicenseInfo` / `MediaLicenseKind` / `MediaLicenseDisplay` / `CreativeCommonsVersion` types) so embedding apps can build their own license pickers from the same source of truth.

- 9df6f1e: Apply each option's style text color in an inline `<choiceInput>`, matching the behavior of a block `<choiceInput>`.

    Inline choice inputs render their options through a select dropdown, which previously suppressed the text color from the options' style definitions. The displayed value and the unselected (and focused) menu options now render with their style text colors; the currently selected, dark-highlighted menu option keeps white text for contrast.

    Closes #1352.

- 2b856c8: Set `maskLabel="true"` on a graphical component (or a stand-alone `<label>`) to give its label an opaque background so it stays legible when it overlaps an axis, grid line, or another object. Labels keep their transparent background by default. When masking is enabled, hovering a draggable object outlines its label as a cue that the object can be dragged.
- 4cfd4a5: Fix light-mode WCAG AA contrast for built-in style presets 1, 3, and 6.

    Preset line/marker colors for styles 1 (blue), 3 (orange), and 6 (gray) sat
    below the WCAG AA graphic threshold (3:1) in light mode when composited at
    their 0.7 opacity over the white canvas. The colors are darkened (hue and
    saturation preserved) to just clear 3:1:

    - Style 1: `#648FFF` → `#1f5dff` (2.11 → 3.08)
    - Style 3: `#F19143` → `#a6510c` (1.82 → 3.11)
    - Style 6: `gray` → `#636363` (2.43 → 3.12)

    Dark-mode variants (`*ColorDarkMode`) are unchanged — those were already
    fixed in the dark-mode PR. `fillColor` for each preset is updated to match
    the new line/marker color for visual consistency.

    The updated light-mode blue (`#1f5dff`) and orange (`#a6510c`) are also
    registered with the style-color-word resolver so editor/LSP help continues
    to describe presets 1 and 3 as blue and orange rather than purple/brown.

    The preset palette accessibility test (`presetPaletteAccessibility.test.ts`)
    is extended to assert WCAG AA compliance in light mode too (mirroring the
    existing dark-mode guard), closing the test gap identified in #1364.

    Closes #1364.

- 9b48416: Editor: support enumerated `validValues` on list-valued attributes (e.g. `createComponentOfType: "textList"`).

    When an attribute declares `validValues`, it is now interpreted per-item on a list-valued attribute: every item of the list must be one of the listed values. This flows through schema generation (the attribute is marked as a list of keywords), so editor autocomplete suggests the allowed values, the context-sensitive help panel labels them "Allowed values (one per item)", and the reference docs render the value table with a list type. The schema-violation check validates each whitespace-separated item rather than the whole value, and at runtime invalid items are dropped with a diagnostic. `<sideBySide>`/`<sbsGroup>` `valign`/`valigns` are migrated as the first worked example.

- 4998214: `<mathInput>` can now be placed inside a `<graph>`. Like `<textInput>`, it renders
  at an `anchor` point on the board and honors `positionFromAnchor` for placement
  relative to that anchor. Click inside the field to edit it; grab its label (or the
  grip shown when it has no label) to drag it to a new position. Set
  `draggable="false"` to pin it in place.
- cf8503e: Fix self-referential references in recognized rendering contexts (for example `<label>$a</label>` inside component `a`) so they render a meaningful value instead of a circular dependency error.

    When a component references itself without an explicit prop inside a recognized rendering context, DoenetML now falls back to the component's public `value` state variable rather than showing an error. For `<point>`, that means using its public coordinates value. This applies in contexts such as `<label>`, `<text>`, `<math>`, `<m>`, `<md>`, `<boolean>`, `<number>`, and the corresponding list variants. The existing circular-dependency error is preserved outside those contexts.

    Closes #1333.

- 895b636: PreFigure renderer: use native `fill-pattern` attribute for patterned `fillStyle` values.

    The `@doenet/prefigure` package now vendors `prefig-0.6.7-py3-none-any.whl`, which added native `fill-pattern` support. The PreFigure renderer now uses the `fill-pattern` attribute for patterned `fillStyle` values (`horizontal`, `vertical`, `diagonal`, `backDiagonal`, `dots`, `diamonds`) instead of falling back to a solid fill with a warning. Pattern opacity is controlled by `fillPatternOpacity` (mapped to `fill-opacity` on the patterned element).

- a760eaf: Viewer: prevent stale queued theme updates from overriding the current theme after reinitializing with Ctrl+S.

    This fixes prefigure graphs and other theme-sensitive rendering after switching between light and dark mode without a full page reload.

- 044f318: Problems: preserve list numbering through an intervening `<cascade>`.

    When `<problem>` elements sit inside a `<cascade>` inside `<problems>`, the cascade is now treated as a transparent structural container for `asList` propagation. The problems receive the expected list numbering (`1.`, `2.`, `3.`), and the cascade itself no longer incorrectly renders as list item `1`.

    Closes #1390.

- 1f18803: Viewer: fix boxed and collapsible section heading colors in dark mode.

    Boxed and collapsible section titles now use accessible dark-mode defaults instead of reusing the light-mode gray/green heading backgrounds. Authored concrete light-mode heading colors now derive accessible dark-mode heading colors automatically, while authored CSS-variable colors fall back to the accessible dark-mode defaults unless authors override them explicitly with `completedColorDarkMode`, `inProgressColorDarkMode`, and `notStartedColorDarkMode`. Accessibility diagnostics now also flag authored section heading colors that fall below WCAG AA contrast in either theme, including translucent colors after compositing.

- f920b2f: Answer: stop a partial-credit `<feedback>` from briefly flashing on screen when a section-wide check-work button submits multiple answers at once.

    `submitAllAnswers` submits each enclosed answer with `skipRendererUpdate: true` so the renderer only updates once, on the final `numSubmissions` bump. However, `performUpdate` forced a renderer fan-out whenever the update carried a `recordItemSubmission` instruction (every answer submission does), ignoring `skipRendererUpdate`. That pushed the renderer mid-loop while the section's aggregated `creditAchieved` was at an intermediate partial value, so feedback gated on a partial-credit condition flashed and then disappeared. The renderer fan-out now honors `skipRendererUpdate`; normal single submissions still render via their trailing `triggerChainedActions` flush.

- 49327a0: Section-wide check work: add a `maxNumAttempts` attribute and rename `documentWideCheckWork` to `sectionWideCheckWork`.

    Any container that supports `sectionWideCheckWork` (`<section>`, `<problem>`, `<exercise>`, `<example>`, `<p>`, `<li>`, `<div>`, `<span>`, lists, and the document) now also accepts `maxNumAttempts`. Just like a per-`<answer>` `maxNumAttempts`, each submission counts as one attempt: pressing the section-wide "Check Work" button submits and uses up an attempt, and pressing the button again does nothing until one of the inputs changes (returning the button to "Check Work"). The number of attempts remaining is shown next to the button, and once the attempts are exhausted every `<answer>` inside the container becomes disabled and the button is disabled.

    The document's `documentWideCheckWork` attribute is renamed to `sectionWideCheckWork` so the document shares the same abstraction as other containers. `documentWideCheckWork` continues to work as a deprecated alias (with a deprecation warning).

    Within a `sectionWideCheckWork` container, the attempt count is controlled solely by that container. A `maxNumAttempts` set on an enclosed `<answer>` — or on a nested `sectionWideCheckWork` container — is ignored, and DoenetML emits a warning suggesting that `maxNumAttempts` be set on the (outer) container instead.

    Closes #1308.

- 614b4c3: Adopt the shared input helpers across the non-math inputs.

    `textInput`, `codeEditor`, `booleanInput`, and `choiceInput` now reuse the shared input helpers introduced alongside `fractionInput` instead of duplicating the logic: `booleanInput`/`choiceInput`/`textInput` use the shared `submitAnswer` external action, and `textInput`/`codeEditor` use the shared `valueChanged`/`immediateValueChanged` state-variable definitions. Their `value`/`immediateValue` help-text descriptions are also reworded to match the math inputs — `value` is described simply as the input's value, and `immediateValue` as the value reflecting the user's in-progress edits.

- 3b2c343: Stop the standalone viewer from collapsing its host iframe during boot.

    When embedded with `data-doenet-send-resize-events="true"`, the viewer used to start reporting its height to the parent page the moment the React element mounted — before the core had rendered anything. Hosts that honor these messages (e.g. PreTeXt) would shrink the iframe to a sliver while the activity was still loading, and leave it collapsed if the render never completed.

    The viewer now waits for the document's first render before reporting heights, and never reports collapse-level heights. Host iframes keep their placeholder size until real content appears, then resize to its true height.

- f6ff9ac: Spreadsheet: upgrade `handsontable` to v18.0.0, `@handsontable/react-wrapper` to v18.0.0 (replaces `@handsontable/react`), and `hyperformula` to v3.3.0, while adding dark-mode theming for spreadsheet rendering.

    No changes to `<spreadsheet>` markup or formula syntax — existing content continues to work as-is. Floating-point formula results may differ very slightly (HyperFormula now rounds at 10 significant digits, matching Excel/Google Sheets behavior). The spreadsheet visual appearance is preserved via the Classic theme, and dark mode now uses the matching Classic dark theme. For accessibility, spreadsheets now use native HTML table semantics instead of Handsontable's newer ARIA grid/treegrid tags, so screen readers will navigate them as tables.

    Closes #1391.

- f4a711f: Editor: Fix stale VS Code tag/snippet autocomplete ranges.

    When typing a closing tag in the editor (for example `</te|` inside `<text>`),
    the close-tag completion now stays in sync with the full partially typed prefix
    and accepting it replaces that whole prefix. This avoids VS Code/native-LSP
    flows that could previously duplicate the `/` or leave the already-typed suffix
    behind when completing a close tag.

    The same refresh logic now also keeps `<`-triggered snippet completions in sync
    with the typed prefix, including the prefigure `annotations-skeleton` snippet,
    so accepting those items no longer leaves stale typed characters behind either.

- 3df4787: VS Code extension: stop flagging custom `<module>` attributes as unknown when they are declared inside the copied module's `<moduleAttributes>` block.

    The extension now passes its bundled DoenetML worker to the language server so the Rust-backed resolver can inspect the referenced module definition before validating a `<module copy="$name" ... />` site.

    Closes #1375.

- 0e6e9c6: VS Code extension: render math in dark mode.

    The preview window passed a boolean `darkMode` to `DoenetViewer`, but the viewer expects the string `"dark"` or `"light"`. Because the renderers compare `darkMode === "dark"`, the boolean always fell through to light-mode colors, so math inside `<m>`/`<math>` was drawn in the light-mode text color (black) and was invisible against VS Code's dark themes. The preview now passes `darkMode={darkMode ? "dark" : "light"}`.

## 0.7.20

## 0.7.19

### Patch Changes

- da57627: Editor: the accessibility report now links to the accessibility documentation.

    A "Learn how Doenet approaches accessibility" link at the top of the report points to `<docsURL>/concepts/accessibility`, where new Concept and Guide pages explain what the WCAG checks do and don't guarantee and how to write accessible activities.

- 2cf122a: Editor: give each autocomplete suggestion a meaningful, color-coded icon in the dropdown's left column.

    CodeMirror renders that icon from each completion's `type` string, and the editor was passing the lowercased LSP `CompletionItemKind` name straight through. That left the column showing accidental glyphs — a box for components, a union sign (`∪`, easily misread as a stray "u") for attributes — and nothing at all for snippets, attribute values, and references, since those `type` names aren't in CodeMirror's built-in icon set.

    Completions are now assigned distinct, intentional types and a small theme defines a colored glyph for each DoenetML category: components (`◈`), attribute names (`@`), attribute values (`▪`), references (`$`), reference properties (`.`), and snippets (`❏`). Components, reference properties, and closing tags share one LSP kind (`Property`) but are split apart for icon purposes using signal the items already carry — no LSP `kind` values change, so the language-server output and its tests are unaffected.

    Also: when the element menu is opened with Ctrl+Space (no `<` typed yet), each component suggestion now displays as a tag — `<math>`, `<answer-label>` — so it's clear they're elements. Filtering and insertion still use the bare name; only the displayed label gains the angle brackets. When a `<` was already typed, the suggestions stay bare as before.

- 818b17c: Adopt the Diátaxis documentation framework: rename the "Document Structure" section to "Concepts".
    - The editor's context-help "Learn about references" link now points to `concepts/references` (was `document_structure/references`), following the documentation folder rename from `document_structure/` to `concepts/`.

- 7d53e42: Improve the editor's context-sensitive help and make Ctrl+Space work between tags.
    - Component help now leads with the component name and its one-line summary on a single line, and the `<tag>` name is a link to the component's reference page (the footer link stays too).
    - Reference help for `$name` and `$name.property` now explains what a reference is and links to a new References page, rather than showing the referenced component's summary and page. The help is identical wherever the cursor sits in a `$a.b` chain — the whole reference is treated as one unit. A cursor on a reference inside an attribute value (e.g. `extend="$m"`) now gets reference help rather than help for the enclosing attribute.
    - An invalid reference like `$bad` (or a failing member chain like `$m.sub` or `$s2.m`) now explains the problem — "No referent found" or "Multiple referents found" when the resolver can say so definitively, and a hedged message when it can't — instead of falling back to the default panel text. The message is reported against the whole reference and is the same wherever the cursor sits in the chain, including inside attribute values like `copy="$s2.m"`.
    - When the cursor is in an element's body or in empty top-level space, the panel now surfaces a short list of components to try (instead of going blank), and points to Ctrl+Space for the full list. The same shared ranking — per-container hand-picks (including ones keyed by an abstract ancestor like `_sectioningComponent`) first, then a global "favorites" tier, then how directly the child is allowed (adapter-only children dropped unless picked), with alphabetical as the tiebreak — also drives the autocomplete dropdown's order, so the two surfaces stay in lockstep. Snippets cluster with their element in the dropdown.
    - Containers that take no children (e.g. `<variantControl>`) or only text now say so plainly instead of inviting Ctrl+Space; containers that accept both text and components note that text is allowed.
    - Pressing Ctrl+Space between tags (or in empty top-level space) now opens the element-completion menu and inserts the leading `<` for you; previously you had to type `<` first. The cursor position right between adjacent open and close tags (e.g. `<mathInput>|</mathInput>`, where the autocompleter parks the cursor after inserting a tag pair) is now recognized as the body rather than as the tag itself.
    - Adds a References page to the documentation covering `$name`, `$name.property`, and referencing repeat iterations.

- 7addd7c: Flow inputs and their labels inline with the surrounding text.

    Inputs (`<mathInput>`, `<textInput>`, `<booleanInput>`, `<matrixInput>`, an inline `<choiceInput>`, and `<answer>`) now lay their label and input out as ordinary inline content. A label long enough to wrap breaks across lines with the input following its end, instead of the input sitting beside the label's first line where it could read as though it belonged in the middle of the label text. Text before and after an input in the same paragraph also wraps together with it. A single tall label, such as one containing tall math, still aligns with the input as before.

- f5406bd: Make the document viewer resilient to a stalled core-worker startup, and stop slow documents from being aborted before they finish loading.
    - If the core worker stalled while starting up (under CPU/timing pressure), the viewer could be left permanently blank — no document and no error. It now watchdogs the worker's brief startup handshake and restarts a worker that fails to come up or hangs; after repeated failures it shows a "could not be started — reload the page" message instead of staying blank.
    - The document-evaluation phase — which can legitimately take seconds to minutes on complex documents — is no longer time-limited, so large documents finish loading instead of being aborted.

## 0.7.18

### Patch Changes

- 3449f8a: Fix two autocomplete papercuts when typing an unquoted attribute value.
    - The wrap-in-quotes / value-completion hint for a bare value past `=` (e.g. `<math name=hello`) now also fires inside a parent element. Previously the parser's error-recovery wrapped the bare run in an `AttributeValue` node when the partial element was followed by `</...>` or another `<`, which masked the bare-value branch. The cursor-position detector now distinguishes a real quoted value (starts with `"`/`'`) from this recovered form.
    - The value popup no longer flickers closed when whitespace follows `=` (e.g. `<math simplify= full`). The CodeMirror gate that decides whether to ask the LSP for completions now treats whitespace immediately following `=` as "still in trigger reach," so typing a space after `=` doesn't close the popup that opened on `=`. Scoped to `=` only — other server triggers (`<`, `/`, `"`, `'`) don't reopen the popup across whitespace, so `<math name="hello" ` behaves like `<math ` and waits for a letter before suggesting attributes.
    - Typing the _closing_ quote of an attribute value (e.g. `<math name="hello"`) no longer pops a popup of attribute names. `"` and `'` are server trigger characters so the opening quote can pop value completions, but the gate now distinguishes openers from closers by counting prior occurrences of the typed quote between the last `<` and the cursor — an even count is an opener, odd is a closer. This correctly classifies `<math name="hello" simplify="` as an opener (two prior `"` chars from `name="hello"`) while still treating the closing `"` of `<math foo="x=y"` as a closer, so closers behave like `<math ` and wait for a letter before suggesting attributes.

- ace8b55: Reword the one-sentence component summaries surfaced by the editor's context-sensitive help and the schema.
    - ~234 per-component summaries (the `static componentDocs.summary` on each component class) were reconciled against the prior reference-docs wording. The worker class is now the single source of truth; the alphabetical and by-type reference indexes are generated from it.
    - Style is uniform across all 245 components: starts with a capital letter; no trailing period.
    - A handful of substantive corrections, most notably `<pretzel>` (which previously described itself as "a figure for visualizing logical compositions of subsets of the reals" — entirely wrong; now describes its actual response-matching behavior) and `<attractToConstraint>` (which had mirrored `<attractTo>`'s description instead of its own).
    - The autocomplete-popup hover text, the in-editor help panel, and any other surface that reads `componentDocs.summary` will all show the new wording.

- b4f39dc: Editor: resolve coordinate-style chains via array `indexAliases`, so autocomplete and the context-help panel both surface `$vector.head.x`, `$line.points[1].x`, `$circle.center.y`, and `$curve.controlVectors[0][2].x` (3D, with two bracket indices on one segment).

    The DoenetML runtime already resolves these chains: each array state variable carries an `indexAliases` table — `Vector.head` has `[["x","y","z"]]`, `Line.points` has `[[], ["x","y","z"]]`, `Circle.center` has `[["x","y","z"]]` — and the runtime treats the trailing segment as an exact-match alias for one dimension. The editor previously dead-ended at the first segment past the array property because the schema didn't carry the alias table.

    This change emits `indexAliases` onto each array `SchemaProperty` from the runtime's existing per-state-var declaration, then wires a small `walkIndexAliases` helper into both the autocomplete and the context-help layers:
    - **Autocomplete** at `$container.arrayProp.` (or `$container.arrayProp[N].`) now offers each alias name for the current dimension as a Reference-kind completion (`x`, `y`, `z` for `$vector.head.`).
    - **Help panel** renders a new `arrayEntry` payload for a fully-consumed chain (`$vector.head.x`, `$line.points[1].x`), showing the array property's description plus the alias path and the entry's leaf type.

    The chase is intentionally exact-match on the alias table — it never looks up properties of the array entry's `type` (e.g. `<point>` for `head`). So `$vector.head.hidden` continues to produce no completion and no help, matching the runtime: `hidden` IS a `<point>` property, but it isn't in `head`'s alias table and the runtime won't resolve it either. This keeps the editor in lockstep with what authors will actually see at runtime instead of inviting them down chains that look plausible but don't work.

    Picks up any array state variable that ships `indexAliases` automatically once the schema is regenerated, with no per-component plumbing.

    Closes #1180.

- a7bb40b: Improve the editor's context-sensitive help panel.
    - The panel now reflects the currently-highlighted autocomplete row. Arrow-key navigation through the popup swaps the help instantly, and closing the popup reverts to cursor-based help. Element, attribute, property (ref-member), `$name` reference, and value rows are all supported.
    - Highlighting a snippet row shows the snippet's description and a preview of the template it would insert.
    - Help no longer disappears mid-attribute when the cursor crosses tricky parser boundaries: `<math simplify=`, `<math simplify="`, `<math simplify=full`, `<math simplify= full` (whitespace after `=`), and similar unquoted-value cases all keep the `simplify` attribute help visible.
    - Unknown attributes fall back to element help instead of blanking. Typing `<math bad`, `<math bad=foo`, or having `"foo"` highlighted in the value popup now keeps the `<math>` description on screen.

- a07d543: Fix the editor's context-sensitive help for `$container.member` access through composite wrappers, when multiple wrapper branches each declare a descendant with the same name.

    Example: a `<select name="s">` with two `<option>` branches each containing `<text name="t">`. The autocomplete dropdown correctly offered `t` at `$s[1].`, but the help panel went blank — `getNamedDescendant` requires a uniquely-addressable name and saw two matches.

    The resolver already includes such names in `visibleDescendantNames` for indexed access through a composite (walking `<case>` / `<else>` / `<option>` wrappers transparently via `collectNamesFromCompositeChildren`). The help-side descendant lookup in `resolveRefMemberDescendantHelp` now mirrors that wrapper walk and returns the first match — but only when every branch resolves the name to the same component type. When branches diverge (e.g. one `<option><math name="t">` and another `<option><text name="t">`), the help layer can't statically tell which branch the runtime will pick, so the panel stays blank rather than guessing.

    Closes #1179.

- 092dfb5: Fix the editor's context-sensitive help panel for property refs whose path has two or more navigation segments (e.g. `$rep[1].point1.x`).

    The editor's help logic used to run against a local `AutoCompleter` with no Rust resolver attached, so multi-segment refs silently fell to a JS-only fallback that only walked the first path segment and could surface misleading help — or, for unindexed traversal through a `takesIndex` composite like `$rep.myMath`, surface help that the runtime would actually error on.

    Help derivation now lives in the LSP worker, which already has the Rust resolver attached for diagnostics and completions. The editor sends a small `doenet/contextHelp` / `doenet/contextHelpForCompletion` request and renders the response. Multi-part chains resolve correctly through the real reference graph; resolver-suppressed cases (`$rep.myMath` without an index) correctly return no help.

    User-visible improvements:
    - `$rep[1].myMath.x` now shows `<math> property x` instead of "Help for multi-part references is not yet supported."
    - `$rep.myMath` (unindexed access through a `takesIndex` composite) no longer surfaces misleading help — the panel correctly blanks, matching what the runtime would error on.
    - `$valueName` / `$indexName` references inside a `<repeat>` / `<repeatForSequence>` now surface the binding in the help panel — matching what the autocomplete dropdown offers. The panel notes which repeat introduced the name and whether it's the value or the index.
    - Editor bundle drops the schema map + `AutoCompleter` + `computeContextHelp*` modules; the LSP worker is now the single source of truth for help derivation.

    During the rust-core boot window (~300–800 ms on first load), ref-resolution positions briefly show no help; element/attribute/snippet help works as soon as the LSP initialises.

- acef508: Resolve CSS variables in the editor's context-sensitive help panel so attribute defaults like `var(--lightGreen)` are shown as their concrete computed value (e.g. `#a6f19f`) instead of an opaque variable reference. Resolution happens at runtime via `getComputedStyle` on `:root`, so `DoenetML.css` remains the single source of truth — any new attribute whose default is a `var(--name)` is handled automatically.
- 9bf3629: `<section name=foo>` and similar unquoted attribute values now produce a single error both in the viewer and in the editor, instead of up to four overlapping diagnostics (an "invalid attribute" from the worker, two duplicate "missing value" parser errors, and a "name=''" normalization error). The unified message names the corrected form (`name="foo"`) and is classified as an error so the viewer renders the orange error block — matching the existing severity for the related shapes `<section name>` and `<section name="4" />`. Authors who write an unquoted value on an unknown attribute (e.g. `<a foo=bar />`) see only the unquoted-value error until the quoting is fixed; the follow-up "unknown attribute" warning surfaces on the next edit.

    Also fixes a pre-existing parser duplication: errors that lived inside the first attribute of an open tag (e.g. the "missing value" warning for `<x name= />`) were emitted twice. They now appear once.

    And fixes a pre-existing LSP severity bug: DoenetML diagnostics with a soft severity (`warning`, `info`) were rendered as red error squiggles in the editor regardless. Deprecation warnings now render with the appropriate yellow/blue squiggle color.

    And fixes a pre-existing duplication in the editor hover: parser-emitted DAST errors were surfaced once by the LSP and again by the worker's runtime diagnostics once the viewer ran, so the hover tooltip showed the same message twice even though only one squiggle was drawn. The duplicate copy is now collapsed before reaching the editor.

- 7aeb62d: Re-parent `<description>` and `<shortDescription>` to appropriate base components, removing irrelevant inherited attributes.

    `<description>` previously extended the scored-section base used by `<div>`, exposing attributes (`aggregateScores`, `weight`, `sectionWideCheckWork`, `showCorrectness`, `colorCorrectness`, `forceIndividualAnswerColoring`, `submitLabel`, `submitLabelNoCorrectness`, `displayDigitsForCreditAchieved`) and properties (`creditAchieved`, `percentCreditAchieved`) that have no meaning for a description. It also appeared as a valid generic block child everywhere in the schema, causing spurious autocompletion. It now extends `BlockComponent` and is schema-valid only where a `description`/`descriptions` child group is declared.

    `<shortDescription>` previously extended `<text>`, exposing graph-placement attributes (`draggable`, `layer`, `anchor`, `positionFromAnchor`) and `isLatex`, along with `math`/`number` adapters — none of which apply, since a `shortDescription` is never visually rendered. It now extends the non-graphical inline base used by `<title>`. Its accessibility diagnostic that warns when a short description contains math is rewritten to inspect the inline children directly.

    The dropped attributes are registered as deprecated-and-ignored in the DAST deprecation registry (#1144), so existing documents that used them produce a warning instead of an "invalid attribute" error.

    Fix `<blockQuote>` rendering of whitespace between inline children. `<blockQuote>` was missing `includeBlankStringChildren`, so a whitespace-only string between two child components was stripped and adjacent texts ran together — `<blockQuote><text>hello</text> <text>there</text></blockQuote>` rendered as `hellothere`. `<blockQuote>` now also sets `canDisplayChildErrors`, matching the other arbitrary-content block containers (`<description>`, `<p>`, `<div>`).

- ca00a1f: Editor now warns when an attribute value is written without quotes (e.g. `<math name=foo>` → `name="foo"`). The yellow squiggle covers the bare token and the hover message names the corrected form, catching the case where the author dismissed the autocomplete hint or never opened the menu.
- 2dcf818: Use schema descriptions in the generated documentation and give schema attributes their own type.

    Each schema attribute now carries a `type` derived from its own declaration: `createComponentOfType`/`createPrimitiveOfType` (with the `string` primitive surfaced as `text`), `keyword` when the attribute enumerates valid values, and `reference` for reference-creating attributes — or `referenceOrText` when such an attribute also sets `allowStrings` (e.g. `<ref to>`, which accepts a URL string in addition to a component reference). Previously an attribute's type was inferred only from a same-named property, so attributes without one (e.g. `<answer>`'s `type`, `showCorrectness`, `colorCorrectness`) had no type.

    The reference documentation now renders the attribute, property, and attribute-value descriptions (and component summaries) that were already used for editor context-help and autocomplete.

    The unused `description` attribute of `<answer>` is excluded from the schema, so it no longer appears in autocomplete or RelaxNG validation.

- 63a0079: Schema cleanup and reference docs additions.
    - Hide non-functional or PreTeXt-compat-only components from the generated schema (and therefore from autocomplete and the auto-generated reference docs): `<markers>` (slider helper currently broken — tracked in #1164), `<topic>` (PreTeXt-compat alias), `<dataFrame>` and `<summaryStatistics>` (experimental, no source mechanism yet).
    - Refresh wording of two `<annotation>` attribute descriptions (`speech`, `sonify`) to match how Prefigure's screen-reader features actually surface to learners.
    - Add 22 new author-facing reference pages covering previously-undocumented components (annotation, annotations, cascade, cascadeMessage, cellBlock, clampFunction, codeEditor, column, displayDoenetML, extractMathOperator, feedbackDefinition, givenAnswer, latex, lcm, note, periodicSet, pluralize, solveEquations, tagc, tage, variantControl, wrapFunctionPeriodic), plus cross-link additions on existing `<option>`, `<select>`, `<feedback>`, `<award>`, `<tag>` pages. Every component now in the generated schema is documented (`check:docs-coverage` reports `0 unresolved` with an empty allow-list).

- f2a5698: Add reference documentation pages for the chemistry components `<electronConfiguration>`, `<ion>`, `<ionicCompound>`, and `<orbitalDiagram>`. Editor context-sensitive help now links to these new pages instead of treating them as undocumented (four `docsSlug` entries in the generated schema flipped from `null` to the new slugs).
- 942b3e3: Add reference documentation pages for `<cobwebPolyline>`, `<eigenDecomposition>`, `<equilibriumCurve>`, `<equilibriumLine>`, `<equilibriumPoint>`, and `<rightHandSide>`. Editor context-sensitive help now links to a reference page for these components instead of treating them as undocumented (six `docsSlug` entries in the generated schema flipped from `null` to the new slugs).
- 5ae7e7c: Add reference documentation for graphical and constraint components that were previously undocumented: `<attractToConstraint>`, `<constrainToInterior>`, `<pegboard>`, `<regionHalfPlane>`, and `<stickyGroup>`. Each component has been removed from `undocumented-components-allowlist.txt` and the existing unlinked entries in the `Alphabetical Component Index` and `Index by Component Type` tables have been linkified, with new rows added for `<attractToConstraint>`, `<constrainToInterior>`, `<regionHalfPlane>`, and `<stickyGroup>`.

    The `<attractToConstraint>` page leads with a callout positioning it for constraints that have no dedicated "attract" form (especially `<constrainToInterior>`) or for combining several constraint types under one threshold via `<constraintUnion>` — the simpler `<attractTo>` and `<attractToGrid>` are recommended when wrapping a single `<constrainTo>` or `<constrainToGrid>`. Its examples wrap `<constrainToInterior>` and a mixed `<constraintUnion>` so they cannot be re-expressed with `<attractTo>` siblings.

    The `<pegboard>` page notes that the pegboard itself only renders dots — making other objects snap to those positions requires pairing it with an `<attractToGrid>` or `<constrainToGrid>` constraint using the same `dx`/`dy`/`xoffset`/`yoffset`.

    Correct misleading attribute descriptions on `<regionHalfPlane>`. The `horizontal` attribute description previously said the half-plane is bounded by a horizontal line, and `boundaryValue` referenced `y = boundaryValue`, but the implementation constrains the x-coordinate when `horizontal` is true (the bounding line is vertical and the half-plane extends horizontally). The descriptions have been rewritten to match the actual behavior.

- 0a0858f: Docs: group attributes and properties on component reference pages into collapsible sections — a curated "Highlighted" group (open by default), functional groups (e.g. number display, labels), an "Other" group, and a "Common to all components" group that surfaces the previously hidden `BaseComponent` attributes. Adds a filter box, an Expand/Collapse-all toggle, and links from each listed attribute/property to its worked example (including examples on other pages of a multi-page reference).

    Drives the grouping with optional, docs-only `groupName`/`highlighted` metadata on attribute definitions and public state variables, threaded into the generated schema.

- 98e3733: Add reference documentation pages for `<asList>`, `<convertSetToList>`, `<pointList>`, `<tupleList>`, and `<vectorList>`. Editor context-sensitive help links to these new pages instead of treating them as undocumented.

    Documentation pass on the rest of `pages/reference/`: every `<*Input>` now has a programmatic label (a `<label>` child, a sibling `<label for="$name">`, or a `<shortDescription>` for inputs that have no natural visible prompt); every `<graph>`, `<image>`, and `<video>` now has a `<shortDescription>` first child; sugared answers (no explicit `<*Input>` child, no `<award><when>`) get their own `<label>`. The accessibility rules behind these changes are written up in `.github/skills/doenetml-docs-authoring/SKILL.md`.

    The List-component docs (`<mathList>`, `<numberList>`, `<textList>`, `<booleanList>`, `<intervalList>`) gained an explicit note that items are separated by **spaces**, not commas. The `asList` attribute's description was corrected from "each on its own line (false)" to "with no separator (false)" across the 21 List/composite source files that share it.

- 0da78df: Add reference documentation for sectional and block-level components that were previously undocumented: `<activity>`, `<blockQuote>`, `<br>`, `<conclusion>`, `<definition>`, `<exercises>`, `<hr>`, `<introduction>`, `<objectives>`, `<paragraphs>`, `<part>`, `<problems>`, `<span>`, `<statement>`, `<subsection>`, `<subsubsection>`, `<task>`, and `<theorem>`. Each component has been removed from `undocumented-components-allowlist.txt`.

    The new `<problems>`, `<exercises>`, `<introduction>`, and `<conclusion>` pages highlight the `asList=true` child-filtering rule (only the title child, sectional children, `<introduction>`, and `<conclusion>` render; bare strings and `<p>`s are silently dropped), with an instructive before/after example. The `<introduction>` and `<conclusion>` pages lead with the `asList`-parent use case where these components are most needed.

    The new `<subsection>` and `<subsubsection>` pages note that they are equivalent to a `<section>` nested to the same depth (heading level follows nesting), and `<section>` gains a parallel "equivalent nesting" example so the choice between the two forms is visible at a glance.

    All sugared `<answer>`s in the new pages carry a `<label>` (per the `doenetml-docs-authoring` skill's accessibility rule); references to named block components were unwrapped from any enclosing `<p>` to satisfy schema constraints.

    Correct misleading `componentDocs.summary` strings that overstated auto-numbering. Sections (`<section>`, `<subsection>`, `<subsubsection>`, `<paragraphs>`, `<part>`, `<task>`, `<definition>`, `<theorem>`) only render an auto-generated number when no explicit `<title>` is provided (`includeAutoNumber` defaults to `false` and `includeAutoNumberIfNoTitle` defaults to `true`), so summaries no longer assert that they are unconditionally numbered. The `<section>`, `<example>`, `<problem>`, and `<exercise>` reference pages have been reworded similarly. `<statement>`, `<introduction>`, and `<conclusion>` summaries now describe what they group rather than implying sectional auto-numbering.

    Also re-label and link the entries for these components in the `Index by Component Type` and `Alphabetical Component Index` pages, including newly-added rows for `<blockQuote>`, `<br>`, `<hr>`, `<span>`, `<part>`, `<task>`, and `<subsubsection>`. The `<section>` entry in those tables no longer asserts that the rendered block is auto-numbered, and the previously placeholder descriptions of the form "container element included for PreTeXt compatibility" are replaced with a brief author-facing description per component.

- 8fa2e2c: Fix crash when `<description>` is a direct child of `<document>` (including standalone `<description>` at the top level).

    `<document>` declared a `description` child group and a `description` state variable that read `text` from any `<description>` child. `<description>` extends `BlockComponent` and never defined a `text` state variable, so dependency setup threw `Unknown state variable text of <idx>`. The bug was pre-existing — `<description>` previously extended `<div>`, which also lacks `text` — but only surfaced when a `<description>` sat directly under the document.

    The `document.description` state variable was a legacy hook with no consumers in the worker, the renderer, or the surrounding packages. The `description` child group and `description` state variable have been removed from `<document>`; a `<description>` anywhere in a document now resolves cleanly, and the schema no longer lists `<description>` as a direct child of `<document>`.

- cf2b262: Redesign the editor's footer and the diagnostics/responses/help panel.
    - The diagnostics tabstrip and the `Format`/version bar collapse into a single footer row: version on the left, then a `</> Context` help tab, the four diagnostics tabs (errors / warnings / info / accessibility), a submitted-responses tab, and a three-dot menu on the right with `Format as DoenetML` / `Format as XML`.
    - Tabs are now click-to-toggle — click a tab to open the panel on it, click the active tab to close. The close-X is gone.
    - New `showHelp` prop on `DoenetEditor` (default `true`) controls the help tab independently of `showDiagnostics` / `showResponses`.
    - `initialOpenTab` now defaults to opening on the help tab (or the first enabled tab). Pass `initialOpenTab={null}` to mount with the panel closed.
    - The panel opens to ~¼ of the editor height; the virtual keyboard's open-keyboard tab moves to the lower right so it no longer overlaps the footer.

- d2a749f: Exclude the ignored `label` and `cols` attributes of `<ol>`/`<ul>` from the schema.

    These two list attributes are accepted by the parser but not acted on — the renderer ignores `cols` entirely and does not yet render `label`. They now set `excludeFromSchema: true`, so they disappear from editor autocomplete, RelaxNG validation, and the docs reference tables while remaining registered. Existing content that sets `label` or `cols` on an `<ol>`/`<ul>` continues to parse silently instead of erroring.

- 73c1af3: Exclude the PreTeXt-compatibility `<h>` and `<idx>` components from the schema.

    The `<idx>` (back-of-the-book index entry) and `<h>` (index heading) elements were added for PreTeXt compatibility but have no DoenetML index infrastructure behind them and no tests. They now set `excludeFromSchema = true`, so they disappear from editor autocomplete and RelaxNG validation while remaining registered — content copied from PreTeXt that contains these tags continues to parse silently instead of erroring. Their `componentDocs.summary` strings have been corrected to describe what they actually are and flag the PreTeXt-compat status.

- f2d8a73: Stop offering plumbing state variables as author-facing properties.

    Editor autocomplete and context-help no longer suggest the renamed-aside or pre-processed state variables that components keep around as runtime scaffolding — `disabledOriginal`, `valuePreRound`, `valuePreOperator`, `valuePrePluralize`, `originalValue`, and `colorCorrectnessPreliminary`. The derived author-facing names (`disabled`, `value`, `colorCorrectness` attribute, …) stay available; only the internal twin is hidden from the schema.

- 5c6191a: Fix auto-completion of closing tags when nesting an element with the same
  tag name as its parent. Previously, typing `<p>` inside an existing
  `<p></p>` would not insert the inner `</p>` (the parser's stack-matching
  "stole" the only `</p>` for the inner element), and typing `</` afterward
  would not suggest the closing tag. The completion logic now walks up the
  contiguous chain of same-name ancestor elements and, if any of them is
  missing a close tag, treats the inner element as still needing one. (#1117)
- e8bf61e: The "Format DoenetML"/"Format XML" buttons (and the LSP format-on-save) now lay out documents like a standard HTML/XML formatter: block-level elements always sit on their own line, inline elements flow with the surrounding text, and unrelated sibling elements never share a line. Each element's content mode (block, inline, pre) is derived from the component's `InlineComponent` / `BlockComponent` inheritance, emitted into the schema as `layoutCategory`. Blank lines between any two block-adjacent siblings (block↔block, text↔block, block↔text) are preserved and capped uniformly at one. `<pre>` content stays verbatim. Inside `<setup>` and `<moduleAttributes>` — definitional containers with no prose flow — every direct element child gets its own line regardless of inline/block classification, while each child's own internals format normally. Re-running the formatter on its own output is a no-op (idempotence enforced by tests). Closes #1116.
- 68bfe0c: Fix iframe-wrapped `<DoenetEditor>` so prop changes no longer reload the iframe and reset editor state. Toggling `readOnly`, `showDiagnostics`, `showResponses`, `width`, and similar serializable props now propagates to the inner editor live via Comlink instead of being baked into a new `srcDoc`. Function-typed props (callbacks) also propagate live: when the parent passes a new closure identity, the iframe is re-pointed at the fresh function. `doenetML` is treated as initial-only after mount — changes are silently ignored so in-progress edits aren't overwritten; consumers wanting to seed a new document should remount via a parent `key=`. In `@doenet/standalone`, `renderDoenetViewerToContainer` and `renderDoenetEditorToContainer` now cache the React root per container so repeat calls re-render in place instead of mounting a competing root.
- fb3ebdf: Fix `<latex>` crashing when one of its children lacks a `latex` state variable. Constructs like `<latex><text>foo</text></latex>`, `<latex>$mathInput.latex</latex>` (where `<mathInput>` does not expose a `.latex` prop), or any reference whose resolved component lacks `latex` previously raised "Unknown state variable latex of `<idx>`" from the worker, which leaked the internal state-variable name to the rendered viewer. The `<latex>` value-dependency now marks `text`/`latex` as optional on its children, matching `<m>`/`<me>`/`<md>`, so children without `latex` fall back to their `text` value.
- 94b7714: Editor: extend `childContextHelp` alias resolution beyond documentation so the LSP validates the alias target's children, attribute set, and per-attribute enumerated values — not just its help text.

    Before, `<row>` and `<column>` inside `<matrix>` were validated against the tabular `<row>` / `<column>` schemas even though the runtime sugars them into `<matrixRow>` / `<matrixColumn>` (a `MathList`). Authoring the docs examples produced spurious diagnostics (`Element <math> is not allowed inside of <row>.`, `<row> doesn't have an attribute called unordered/maxNumber/…`), element and attribute-name completion offered the wrong sets, and the attribute-value dropdown read its enumeration from the canonical entry.

    Now child-element validation, attribute-name validation, attribute-value enumeration, and the corresponding completion branches all consult the alias-aware schema entry when a parent declares a `childContextHelp` redirect, sharing the same `resolveEffectiveSchemaElement` lookup as the documentation popup.

- ee9cb06: `<mathInput>`: customize which identifiers are auto-formatted as built-in function names in the editor.
    - `additionalFunctionNames` — extra names to auto-format (e.g., `"erf"`).
    - `removedFunctionNames` — built-in names to stop auto-formatting (e.g., `"min"` so `kg/min` can be typed as a unit).
    - `resetFunctionNames` — when set, replaces the entire list (defaults plus the other two attributes are ignored). Pass an empty value to disable auto-formatting entirely.

    Defaults are unchanged. All three attributes accept whitespace-separated text lists. Without `resetFunctionNames`, entries appearing in `removedFunctionNames` are dropped from the effective list even if `additionalFunctionNames` re-adds them. Author-supplied names that MathQuill would reject are filtered out instead of crashing the editor; a `warning` diagnostic positioned on the offending attribute lists what was ignored and explains the naming rule.

    The editor's context-help panel surfaces the resolved effective list when the cursor is on any of the three attributes, alongside the deltas (or the reset list) authored on that input. Attributes whose schema default is an empty array no longer render an empty `Default:` row.

- 09152a0: Editor: surface the declared child's component type and default value when describing author-declared attributes on a `<module copy="$x" />` (or `extend=`) site. The attribute-name autocomplete dropdown and the context-help panel now show e.g. "Author-declared module attribute (`<point>`)" instead of the generic placeholder, so authors can see at a glance whether the declared attribute on the target module is a point, number, text, … rather than having to chase down the definition. The help panel's "Default:" row also picks up the declaring element's inner content (e.g. `(3,4)` from `<point name="P">(3,4)</point>`), so authors can see what value the instance would take if they omitted the attribute.
- 2980677: Editor: stop warning on author-declared attributes of `<module copy="$x" />` (or `extend=`) when `$x` resolves to a `<module>` whose `<moduleAttributes>` declares them; surface those declared names in the attribute-name autocomplete dropdown alongside `<module>`'s canonical attributes; and show the same description in the context-help panel when the cursor sits on one.

    For each `<module copy=…>` / `<module extend=…>` site, the editor resolves the reference through the same Rust resolver the runtime uses, so bare names (`$m`), multi-segment paths (`$s.m`), and deeper chains all work. Scope rules match the runtime exactly: an inner `<module copy="$m">` inside `<section name="s1">` resolves to that section's `m`, not to another section's same-named module, and ambiguous references (e.g. `$s2.m` when two sibling sections share the name `s2`) produce no augmentation — the unknown-attribute warning correctly fires.

    When the reference doesn't resolve, points at a non-`<module>`, or targets a `<module>` with no `<moduleAttributes>`, the canonical `<module>` schema decides as before and unknown-attribute warnings remain correct. Bracket-bearing path segments (`copy="$s[0].m"`) are conservatively skipped, and names reserved by the `<module>` class itself (`name`, `hide`, `copy`, `extend`, …) are filtered to match the runtime's silent rejection of such declarations.

    Resolution is precomputed once per source revision and batched across all sites, so back-to-back validation + completion + help calls between edits cost at most one resolver round-trip per `<module copy=…>` site total.

- 374a4c1: Allow per-component overrides for non-color style attributes on graphical components — e.g. `<point markerStyle="square" markerSize="10">`, `<line lineWidth="1" lineStyle="dashed">`, `<polygon fillOpacity="0.5">`. Component-level overrides win over inherited `<styleDefinition>` values; siblings without the attribute still inherit normally.

    Each component opts into the categories its renderer uses via `static styleOverrideCategories`:
    - **marker** (`markerStyle`, `markerSize`, `markerFilled`) — `<point>`; `<endpoint>` and `<equilibriumPoint>` (both minus `markerFilled` — their `open` / `stable` already control fill).
    - **line** (`lineStyle`, `lineWidth`) — `<line>`, `<lineSegment>`, `<ray>`, `<vector>`, `<polyline>`, `<parabola>`, `<bestFitLine>`, `<cobwebPolyline>`; `<equilibriumLine>` (minus `lineStyle` — `stable` determines solid vs. dashed).
    - **line + fill** (line group + `fillOpacity`) — `<polygon>`, `<triangle>`, `<rectangle>`, `<regularPolygon>`, `<curve>`, `<circle>`; `<equilibriumCurve>` (minus `lineStyle`, same reason).

    Cross-category use is a schema error: `<point lineWidth="3">` and `<line markerStyle="square">` are now rejected.

    **New attribute `markerFilled`** (boolean, default `true`) toggles filled vs. open marker rendering on `<point>`; no-op for `markerStyle="cross"` / `"plus"`.

    **Exclusions.** Color attributes (`*Color`, `*ColorDarkMode`, `*ColorWord`) and the contrast-feeding opacities (`lineOpacity`, `markerOpacity`) stay `<styleDefinition>`-only so the per-styleNumber WCAG contrast diagnostics remain authoritative. `fillOpacity` is contrast-irrelevant and overridable. `*Word` descriptors (`markerStyleWord`, `lineStyleWord`, `lineWidthWord`) are derived from the underlying value rather than independently overridable — overriding `lineWidth=2` re-derives `lineWidthWord=""` even when a `<styleDefinition>` shipped a custom `"hairline"`, since a stale descriptor next to a different value would mislead.

    **Schema.** `markerStyle` and `lineStyle` are now keyword/enum attributes with autocomplete (case-insensitive): `markerStyle` ∈ {circle, square, triangle, triangleUp/Down/Left/Right, diamond, cross, plus}; `lineStyle` ∈ {solid, dashed, dotted}. Both the override path and the `<styleDefinition>` path forward the same enum metadata.

- 970b92b: Surface state-variable defaults to attributes in the schema, and render math-expression defaults through MathJax.
    - Attributes whose resting value lives on a state variable rather than the attribute declaration (e.g. `padZeros`, `displayDigits`, `displayDecimals`, `displaySmallAsZero`, `avoidScientificNotation`) now carry their effective `defaultValue` in the schema, so the reference documentation and the editor's context-sensitive help panel show it. `BaseComponent.returnStateVariableInfo` surfaces each state def's `hasEssential` + `defaultValue` pair, and `get-schema.ts` falls back to that when an attribute does not declare its own default.
    - Math-expression defaults (e.g. the `<math>` `assumptions` attribute, which defaults to `me.fromAst("＿")`) are encoded as a `{ type: "math", latex }` sentinel instead of the opaque `{ objectType: "math-expression", tree }` JSON dump. The docs reference pages and the editor's context-help panel both render the sentinel through MathJax, so the LaTeX appears typeset rather than as a serialized object.

- 475effb: Editor: surface autocomplete and context-sensitive help for `$s.t` shorthand on the select family when the count attribute is absent or literal `"1"`.

    Before this change the autocomplete dropdown and the help panel both treated `<select>` (and its siblings `selectFromSequence`, `selectRandomNumbers`, `selectPrimeNumbers`, `samplePrimeNumbers`, `sampleRandomNumbers`) as `takesIndex` composites whose descendants are only addressable via `$s[1].t`. The runtime already resolves `$s.t` like `$s[1].t` when the composite produces a single replacement (Select.js wraps each chosen option's serialized contents in a `<group>`, and group children propagate names to the parent's name_map), so authors with `numToSelect="1"` (the default) were correctly typing `$s.t` and getting no editor help despite the runtime accepting it.

    The rule is a strict textual DAST check: the shorthand applies iff the count attribute is absent OR its source text, trimmed, equals exactly `"1"`. `numToSelect="$n"` (dynamic, even when `$n` evaluates to 1), `"01"`, `"1.0"`, `"One"`, and `"2"` deliberately do NOT qualify — authors who need shorthand with dynamic count write `$s[1].t` explicitly. Attribute names are matched case-insensitively to mirror the worker (so `<select NumToSelect="2">` is correctly rejected, not silently treated as "attribute absent" — the worker accepts mixed-case attributes via its lowercase-mapping pass). Element names are not case-insensitive at the worker (`<SELECT>` is rejected as an invalid component type), but the predicate lowercases them too as harmless LSP defensiveness. Both the autocomplete and the context-help layers read from the same resolver-adapter output for a given DAST node, so they cannot diverge on whether to surface the shorthand on a given source.

    Behaviour:
    - `$s.t` (with `numToSelect` absent or `"1"`, possibly whitespace-padded) now offers descendant completions and renders the same `refName` help payload as `$s[1].t`.
    - `$s.numToSelect` (and other composite-own properties) still completes and shows property help — the shorthand commits to descendant resolution only. `$s[1].numToSelect` continues to surface nothing, since with an authored bracket the cursor is on the replacement (which has no `numToSelect` property), matching how the worker resolver behaves.
    - `$s.t` with `numToSelect="2"` / `"$n"` / non-canonical literals continues to surface no descendants and no help, matching today's runtime: the author must write `$s[1].t`.

    Each select-family member reads its real count attribute (`numToSelect` for the four `select*` tags, `numSamples` for the two `sample*` tags) — the shared `SELECT_FAMILY_COUNT_ATTRIBUTE` table is the single source so the predicate stays consistent across layers.

    Closes #1181.

- 2865d08: Make accessibility diagnostics less intrusive in the editor. The squiggle now covers only the opening tag (`<graph`, `<image`, …) instead of the entire multi-line element, so the hover popup no longer follows the cursor across an element's body. The squiggle and tooltip are restyled to a dotted purple to read as advisory rather than as a hard error, and a new "Show accessibility diagnostics in editor" toggle on the accessibility report tab lets authors silence the editor squiggles while still seeing the issues in the report and status button.
- 28244d2: The editor's context-help panel for style attributes — per-component overrides like `<point markerStyle="…">` and attributes inside a `<styleDefinition>` — now surfaces an **Active default** row in addition to the schema's static **Default**. The value is what `selectedStyle` resolves to at the cursor's scope: the in-scope `<styleDefinition>` blocks run through the same merge and per-block derivation passes the worker applies at runtime, including the built-in numbered presets as the seed. Annotated with the styleNumber the value came from.

    Inside a `<styleDefinition>`, the active default excludes the queried attribute from the current block so authors see what their _peers_ (other styleDefinition siblings) and the built-in preset would contribute for that styleNumber. This makes it obvious whether you're starting a new styleNumber from the preset or layering onto an existing definition.

    Resolution is fully static — no worker round-trip, no extra cache invalidation. Dynamic `styleNumber` (e.g. `styleNumber="$n"`) falls back to the styleNumber=1 preset since the LSP doesn't evaluate macros — same trade-off the issue calls out.

- 7b7a521: Editor: the context-help panel now surfaces the full **Resolved style** breakdown for the active styleNumber, building on the per-attribute "Active default" row added in #1200.

    Triggers:
    - Cursor on the `styleNumber` attribute of a graphical component — the breakdown is filtered to the style key prefixes the component declares (marker* for `<point>`, line* for `<line>` / `<vector>` / `<ray>` / `<lineSegment>` / `<polyline>` / `<parabola>`, line* + fill* for `<polygon>` / `<curve>`). Color attributes for each detected prefix come along even though they're `<styleDefinition>`-only (no per-component override), since the issue asks for "style attributes that are relevant for the component" rather than just the override surface.
    - Cursor on any attribute inside a `<styleDefinition>` — the breakdown lists every populated style key for the active styleNumber, since the author is editing the styleDefinition itself.
    - Cursor on a `<styleDefinition>` tag name itself (opening or closing) — the breakdown is shown alongside the element description, so landing on the tag is as useful as landing on any of its attributes.

    The breakdown reflects ancestor `<styleDefinition>` blocks and runtime per-block derivation (`addMissingChildStyleColorFields` / `deriveMissingStyleWords`), so what the panel shows is what the runtime will render. Color values are paired with their derived word and painted in the resolved color, matching the "Active default" row.

    Resolution remains fully static — no worker round-trip. Dynamic `styleNumber` (e.g. `styleNumber="$n"`) falls back to styleNumber=1, same trade-off the existing active-default surface accepts.

    Closes #1204.

- f16dd18: `<subsetOfRealsInput>` improvements:
    - Propagate the input's `variable` through `extend`. Previously, `<subsetOfReals extend="$input" displayMode="inequalities" />` ignored the input's variable and rendered with the `<subsetOfReals>` default `x`. The `subsetValue` shadowing instructions now include the `variable` attribute, matching the pattern `<mathInput>` uses for its number-display attributes.
    - Hide attributes that the renderer currently ignores from the generated schema (`xMin`, `xMax`, `width`, `height`, `dx`, `xlabel`) via `excludeFromSchema: true` so they no longer appear in autocomplete or auto-generated docs. The attributes remain on the class — this is a documentation/schema cleanup, not a behavior change for documents that already set them.
    - Add the long-missing reference page at `packages/docs-nextra/pages/reference/subsetOfRealsInput.mdx`, with a regression test exercising the variable-shadowing fix and an updated alphabetical-index entry.

- 535c7dd: Surface variant-time validation messages as `info` diagnostics instead of writing them to the browser console. When a document can't compute unique variants (e.g. a `<select>` with `selectWeight` or `selectForVariants`, a `<selectFromSequence>` with non-integer `numToSelect`, or a `requestedVariantIndex` that isn't a finite integer), the explanation now appears in the editor's diagnostics panel and flows through `diagnosticsSummaryCallback` / `setDiagnosticsCallback` like any other info record, rather than being dropped into `console.log` where authors couldn't see it. The `<select>` component's messages also no longer claim to be from `selectFromSequence`.
- 8d5e174: Stop loading the YouTube IFrame API at viewer/editor startup. The `https://www.youtube.com/iframe_api` script is now injected lazily — only when a `<video>` component with a `youtube` attribute actually renders. Documents that contain no YouTube videos make no network request to youtube.com.

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

- 79c7d37: Stabilize `<DoenetEditor>` callback identity. The `doenetmlChangeCallback`, `immediateDoenetmlChangeCallback`, and `documentStructureCallback` props are now routed through ref mirrors, so the editor's internal `useCallback` hooks (and the imperative handle exposed via `ref`) no longer churn when consumers pass inline arrow functions. Also fixes a stale-closure bug where the unmount cleanup could fire the original `doenetmlChangeCallback` instead of the latest one.
- c2248b4: Fix `<video>` with a YouTube source so the player reloads correctly when the YouTube id changes (for example when `youtube` is bound to a `choiceInput` or any reactive value), and so the player initializes once the YouTube IFrame API finishes loading. Previously the new video silently failed to load and stale internal timers could throw against the destroyed player.
- baffc11: Fix Content Security Policy in VS Code extension preview to allow MathJax to render math. Previously, math was displayed as raw LaTeX instead of typeset equations.

## 0.7.16

- Update doenetml version

## v0.7.9

- Update doenetml version

## v0.7.8

- Updates to _doenetToMarkdown_

## v0.7.7

- Update DoenetML to v0.7alpha7
- Add experimental _doenetToMarkdown_ support

## v0.7.6

- Refresh the contents of the preview window when it is first opened.
- Make extension work in Chrome

## v0.7.3

- Add actions to format as XML or DoenetML
- Add configuration option for the default format style
- Add support for document symbols

## v0.7.2

- Working dark mode

## v0.7.1

- Add a button that opens the doenet preview window

## v0.7.0

- Initial release
- Language server and extension run as a web-extension, so the extension should work in the browser as well as on locally installed vscode instances.
