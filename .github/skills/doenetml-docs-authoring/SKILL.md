---
name: doenetml-docs-authoring
description: Author reference documentation pages for DoenetML components under packages/docs-nextra/pages/reference/ — MDX structure, example fences, the AttrPropDisplay machinery, prose vs example math, and the schema/index files that must be kept in sync.
---

# DoenetML Reference-Docs Authoring Skill

Use this skill when **creating or revising `pages/reference/<slug>.mdx` pages** for DoenetML components, or when retiring an entry from `undocumented-components-allowlist.txt` by writing the missing page.

For writing the DoenetML inside the examples themselves, defer to the [`doenetml-authoring`](../doenetml-authoring/SKILL.md) skill — it owns the rules for what is valid DoenetML. This skill owns the surrounding MDX prose, page layout, and how a new page is wired into the docs site.

## What to read first

1. This file.
2. `../doenetml-authoring/SKILL.md` and its `docs/` (especially `tag-reference.md`) — examples in a docs page must be valid DoenetML.
3. The generated schema: `packages/static-assets/src/generated/doenet-schema.json` — source of truth for a component's attributes, properties, and `docsSlug`.
4. An existing reference page that matches the shape of what you are writing — e.g. `bestFitLine.mdx` (component with attrs+props), `odeSystem.mdx` (block-with-children), `sq.mdx` (tiny markup component), `Sample_Component.mdx` (in-tree template with the three example fence types).

## High-level page anatomy

Every reference page lives at `packages/docs-nextra/pages/reference/<slug>.mdx`. The standard skeleton is:

```mdx
import { DoenetViewer, DoenetEditor, DoenetExample } from "../../components"
import { AttrPropDisplay } from "../../components"


# `<componentName>{:dn}`


One- to three-sentence prose introduction. Mention the component type’s category (e.g. graphical, input, math, sectional), its required children/attributes, and what it produces. Link related components like [`<otherComponent>{:dn}`](otherComponent).

<AttrPropDisplay name='componentName'/>

---

### Example: ...
```doenet-editor-horiz
... DoenetML ...
```

Short paragraph explaining what this example demonstrates.

---

### Attribute Example: <attrName>
```doenet-editor-horiz
... ...
```
One short paragraph explaining the attribute’s effect.

---

### Property Example: <propName>
```doenet-editor-horiz
... ...
```
One short paragraph.
```

Notes:

- The top `# `<name>{:dn}`` heading uses Shiki's `{:dn}` inline-language token so the tag renders in DoenetML colors. Use the same `{:dn}` inside backticks anywhere you mention a tag in prose: `` `<graph>{:dn}` ``.
- The blank line after the H1 (and after the `import` block) is intentional — Nextra/MDX is whitespace-sensitive around JSX blocks.
- `---` horizontal rules separate example sections.
- Example section titles in existing pages follow these conventions: a free-form `### Example: …`, then per-feature `### Attribute Example: <name>` and `### Property Example: <name>` sections that walk one attribute or property at a time. The per-feature sections are the page's "long-form" attribute/property reference; `<AttrPropDisplay>` only gives the short auto-generated table.

## `<AttrPropDisplay>` and friends — auto-generated tables

`packages/docs-nextra/scripts/auto-insert-attr-prop-descriptions.ts` is a remark plugin that, at build time, populates these JSX components from the schema:

- `<AttrPropDisplay name='componentName'/>` — emits an **Attributes and Properties** H2 heading, then both lists (or a "no attributes" / "no properties" message). This is the default for nearly every page. **Do not write the heading by hand**; the plugin inserts it.
- `<AttrDisplay name='componentName'/>` — attributes only.
- `<PropDisplay name='componentName'/>` — properties only.
- `<ComponentDisplay name='componentName'/>` — injects the component's `summary` from the schema.

Because these read from the schema, the only authoring requirement is to keep `componentDocs.summary` and per-attribute/per-property `description` strings populated on the component class (the schema generator hard-fails if any are missing). You do not need to write attribute/property tables by hand.

If a class is missing a `summary` or an attribute is missing a `description`, **fix it in the component source rather than working around it in MDX** — the schema generator will refuse to run otherwise.

## Choosing an example fence

Fenced code-block forms registered in `next.config.mjs`:

| Fence | What it renders | When to use |
| --- | --- | --- |
| ```` ```doenet-editor-horiz ```` | Source on the left, live preview on the right. **Default for reference pages.** | Almost every reference-page example; lets the reader scan source and behavior side-by-side. |
| ```` ```doenet-editor ```` | Source on top, live preview below (stacked). | When the example is tall enough that horizontal split feels cramped. |
| ```` ```doenet-example ```` | Live preview only, source hidden behind a disclosure. | When the source is uninteresting to first-time readers and the visual result is the point (often used for "this is what `<foo>` looks like" demos). |
| ```` ```doenet-viewer ```` | Live preview only, source completely hidden. | Rare — mainly when source is incidental to the point being made. Most pages should let readers see the source. |
| ```` ```doenet ```` | **Source only**, syntax-highlighted. No live preview, no run button. | Showing a snippet the reader is meant to read but not run — e.g. in tutorials when introducing a concept before the full runnable example. Used widely in `pages/tutorials/`. (`` ```dn `` is the same fence via Shiki alias, but the hyphenated form is what existing pages use.) |
| ```` ```math ```` | Display LaTeX via Nextra's KaTeX. | Long display math in prose (e.g. defining the equation a component solves). |

Mechanics: `next.config.mjs` registers four `wrap*` remark plugins (`wrapDoenetEditor`, `wrapDoenetEditorHorizontal`, `wrapDoenetExample`, `wrapDoenetViewer`) that intercept the four hyphenated fence names and wrap them in the live React components. ```` ```doenet ```` has no wrapper — it falls through to Shiki and renders as a static highlighted block. ```` ```doenetml ```` is **not** registered; it would render as an unstyled unknown-language block. Do not use it.

For reference pages, default to ```` ```doenet-editor-horiz ````. Pick a static ```` ```doenet ```` fence only when you specifically don't want the example to be runnable (e.g. illustrating "what this would look like" in prose that already showed a runnable version elsewhere). A bare ```` ``` ```` block (no language) renders as a plain prose-code block — do not use it for DoenetML.

## Verify every example against the schema

Before you consider an example "done", verify that every tag and attribute it uses is in `packages/static-assets/src/generated/doenet-schema.json`. **Do not pattern-match from prior art** — the prior art may itself be wrong, attributes drift, and what reads naturally is not always what the schema allows. The schema is the source of truth.

Concretely: for each `<tag>` inside a fence, look it up in the schema's `elements[]` array and confirm:

- The tag name is an element name in the schema (or is a known composite expanded by the runtime).
- Every `attrName=...` you write is in that element's `attributes[]` list (case-insensitively).
- Every nested `<childTag>` is in that element's `children[]` list, or is a sub-component the parent expands into one (e.g. `<rightHandSide>` inside `<odeSystem>`).

Common confusions worth checking specifically:

- `<graph>` has **no `xLabel` / `yLabel` attributes**. They are *children*: `<xLabel>r</xLabel>`, `<yLabel>x</yLabel>`. Only the position/alignment variants (`xLabelPosition`, `yLabelAlignment`, `yLabelPosition`) are attributes.
- Coordinate attributes on `<graph>` are `xMin` / `xMax` / `yMin` / `yMax` in the schema, but DoenetML attributes are case-insensitive, so `xmin` / `xmax` etc. work and are what existing pages use.
- Tags that *look* like attributes — `xLabel`, `yLabel`, `label`, `shortDescription`, `description` — are children almost everywhere.

A quick local check (good as a CI hook candidate, but useful ad-hoc): parse the fenced blocks, extract `<tag attr="…" attr2="…">` occurrences, and look each one up in `doenet-schema.json`. Respect quoted attribute values so that text like `hide="$n = 1"` is not mis-parsed as containing an `n` attribute.

## DoenetML conventions for examples in docs

Reference pages double as a curriculum for how to write DoenetML well — so example snippets should follow these conventions even when shorter forms also work. (Authoring rules for DoenetML in general live in the `doenetml-authoring` skill; the items below are the ones that come up specifically in reference-page examples.)

1. **Use `<setup>` to hide scaffolding.** Hidden helper components — named `<function>`s, named `<point>`s used only as state, intermediate `<number>`s — go inside a `<setup>` block so they do not visually clutter the rendered output. Components the reader is being asked to look at stay outside `<setup>`.
   ```doenet
   <setup>
     <function name="f" variables="x">1/3 x (3 - x) + x</function>
     <point name="P0" x="-1.5" y="0" />
   </setup>
   <graph>
     ...
   </graph>
   ```

2. **Add `<shortDescription>` to graphs and other visual blocks** so the example also models accessibility. Place it as the first child of the `<graph>`:
   ```doenet
   <graph xmin="-2" xmax="5" ymin="-2.2" ymax="4.5">
     <shortDescription>An interactive cobweb plot</shortDescription>
     ...
   </graph>
   ```

3. **Label every input, and associate the label with its input.** Surrounding prose ("Type _x_: `<mathInput/>`") looks like a label to a sighted reader but does **not** create a programmatic association — screen readers will announce the input as unlabeled. Use one of these forms instead:

   - **`<label>` as a child of the input** (preferred when the input owns its label):
     ```doenet
     <mathInput name="x0" prefill="0.5">
       <label>Enter initial condition <m>x_0</m></label>
     </mathInput>
     ```
   - **`<label for="$inputName">` as a sibling** (when layout requires the label to live elsewhere in the markup):
     ```doenet
     <label for="$x0">Enter initial condition <m>x_0</m></label>
     <mathInput name="x0" prefill="0.5" />
     ```
   - **`<shortDescription>` as a child** — visible only to screen readers — when there is no natural visible label (e.g. one of several anonymous checkboxes in a row, or an input embedded in a sentence where adding a visible label would duplicate the prose):
     ```doenet
     <booleanInput name="b1">
       <shortDescription>Checkbox 1 of 4</shortDescription>
     </booleanInput>
     ```

   Do not leave inputs unlabeled in reference examples — readers copy these patterns into their own pages.

   **The label belongs on the input, not on a wrapping `<answer>{:dn}`.** When an input appears explicitly — either nested inside the `<answer>{:dn}` or referenced into it from outside — put the `<label>{:dn}` or `<shortDescription>{:dn}` inside that input. The only time an `<answer>{:dn}` itself needs a `<label>{:dn}`/`<shortDescription>{:dn}` is when it **sugars in** an implicit input (i.e. there is no explicit `<*Input/>{:dn}` in the source — the answer creates one automatically). If you can see the input element in the source, label the input.

   - Bad (input is explicit, but label is on the answer):
     ```doenet
     <answer>
       <shortDescription>Simplify 2/10</shortDescription>
       <mathInput name="userFraction" prefill=" / " />
       <award>1/5</award>
     </answer>
     ```
   - Good (label moved to the explicit input):
     ```doenet
     <answer>
       <mathInput name="userFraction" prefill=" / ">
         <label>Simplify <m>2/10</m></label>
       </mathInput>
       <award>1/5</award>
     </answer>
     ```
   - Good (answer sugars its own input — no explicit input in the source, so the answer owns the label):
     ```doenet
     <answer>
       <label>What is <m>2 + 2</m>?</label>
       <award>4</award>
     </answer>
     ```

   **`<answer>` with `<award><when>` does not sugar an input — leave it unlabeled.** An `<award>` that contains a `<when>` child evaluates arbitrary boolean logic against existing components; it never causes the parent `<answer>` to create an implicit input. So an `<answer>` whose `<award>`s all use `<when>` neither has an input to label nor sugars one, and putting a `<label>{:dn}`/`<shortDescription>{:dn}` directly on it is redundant. If the example needs a visible prompt (e.g. "Move the point to the first quadrant"), keep that prose as ordinary `<p>{:dn}` text next to the answer, not as the answer's label.

   - Wrong (no input to label, no sugar — the label is redundant):
     ```doenet
     <answer>
       <label>Move the point to the first quadrant.</label>
       <award><when>$P.x > 0 and $P.y > 0</when></award>
     </answer>
     ```
   - Right (prompt is plain prose; the answer carries no label):
     ```doenet
     <p>Move the point to the first quadrant.
       <answer>
         <award><when>$P.x > 0 and $P.y > 0</when></award>
       </answer>
     </p>
     ```

   **When removing a redundant label, check the original.** If the label text was originally instructional prose that *previously lived outside the answer* (and was migrated into the label during an earlier accessibility pass), put that prose back as text outside the answer — don't just delete the prompt. Use `git show <baseline>:<file>` to recover the original wording when in doubt.

4. **Avoid `<asList>`.** It is an obsolete way of rendering an array as a comma-separated list. Array properties (`$ode.rhss`, `$eig.eigenvalues`, etc.) render as a comma-separated list on their own — write `<p>Eigenvalues: $eig.eigenvalues</p>`, not `<p>Eigenvalues: <asList>$eig.eigenvalues</asList></p>`. Many older tests still use `<asList>`; do not mirror that in docs.

5. **Prefer indexed array access over array-entry aliases.** Use `$eig.eigenvalues[1]`, not the entry-prefix alias `$eig.eigenvalue1`. The indexed form is more discoverable, matches how the property is described, and works uniformly for any array property.

6. **Prefer `$ref` to `<tag extend="$ref" />` when nothing else is needed.** Drop the wrapper unless you are *also* (a) giving the new instance a `name`, (b) setting an extra attribute (`displayDigits`, `styleNumber`, …), or (c) the surrounding markup makes a `<tag>` read more naturally than a `$`-reference. `$f` inside a `<graph>` already renders the named function; `<function extend="$f" />` is the verbose form.
   - Bad: `<math extend="$x" />` (no purpose; reduces to `$x`)
   - Good: `<math extend="$x" displayDigits="5" />` (the attr is the reason)
   - Good: `<function name="position" extend="$ode.numericalSolution[1]" />` (the name is the reason)

7. **Use `<matrixInput format="latex" prefill="\begin{matrix}...\end{matrix}">` directly** when capturing a matrix from the user — no need to wrap it with `<math>` to feed downstream components. The `<matrixInput>` value is already usable wherever a math is expected (e.g. as the child of `<eigenDecomposition>`).

8. **Do not draw redundant overlays.** A component that already shows something (e.g. `<cobwebPolyline>` renders the diagonal and reads from the function passed via `function="$f"`) does not need an extra `<line through="(0,0) (1,1)">` or `<function extend="$f" />` next to it. If you find yourself adding shapes that the component owns, remove them.

9. **Keep examples runnable end-to-end.** The reader will press the "run" button. No placeholders, no `// ...`, no examples that depend on imports the page did not show.

10. **Prefer small, single-concept examples.** Each `### Attribute Example:` or `### Property Example:` should isolate one feature. Save the kitchen-sink example for the top of the page where the component is introduced.

## Math in docs: `$…$` in prose, `<m>` only inside example fences

Two math syntaxes, two contexts, no overlap:

| Where | Use | Why |
| --- | --- | --- |
| **MDX prose** (anywhere outside an example fence) | `$1 \pm 2i$` (inline), `$$…$$` (display), or a ```` ```math ```` fenced block | Nextra has `latex: true` in `next.config.mjs`, which adds `remark-math` to the pipeline and renders these via KaTeX. |
| **Inside an example fence** (` ```doenet-editor-horiz `, etc.) | `<m>1 \pm 2i</m>`, `<me>…</me>`, `<md>…</md>` | These are DoenetML components rendered by the live runtime that runs the example. |

**Never use `<m>` (or `<me>` / `<md>` / `<mrow>`) in MDX prose.** `<m>` is only a DoenetML component; outside a fence MDX treats it as an unknown JSX tag and passes its children through as literal text, so `<m>1 \pm 2i</m>` shows the literal characters `1 \pm 2i`. Existing reference pages (e.g. `odeSystem.mdx`) use `$\theta$`, `$\frac{d\theta}{dt}$` in prose for this reason.

KaTeX (via `$…$`) supports the full LaTeX surface docs need: `\pm`, `\theta`, `\frac{a}{b}`, `\ldots`, `\dot x`, `x_{n+1}`, `\begin{matrix} … \end{matrix}`, etc. Braces inside `$…$` are LaTeX, not JS — `remark-math` captures the math node before MDX's JSX expression parser ever runs, so `$x_{n+1}$` is safe with no escaping.

### Other small things

- HTML entities in code: write `&amp;` inside DoenetML examples where LaTeX `&` would otherwise be parsed by surrounding markdown. The `bestFitLine.mdx` and `odeSystem.mdx` examples model this.
- ` `<tag>{:dn}` ` — `{:dn}` is a Shiki language token attached to the surrounding inline code span; it is handled before MDX's JSX parser, so the braces here are safe.
- A bare `{` in MDX prose outside `$…$` and outside inline code is risky (MDX will try to parse `{…}` as a JS expression). Either move it into a code span, into `$…$` if it's math, or rephrase.

When in doubt, run `npm run build -w packages/docs-nextra` on the changed page; unknown component names, malformed `<AttrPropDisplay>`, or stray unescaped braces all fail loudly.

## Integration steps when adding (or renaming) a page

When you add `packages/docs-nextra/pages/reference/<slug>.mdx`, **all four** of the following must be updated in the same change, or CI will fail or the page will be unreachable:

1. **`packages/docs-nextra/pages/reference/_meta.ts`** — add `<slug>: { title: "<slug>" }` in alphabetical order. This drives the left-hand nav. For an existing component documented across multiple pages, the title can be augmented (`"foo (Properties)"`).
2. **`packages/docs-nextra/pages/reference/componentIndex.mdx`** — the alphabetical "all components" table. Replace the existing **unlinked** row (`` `<slug>` ``) for the component with a linked one (`` [`<slug>`](slug) ``) and fill in the description. Sections are A, B, C, D, E, F-G, H-L, M, N-O, P, Q-R, S, T, U-Z.
3. **`packages/docs-nextra/pages/reference/componentTypes.mdx`** — the "by category" table. If the component belongs to one of the named categories (Paragraph markup, Sectional, Input, Graphical, Display Math, Math, Math operator, General operator, Logic, Evaluation, Text), link it there too. If it appears in the existing table as an unlinked row, linkify it; if not, add a row in the appropriate category.
4. **`packages/static-assets/scripts/undocumented-components-allowlist.txt`** — if the component was on the allow-list (because it previously had no docs page), **remove the entry**. The docs-coverage CI check (`npm run check:docs-coverage -w packages/static-assets`) treats redundant allow-list entries as hard errors.

If you also **renamed** a page, the component class's `componentDocs.docsSlug` (in `packages/doenetml-worker-javascript/src/components/...`) may need to be updated to point to the new slug.

## Rebuild the schema after page changes

The generated schema embeds each component's `docsSlug` (which resolves to either the slug string or `null` depending on whether a matching `.mdx` exists on disk at generation time). Adding a new page flips `docsSlug` from `null` to the new slug; renaming flips it the other direction. Run:

```bash
npm run build:schema -w packages/static-assets
```

This rewrites `packages/static-assets/src/generated/doenet-schema.json` (plus the relaxng schema and entity map). Commit the resulting diff; CI compares the checked-in schema against a freshly generated one.

Then verify docs coverage:

```bash
npm run check:docs-coverage -w packages/static-assets
```

Expected output line: `Docs coverage: N schema components; M reference pages; K on allow-list; 0 unresolved.` A non-zero "unresolved" count is a build failure.

## Removing a component from the allow-list

The allow-list `packages/static-assets/scripts/undocumented-components-allowlist.txt` is the source-of-truth for "knowingly undocumented" components. The header comment explains the rules.

When you add docs for a previously-allowlisted component:

1. Write the `.mdx` and wire it into `_meta.ts`, `componentIndex.mdx`, and `componentTypes.mdx` (above).
2. Delete the line for the component from the allow-list. Keep the file alphabetically… ish — it isn't strictly sorted, and conflicts on this file are common, so just remove your line.
3. Rebuild the schema (above) and run the coverage check.

## Linking to other reference pages

Use a relative path with no extension: `` [`<graph>{:dn}`](graph) ``. The page slug is the link target; `_meta.ts` provides the title. For components with multiple pages (e.g. `answer` → `answer1`, `answer2a`, `answer2b`, `answer3`), point at the first/most appropriate page.

Some legacy links use `.mdx` extensions (e.g. `(bestFitLine.mdx)`); both work, but new links should omit the extension for consistency with the rest of the file.

## Verifying a page locally

For a quick check that does not require a full Next.js build:

```bash
npm run check:docs-coverage -w packages/static-assets
```

This catches: missing `.mdx`, obsolete allow-list entries, broken `docsSlug` declarations.

For a full visual / MDX-syntax check:

```bash
npm run build -w packages/docs-nextra
```

This catches: MDX parse errors, broken `import`s, missing schema entries referenced by `<AttrPropDisplay name='…'/>`.

## Quick checklist

Before opening a PR that adds or renames a reference page:

- [ ] `pages/reference/<slug>.mdx` exists and has the standard imports + H1 + `<AttrPropDisplay>` skeleton.
- [ ] All examples use `doenet-editor-horiz` (or a documented alternative) and are valid DoenetML per the `doenetml-authoring` skill.
- [ ] **Every tag and attribute in every example has been looked up in `doenet-schema.json`** — not pattern-matched from other docs. In particular, no `xLabel` / `yLabel` *attributes* on `<graph>` (they are children), and labels/short descriptions are children.
- [ ] Examples follow the conventions: `<setup>`, `<shortDescription>`, labeled inputs, no `<asList>`, indexed array access, no redundant `<tag extend="$x" />`.
- [ ] Math in prose uses `$…$` / `$$…$$` (KaTeX); `<m>` / `<me>` / `<md>` appear only inside example fences.
- [ ] `_meta.ts`, `componentIndex.mdx`, `componentTypes.mdx` updated.
- [ ] Component removed from `undocumented-components-allowlist.txt` if it was on it.
- [ ] `npm run build:schema -w packages/static-assets` run; schema diff committed.
- [ ] `npm run check:docs-coverage -w packages/static-assets` reports `0 unresolved`.
- [ ] `npm run build -w packages/docs-nextra` succeeds (or at least the affected page does).
