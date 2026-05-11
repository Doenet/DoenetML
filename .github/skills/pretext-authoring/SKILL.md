---
name: pretext-authoring
description: Write and revise PreTeXt documents using the official guide, with explicit guardrails for how PreTeXt differs from DoenetML.
---

# PreTeXt Authoring Skill

Use this skill when creating or editing PreTeXt source files (`.ptx` / XML) for books, articles, and static course materials.

## What To Read First

1. `docs/pretext-guide-summary.md`
2. `docs/tag-reference.md`
3. `docs/pretext-vs-doenetml-differences.md`
4. `docs/pretext-do-dont-checklist.md`
5. `docs/sources.md` (for canonical guide URLs)

## Core Instructions

1. Author semantically, not visually. Prefer PreTeXt structural elements (`<section>`, `<theorem>`, `<example>`, `<exercise>`) over ad hoc formatting.
2. Keep document hierarchy valid. Do not skip levels in sectioning.
3. Use stable, descriptive `xml:id` values on divisions and referenceable elements.
4. Use `<xref ref="..."/>` for internal references rather than hardcoded labels/numbers.
5. For math, use `<m>` (inline) and `<md>` (display), with MathJax-compatible LaTeX.
6. For figures/images, include accessibility text (`<shortdescription>` and/or `<description>`).
7. For exercises, use structured children (`<statement>`, optional `<hint>`, `<answer>`, `<solution>`).
8. Keep output goals in mind: PreTeXt targets multi-format publishing (HTML/PDF/other), not client-side reactive state.

## High-Risk Mistakes To Prevent

1. Do not confuse PreTeXt `<answer>` (authored exercise content) with DoenetML runtime answer validation. In PreTeXt, `<answer>` is not a live grading rule.
2. Do not invent hybrid markup. Never introduce DoenetML-only patterns such as `$name`, `name="..."` reactive data flow, `<mathInput>`, `<award>`, or live graph-interaction logic in PreTeXt source.
3. Do not hardcode figure/equation/section numbers. Use `xml:id` + `<xref ref="..."/>`.
4. Do not skip hierarchy levels or omit required titles in divisions.
5. Do not leave media inaccessible. If an image is instructional (not purely decorative), include `<shortdescription>` and/or `<description>`.

## Difference Emphasis (PreTeXt vs DoenetML)

1. PreTeXt is publication-first, static-semantic XML with strong cross-referencing and backmatter.
2. DoenetML is interaction-first with reactive components, immediate answer validation, and live graph/input state.
3. Do not port DoenetML idioms like `$name` reactive references, `<answer>` scoring logic, or live graph manipulation into PreTeXt source.
4. When converting from DoenetML, rewrite into narrative + structured exercises/proofs/examples instead of reproducing app-like behavior.

## Minimal Document Example

Use this as a minimal PreTeXt starting point for a short article with one section and one inline math expression.

```xml
<pretext>
	<article xml:id="mini-article">
		<title>Minimal PreTeXt Example</title>

		<section xml:id="intro">
			<title>Introduction</title>
			<p>This is a minimal PreTeXt document with inline math <m>x+1</m>.</p>
		</section>
	</article>
</pretext>
```

## Output Requirements

When asked to author PreTeXt, provide:

1. Valid XML snippets with correct nesting.
2. Explicit `xml:id` values where needed.
3. Accessibility-aware media markup.
4. Notes about assumptions if target publication pipeline details are unknown.
5. A short self-check list in the response confirming: no DoenetML-only tags were used, no hardcoded numbering was introduced, and references are xref-based.

## Pre-Delivery Self-Check

1. Confirm every internal reference uses `<xref ref="..."/>` and the referenced `xml:id` exists.
2. Confirm no DoenetML runtime constructs appear in the snippet.
3. Confirm nesting is valid XML and the section hierarchy was not skipped.
4. Confirm math is in `<m>`/`<md>` rather than plain text.
