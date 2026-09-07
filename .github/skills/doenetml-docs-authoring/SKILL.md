---
name: doenetml-docs-authoring
description: Author DoenetML documentation under packages/docs-nextra/ within the Diátaxis framework (Tutorials, Guides/how-to, Reference, Concepts/explanation) — which section a page belongs in, the concept↔guide split pattern, MDX structure, example fences, the AttrPropDisplay machinery, prose vs example math, and the schema/index files that reference pages must keep in sync.
---

# DoenetML Reference-Docs Authoring Skill

Use this skill when **creating or revising `pages/reference/<slug>.mdx` pages** for DoenetML components, or when retiring an entry from `undocumented-components-allowlist.txt` by writing the missing page.

For writing the DoenetML inside the examples themselves, defer to the [`doenetml-authoring`](../doenetml-authoring/SKILL.md) skill — it owns the rules for what is valid DoenetML. This skill owns the surrounding MDX prose, page layout, and how a new page is wired into the docs site.

## Documentation framework: Diátaxis

The DoenetML docs are migrating to the [Diátaxis](https://diataxis.fr/) framework, which sorts every page into one of four modes by the reader's need. The site's top-level sections map onto the four modes:

| Diátaxis mode | Reader need | Site section | Folder |
| --- | --- | --- | --- |
| **Tutorial** | "teach me — I'm learning" | Tutorials | `pages/tutorials/` |
| **How-to guide** | "help me accomplish a task" | Guides | `pages/guides/` |
| **Reference** | "tell me the facts" — **this skill** | Reference | `pages/reference/` |
| **Explanation / Concepts** | "help me understand why" | Concepts | `pages/concepts/` |

The **Concepts** section is the Explanation quadrant. It was created by renaming the former "Document Structure" section: the folder is `pages/concepts/` and the sidebar title is "Concepts", with a subheading (in `pages/index.mdx`) that emphasizes explanation — the ideas and the *why*, not document layout. The goal of the migration is to have a clean four-mode skeleton so the team can write many more Concept and Guide pages against a consistent pattern; today those two sections are still thin.

### Picking the right home for a page

- **Reference** (`pages/reference/`, this skill) — complete, dry facts about one component: attributes, properties, small per-feature examples. Looked up, not read through.
- **How-to guide** (`pages/guides/`) — a single task the reader wants to accomplish ("style components", "validate an answer", "control credit awarded"). Imperative, recipe-shaped, assumes the reader already knows the basics. The task-oriented pages that used to sit under "Document Structure" (answer validation, controlling credit, advanced examples) belong here.
- **Concept / Explanation** (`pages/concepts/`) — understanding-oriented prose: the model behind a feature, the reasons for a design, the trade-offs. No step-by-step recipes; link out to a guide for those. Current Concepts pages: `essentialConcepts` (how DoenetML works — the component model), `references` (what a reference is and how it resolves), `styling` (how styling works), and the `documentStructure` stub to be built out.
- **Tutorial** (`pages/tutorials/`) — a guided, start-to-finish learning experience.

A quick test for where a draft belongs: a numbered list of steps → **guide**; "here's the model / here's why" → **concept**; "every attribute of `<x>`" → **reference**; "follow along and build this" → **tutorial**.

### The concept ↔ guide split (the pattern to follow)

When a topic mixes the *why* and the *how*, split it into a **concept page** (`pages/concepts/`) and a **how-to guide** (`pages/guides/`) that cross-link each other, rather than one page that tries to do both. The styling docs are the worked exemplar of this split:

- `pages/concepts/styling.mdx` — "Styling, meaning, and accessibility": the *why*. A style number is a statement of meaning ("these are importantly different"); encoding distinctions that way is what lets Doenet adapt them to each reader (the accessibility argument); hence you can't paint a color directly, and a semantic component is better still when a distinction has a name. Note what this page deliberately leaves out: the *mechanics* (the layering, the cascade, precedence) are how-it-works, so they live in the guide, not here. Explanation pages answer "why is it like this", not "how do I operate it".
- `pages/guides/styling-components.mdx` — "Styling Components": the task recipes (set `styleNumber`, override a width, redefine a color, scope to a section), each linking back to the concept page for the reasoning.

Cross-link in **both** directions: the guide points to the concept page for "why this works", and the concept page points to the guide for "how to do it". Use relative links with no extension and an anchor slug to the relevant heading — e.g. `../concepts/styling#why-you-cant-set-a-color-directly-on-a-component` or `../guides/styling-components#redefine-a-style-and-change-colors`. (Nextra auto-generates a heading's anchor by lowercasing, dropping punctuation, and hyphenating spaces — confirm the slug matches the target heading.)

### Wiring up a Concept or Guide page

New Concept and Guide pages are registered in their section's `_meta.ts` exactly like reference pages: the file's base name is the key, and the value is the sidebar title (or `{ name, display: "hidden" }` to stage a draft). The schema, `componentIndex`/`componentTypes`, allow-list, and `build:schema` steps later in this skill are **Reference-only** — Concept/Guide pages have none of that machinery, so adding one is just the `.mdx` plus its `_meta.ts` entry. The author-facing voice rules below apply to all four modes.

If you move or rename a page that already has a public URL (the docs deploy as a static export to GitHub Pages, which can't do server-side redirects), add a meta-refresh stub at `packages/docs-nextra/public/<old-path>.html` pointing at the new path — see the existing stubs in `packages/docs-nextra/public/document_structure/` for the template (they preserve the URL `#hash` so old anchored links still land).

## What to read first

1. This file.
2. `../doenetml-authoring/SKILL.md` and its `docs/` (especially `tag-reference.md`) — examples in a docs page must be valid DoenetML.
3. The generated schema: `packages/static-assets/src/generated/doenet-schema.json` — source of truth for a component's attributes, properties, and `docsSlug`.
4. An existing reference page that matches the shape of what you are writing — e.g. `bestFitLine.mdx` (component with attrs+props), `odeSystem.mdx` (block-with-children), `sq.mdx` (tiny markup component), `Sample_Component.mdx` (in-tree template with the three example fence types).

## Audience and voice

These pages are for **authors writing DoenetML activities**, not for developers working on the DoenetML implementation. Prose and examples should help an author predict, observe, and use a component's behavior from the outside.

Do not, in author-facing prose:

- Reference source files, function names, line numbers, or commit/PR numbers (`SubsetOfRealsInput.js:6`, `variants.ts:459`, `BaseComponent.determineNumberOfUniqueVariants`, etc.). The author has no reason to look there and the citation will go stale.
- Name internal data structures, state-variable identifiers that aren't exposed as author-facing properties, or framework helpers (`shadowingInstructions`, `returnDependencies`, `componentInfoObjects`). If a behavior emerges from one of these and the author needs to know about it, describe the behavior in terms the author can observe.
- Walk through algorithms ("the resolver does X, then checks Y, then falls back to Z"). Authors care about the *resulting behavior*, not the steps. State the rule and one or two concrete consequences.
- Use compiler/runtime jargon like **"sugar" / "sugared" / "desugars"** to explain how the runtime transforms author input. Authors don't write the underlying form, so the rewrite is invisible to them; describe the author-facing behavior instead. (E.g. "`<column>` inside a `<matrix>` defines a column of math values" — not "`<column>` is sugared into `<matrixColumn>`".) Other internal-process verbs to avoid in the same spirit: "lowers", "expands to", "rewritten to", "transpiles to".
- Name **alias-only componentTypes that authors never write directly** (`matrixRow`, `matrixColumn`, `<_repeatSetup>`, `<_placeholder>`, anything prefixed with `_`). These exist only as internal targets for the runtime's transformations. From the author's perspective the tag they wrote (e.g. `<row>` inside a `<matrix>`) is the only thing that exists; the alias name should never appear in reference prose. (Editor help and the schema's `aliasedElements` use these names — that's a developer-facing surface, not an author-facing one.)

It is fine — and often necessary — to mention attribute names, child-tag names, property names, and other surface-API identifiers. Those *are* the author-facing surface. The line to hold is roughly: "what would an author see by experimenting" vs "how is it implemented".

Source-code references *are* appropriate in: PR descriptions, GitHub issue bodies, code comments, and skill/contributor docs like this file. Just not in `pages/reference/*.mdx`.

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

Because these read from the schema, you do not write attribute/property tables by hand. Two things must be right on the component class, and only the first is enforced: every `componentDocs.summary` and every per-attribute/per-property `description` must be populated (the schema generator hard-fails if any are missing), and the **`highlighted` and `groupName` flags must be chosen** (nothing checks these at all — see below).

If a class is missing a `summary` or an attribute is missing a `description`, **fix it in the component source rather than working around it in MDX** — the schema generator will refuse to run otherwise.

### `highlighted` and `groupName` — what the reader sees first

**This is the half of the table nothing enforces, so it is the half that goes wrong.** The schema generator refuses to run over a missing `description`, and is silent about a component whose every attribute is unflagged — that page builds, passes CI, and renders as a wall of closed sections.

`<AttrPropDisplay>` sorts items into four sections (`components/props-display.tsx`): **Highlighted** (`highlighted: true`), then **functional groups** (by `groupName`), then **Other** (neither), then **Common to all components**. Only Highlighted is open by default, so a component with nothing highlighted shows the reader nothing.

**Highlight the few attributes that decide what the component does** — the ones an author reaches for on purpose, the ones the page's own examples demonstrate. Usually not the formatting knobs shared across many components: the five `returnNumberDisplayAttributes()` attributes are grouped as `number-display`, and shape how a number is written rather than what the component computes. `<math>` highlights `displayDigits` on purpose — how a math renders is part of what it is — but everything inheriting `<math>`'s attributes inherits that too, which is rarely deliberate, so most components carrying it never chose it. That is the trap described below, not a precedent to copy.

**`groupName` is a separate decision, and the vocabulary is open.** It is a free string that nothing validates; the renderer falls back with `GROUP_LABELS[groupName] ?? groupName`, so an unrecognized group renders with its raw name as the heading. `GROUP_ORDER` in `props-display.tsx` is a sort order and label registry, not a whitelist — read it for the current names (`sorting`, `number-display`, `labels`, `positioning`, `styling`, `answer-grading`, `scoring`, `triggering`).

Those existing groups are assigned almost entirely by *shared attribute helpers* rather than by components, which is why they look like a uniform taxonomy. The consequence to carry into a new component: **what it inherits arrives grouped and flagged; what it declares itself arrives bare.** If its own attributes form a real family, name a group for them — but do not stretch an existing name to cover something it does not describe, since a misleading heading is worse than "Other".

A name absent from `GROUP_ORDER` sorts *after* every name in it, so register a new one there too; `sorting`, declared in `Sort.js` for that component's own attributes, sits first. This matters less than it looks: every group section is closed, so their order decides which closed heading sits highest, not what anyone sees. **Prominence is `highlighted`'s job** — and an item can be both, appearing in Highlighted *and* in its group.

**Properties are highlighted independently of attributes.** A public state variable definition takes `highlighted: true` exactly as an attribute does — `<argMin>`'s `value` is highlighted with no attribute behind it. Where a component's output *is* its properties, highlight them all: `<summaryStatistics>` highlights its twelve statistics.

**Inherited flags must be actively switched off.** `super.createAttributesObject()` hands down the parent's attribute objects with their flags intact, so a subclass inherits a highlight set chosen for a different component while its own attributes arrive unflagged — the page then opens on the parent's concerns and hides the child's. The repository's idiom is a destructuring strip, in `abstract/ListIndexBaseOperator.js`:

```js
// `<math>` highlights these because they shape the expression it parses and
// renders. The value here is an integer index, so they are beside the point.
for (const attrName of ["format", "simplify", "displayDigits"]) {
    if (attributes[attrName]) {
        const { highlighted: _highlighted, ...rest } = attributes[attrName];
        attributes[attrName] = rest;
    }
}
```

`highlighted: false` works too (the generator copies the flag unless it is `undefined`); the strip just leaves nothing in the schema. Turning one *on* is the plain mutation, as `Math.js` does with `displayDigits`.

Note those three attribute names. `format`, `simplify` and `displayDigits` are `<math>`'s highlighted set, and are the inherited trio most likely to be wrong on anything that computes *with* maths rather than rendering one — check them first when extending something math-derived. `<round>` shipped carrying them: its own `numDecimals` and `numDigits` sat in the closed "Other" section while the page opened on `<math>`'s three, so an author looking for how many digits to round to met the *display* attribute and not the rounding one. That is worse than an unflagged page, because it looks curated. An inherited set is invisible when reading the subclass — it shows only in the rendered page or the schema.

**Check it before opening a PR**, since no build step will:

```bash
npm run build:schema -w @doenet/static-assets
python3 -c "
import json,io
d=json.load(io.open('packages/static-assets/src/generated/doenet-schema.json',encoding='utf-8'))
for e in d['elements']:
    if e['name']=='<componentName>':
        print([a['name'] for a in e.get('attributes',[]) if a.get('highlighted')])
        print([p['name'] for p in e.get('properties',[]) if p.get('highlighted')])
"
```

Empty lists mean the page opens closed. Read the result against the page's own examples: an attribute worth an `### Attribute Example:` section is almost always worth highlighting.

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

> **Tests are not a style guide.** When looking up usage patterns for a component (e.g. browsing `packages/doenetml-worker-javascript/src/test/tagSpecific/*.test.ts`), expect the test DoenetML to omit accessibility annotations — tests are written for brevity and verify behavior, not accessibility. Typical test idioms you will see and **must rewrite** for a docs example:
>
> - `<graph>...</graph>` with no `<shortDescription>` — add one.
> - `<mathInput name="..." />` with no `<label>` or `<shortDescription>` — add one.
> - `<p>What is <m>1+1</m>? <answer>2</answer></p>` — the `<answer>` sugars a `<mathInput>` and has no label. Move the prompt **into** the answer as `<answer><label>What is <m>1+1</m>?</label>2</answer>`.
> - `<answer name="ans"><label>...</label><mathInput name="mi"/><award>...</award></answer>` — the label is on the wrapper instead of on the explicit input. Move it onto the `<mathInput>{:dn}`.
>
> The accessibility rules below (rules 2–3) are **not optional** for reference-page examples. WCAG-failing patterns from tests must be fixed before a doc example is considered done; the [Quick checklist](#quick-checklist) treats this as a blocking item.

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

- **Call `$foo` a "reference", not a "macro".** "Macro" was the older term for the `$ref` substitution mechanism; it has been retired. Write "the `$foo` reference is replaced with …", not "the `$foo` macro …". Older docs that still say "macro" should be updated when you touch them.
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
- [ ] **Accessibility sweep of every example** (separate, blocking step — *not* satisfied by copying test code): every `<graph>` has a `<shortDescription>`; every input-creating tag (`<mathInput>`, `<textInput>`, `<booleanInput>`, `<choiceInput>`, `<matrixInput>`, `<subsetOfRealsInput>`, `<orbitalDiagramInput>`, `<slider>`, …) has a `<label>` or `<shortDescription>`; every `<answer>` that sugars an input (no explicit `<*Input>` child and not just `<award><when>`) has a `<label>` *inside* the answer; every `<answer>` that has an explicit `<*Input>` child has the `<label>` on the input, not on the answer.
- [ ] Math in prose uses `$…$` / `$$…$$` (KaTeX); `<m>` / `<me>` / `<md>` appear only inside example fences.
- [ ] `_meta.ts`, `componentIndex.mdx`, `componentTypes.mdx` updated.
- [ ] Component removed from `undocumented-components-allowlist.txt` if it was on it.
- [ ] `npm run build:schema -w packages/static-assets` run; schema diff committed.
- [ ] `npm run check:docs-coverage -w packages/static-assets` reports `0 unresolved`.
- [ ] `npm run build -w packages/docs-nextra` succeeds (or at least the affected page does).
