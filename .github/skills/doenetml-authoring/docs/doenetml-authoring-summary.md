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
- Do not extend an array/list state variable with a scalar component. Match the extend tag to the type — `<mathList extend="$x.someList"/>` for a list of maths, not `<math extend="$x.someList"/>`. Same for `<textList>`, `<numberList>`, `<vectorList>`, `<booleanList>`, `<pointList>`.
- Do not chain references across component boundaries. `$user.value.latex` does not work — `.value` produces a fresh `<math>` and the resolver does not then dereference its `.latex`. If you need this, name the intermediate (`<math name="userMath" extend="$user.value"/>`, then `$userMath.latex`). Index chains within one array state variable's `indexAliases` (`$myLine.points[1].x`, `$myVector.head.x`) do work.
- Do not say "macro" — the `$foo` mechanism is a *reference*.

## Pre-Delivery Self-Check

- Confirm every `$name` reference resolves to an existing named component.
- Confirm each graded interaction has explicit `<answer>` validation logic.
- Confirm markup is well formed and all tags are closed.
- Confirm math intent is correct: `<math>` computes, `<m>`/`<md>` renders.
