# DoenetML Authoring Summary

## Authoring Model

- DoenetML is a component-based language for interactive educational web content.
- It emphasizes user input, reactive updates, and immediate validation/feedback.

## Structure and Components

- Tags are XML-like and must be properly nested and closed.
- Common components include `<math>`, `<m>`, `<md>`, `<mathInput>`, `<textInput>`, `<answer>`, `<award>`, `<graph>`, `<point>`, and section/problem containers.

## Reactive Referencing

- Name reusable components with `name="..."`.
- Reference values with `$name` and component properties (for example, `$point1.x`).
- Use reactive expressions to keep text, math, and feedback synchronized with student actions.

## Math and Validation

- Use `<math>` for symbolic/numeric expressions and computations.
- Use `format` and `simplify` attributes intentionally.
- Use `<answer>` with awards/conditions to express correctness logic.

## Graphing and Interaction

- Use graph containers with appropriate axis settings and labels.
- Connect graph objects to named values for dynamic behavior.
- Provide accessible descriptions and avoid color-only distinctions.

## Authoring Practices

- Prefer small, testable examples.
- Keep feedback near the interaction it evaluates.
- Avoid overly dense single expressions; split logic into named components.

## High-Risk Mistakes To Prevent

- Do not mix PreTeXt reference patterns (`xml:id`, `<xref ref="..."/>`) into DoenetML runtime logic.
- Do not use `<m>` or `<md>` as computation containers; use `<math>` for computation/state.
- Do not omit explicit validation logic for graded prompts.
- Do not leave reused components unnamed when they are referenced later.
- Do not ship snippets with unresolved `$name` references or malformed nesting.

## Pre-Delivery Self-Check

- Confirm every `$name` reference resolves to an existing named component.
- Confirm each graded interaction has explicit `<answer>` validation logic.
- Confirm markup is well formed and all tags are closed.
- Confirm math intent is correct: `<math>` computes, `<m>`/`<md>` renders.
