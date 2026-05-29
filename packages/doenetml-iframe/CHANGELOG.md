# @doenet/doenetml

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

- e8bf61e: Fix the EditorViewer's context-sensitive help panel intermittently staying on the placeholder text after a programmatic source reset (e.g. when a parent component pushes a new `doenetML` prop and the user immediately interacts). The LSP server's `textDocument/didChange` notification is fire-and-forget, so the editor can send a help RPC before the server has finished populating its `documentInfo` map — the server returns `{kind: "none"}` and the panel never updated. The help handler now retries once after 400 ms when a `none` response lands within 3 s of a source reset; cursor changes, additional source resets, and unmount all invalidate the pending retry.
- cf2b262: Redesign the editor's footer and the diagnostics/responses/help panel.
    - The diagnostics tabstrip and the `Format`/version bar collapse into a single footer row: version on the left, then a `</> Context` help tab, the four diagnostics tabs (errors / warnings / info / accessibility), a submitted-responses tab, and a three-dot menu on the right with `Format as DoenetML` / `Format as XML`.
    - Tabs are now click-to-toggle — click a tab to open the panel on it, click the active tab to close. The close-X is gone.
    - New `showHelp` prop on `DoenetEditor` (default `true`) controls the help tab independently of `showDiagnostics` / `showResponses`.
    - `initialOpenTab` now defaults to opening on the help tab (or the first enabled tab). Pass `initialOpenTab={null}` to mount with the panel closed.
    - The panel opens to ~¼ of the editor height; the virtual keyboard's open-keyboard tab moves to the lower right so it no longer overlaps the footer.

- e8bf61e: Fix the EditorViewer Format button silently doing nothing after an undo or whitespace-only edit. The editor was tracking the user's text in a ref but not in the React `value` state passed to CodeMirror, so once the state drifted from the buffer (e.g., after Ctrl+Z reverted a previous format), formatting again to the same output was an `Object.is` no-op and CodeMirror was never told to update. The format handler now flushes a sync state-to-buffer pass before applying the formatted output, guaranteeing the controlled `value` prop dispatches a real change without re-rendering on every keystroke.
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
- a104621: Fix per-component `fillOpacity` (and `lineWidth`/`lineStyle` on `<parabola>`) having no effect.

    A per-component `fillOpacity` on a filled `<circle>` was ignored — the fill stayed at the styleNumber's default opacity regardless of the attribute, so two circles with very different `fillOpacity` values rendered identically. `<circle>` and `<parabola>` borrow their state-variable definitions straight from `GraphicalComponent` (to skip `<curve>`'s parametric-curve variables), but the borrow ran with the wrong `this`, so their style-override categories (`["line", "fill"]` for circle, `["line"]` for parabola) resolved to an empty set and the overrides never reached `selectedStyle`. The borrow now preserves the leaf component as `this`, so `fillOpacity` on a circle and `lineWidth`/`lineStyle` on a parabola take effect.

- e8bf61e: The "Format DoenetML"/"Format XML" buttons (and the LSP format-on-save) now lay out documents like a standard HTML/XML formatter: block-level elements always sit on their own line, inline elements flow with the surrounding text, and unrelated sibling elements never share a line. Each element's content mode (block, inline, pre) is derived from the component's `InlineComponent` / `BlockComponent` inheritance, emitted into the schema as `layoutCategory`. Blank lines between any two block-adjacent siblings (block↔block, text↔block, block↔text) are preserved and capped uniformly at one. `<pre>` content stays verbatim. Inside `<setup>` and `<moduleAttributes>` — definitional containers with no prose flow — every direct element child gets its own line regardless of inline/block classification, while each child's own internals format normally. Re-running the formatter on its own output is a no-op (idempotence enforced by tests). Closes #1116.
- bf9d59f: Defer `iframeReady` in the iframe-editor/iframe-viewer modules until the standalone bundle has actually defined the render function the parent will subsequently invoke (`window.renderDoenetEditorToContainer` / `window.renderDoenetViewerToContainer`).

    Previously `iframeReady` was sent at module top-level, immediately after `Comlink.expose` and before the separately-loaded ~32 MB standalone bundle had a chance to evaluate. The parent's `iframeReady` listener immediately Comlink-calls `renderEditorWithFunctionProps` (or `renderViewerWithFunctionProps`), which in turn calls the `window.render…ToContainer` function; on a slow boot that threw because the bundle wasn't loaded yet, and the wrapper catches Comlink rejections silently (`.catch(logComlinkError(...))`), so the editor/viewer silently never mounted. Gating `iframeReady` on the postcondition the parent will rely on closes the race.

    The existing `DOMContentLoaded` handler that polled for ~1 s — and whose Editor variant had a Viewer/Editor function-name typo — is replaced by an async IIFE that polls for up to 60 s. The longer window covers slow CI boots of the second iframe document in the wrapper's srcDoc-rebuild path, and matches the test budget in `DoenetEditor.srcDocRebuildReplay.cy.tsx`. If the function never appears within that window the iframe sends the same `{error: "Invalid DoenetML version or DoenetML package not found"}` message it would have before.

- 68bfe0c: Fix iframe-wrapped `<DoenetEditor>` so prop changes no longer reload the iframe and reset editor state. Toggling `readOnly`, `showDiagnostics`, `showResponses`, `width`, and similar serializable props now propagates to the inner editor live via Comlink instead of being baked into a new `srcDoc`. Function-typed props (callbacks) also propagate live: when the parent passes a new closure identity, the iframe is re-pointed at the fresh function. `doenetML` is treated as initial-only after mount — changes are silently ignored so in-progress edits aren't overwritten; consumers wanting to seed a new document should remount via a parent `key=`. In `@doenet/standalone`, `renderDoenetViewerToContainer` and `renderDoenetEditorToContainer` now cache the React root per container so repeat calls re-render in place instead of mounting a competing root.
- a00d136: Fix `dispatcher.getOwner is not a function` when an `@doenet/doenetml-iframe`
  `DoenetEditor`/`DoenetViewer` first renders inside a host React app. The iframe
  package's library build only externalized the exact strings `react` and `react-dom`,
  so the subpaths `react/jsx-runtime`, `react/jsx-dev-runtime`, and `react-dom/client`
  — along with `better-react-mathjax` — were bundled into `dist/component/index.js`.
  The bundled copy carried its own React dispatcher state, conflicting with the host's
  React. The build now externalizes those subpaths and `better-react-mathjax`, so the
  consuming app always supplies a single React instance. `better-react-mathjax` is now
  a peer dependency of the published package.
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

- 6ae802f: Add PreFigure rendering support for `<regionBetweenCurves>`. The region is emitted as a PreFigure `<area-between-curves>` element with `<definition>` elements registering each child function in the PreFigure namespace; previously the component rendered blank under the PreFigure renderer.

    Only formula-typed child functions and unflipped axes are supported in this initial pass. `flipFunctions="true"` and non-formula function children (interpolated, bezier, piecewise) emit a warning and are skipped.

    Closes #1203.

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

- 19905b6: Propagate `styleNumber` from a composite (e.g. `<group>`) to the components it creates, and make the nearest setting win.

    Setting `styleNumber` on a `<group>` previously had no effect on the members inside it — they rendered with the default style — because `styleNumber` only inherited from the rendered parent, and a group's members are reparented out of the group into its container. Members now also fall back to the `styleNumber` of the composite that created them.

    Relatedly, when an attribute can inherit from both a parent and a source composite, the **source composite (the innermost authored wrapper) now wins over the parent**. This makes a `<group styleNumber="4">` behave like the nearest container: in `<graph styleNumber="5"><group styleNumber="4">…</group></graph>` the grouped points are style 4, and a loose point alongside them is style 5 — the same result you get from a `<graph styleNumber="4">` nested in a `<section styleNumber="5">`, so authors don't have to know which components are composites. Extending such a graph (`<graph extend="$g" styleNumber="2" />`) re-resolves each member in its new context: a loose point picks up the new `2`, while grouped points keep the group's `4`.

    An explicit `styleNumber` on a member still wins over everything. The new precedence also applies to the other attributes that already used both fall-backs (`<math>`/`<mathList>` `functionSymbols`, `splitSymbols`, `referencesAreFunctionSymbols`), where a wrapping list composite now likewise takes precedence over a more distant containing element.

- f16dd18: `<subsetOfRealsInput>` improvements:
    - Propagate the input's `variable` through `extend`. Previously, `<subsetOfReals extend="$input" displayMode="inequalities" />` ignored the input's variable and rendered with the `<subsetOfReals>` default `x`. The `subsetValue` shadowing instructions now include the `variable` attribute, matching the pattern `<mathInput>` uses for its number-display attributes.
    - Hide attributes that the renderer currently ignores from the generated schema (`xMin`, `xMax`, `width`, `height`, `dx`, `xlabel`) via `excludeFromSchema: true` so they no longer appear in autocomplete or auto-generated docs. The attributes remain on the class — this is a documentation/schema cleanup, not a behavior change for documents that already set them.
    - Add the long-missing reference page at `packages/docs-nextra/pages/reference/subsetOfRealsInput.mdx`, with a regression test exercising the variable-shadowing fix and an updated alphabetical-index entry.

- 8cde20e: Upgrade `math-expressions` to `2.0.0-alpha93`.

    This adds support for the plus-minus operator: `\pm` in the LaTeX parser and the `±` symbol in the text parser. For example, `<math format="latex">\pm \sqrt{x}</math>` now parses instead of rendering blank.

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
