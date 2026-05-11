---
name: doenetml-authoring
description: Write and revise DoenetML activities using docs-nextra patterns, with explicit guardrails for how DoenetML differs from PreTeXt.
---

# DoenetML Authoring Skill

Use this skill when creating or editing DoenetML content for interactive browser-based activities.

## What To Read First

1. `docs/doenetml-authoring-summary.md`
2. `docs/tag-reference.md`
3. `docs/doenetml-vs-pretext-differences.md`
4. `docs/doenetml-do-dont-checklist.md`
5. `docs/sources.md`

## Core Instructions

1. Write with interactive intent: inputs, feedback, dynamic math, and reactive state.
2. Use component names (`name="..."`) whenever values are reused.
3. Reference named components via `$name` (and properties like `$point1.x`) for reactivity.
4. Use `<answer>` patterns appropriate to validation goals (symbolic, numeric, logic-based awards).
5. Use `<math>` for stored/computed expressions and `<m>`/`<md>` for rendered math display.
6. Keep graphs meaningful and accessible (include labels/short descriptions where relevant).
7. Keep examples runnable and minimal; favor clear, testable snippets.

## High-Risk Mistakes To Prevent

1. Do not mix PreTeXt reference patterns (`xml:id`, `<xref ref="..."/>`) into DoenetML logic. Use DoenetML naming and referencing patterns instead.
2. Do not treat `<m>`/`<md>` as computation containers. Use `<math>` for computation/state and `<m>`/`<md>` for presentation.
3. Do not forget explicit answer logic. If an item is graded, include clear `<answer>` logic and any needed nested awards/conditions.
4. Do not leave reused values unnamed. Missing `name` attributes are a common source of broken `$name` references.
5. Do not ship inaccessible graph interactions. Include labels/descriptions and avoid color-only distinctions.
6. Do not produce non-runnable snippets with dangling references or missing closing tags.

## Difference Emphasis (DoenetML vs PreTeXt)

1. DoenetML is runtime-interactive and stateful; PreTeXt is semantic-publication XML.
2. DoenetML relies on reactive references and validation components; PreTeXt relies on structure, narrative, and cross-reference systems.
3. Do not force PreTeXt-specific constructs (like publication backmatter workflows) into core DoenetML activity logic.
4. When converting from PreTeXt, preserve pedagogy but redesign around immediate feedback and interaction.

## Minimal Document Example

Use this as a minimal DoenetML starting point for a single auto-checked prompt.

```xml
<p><m>7x + 3x = </m><answer>10x</answer></p>
```

## Output Requirements

When asked to author DoenetML, provide:

1. Valid component markup with properly closed tags.
2. Named components for reused values.
3. Clear answer validation and feedback logic.
4. Concise notes on assumptions (for grading tolerance, simplification mode, or expected interaction behavior).
5. A short self-check list in the response confirming: all `$name` references resolve, tags are properly closed, and graded prompts include explicit validation logic.

## Pre-Delivery Self-Check

1. Confirm every `$name` reference points to an existing named component.
2. Confirm each graded interaction has explicit validation logic.
3. Confirm markup is well-formed XML-like syntax (all tags closed, no malformed nesting).
4. Confirm math intent is correct: `<math>` for computation, `<m>`/`<md>` for rendering.
