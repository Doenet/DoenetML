# PreTeXt vs DoenetML Differences

## Primary Goal

- PreTeXt: multi-format publication of semantically structured educational content.
- DoenetML: interactive web activities with runtime state, validation, and feedback.

## Authoring Style

- PreTeXt: XML document structure and scholarly organization.
- DoenetML: component graph with reactive references and interactive controls.

## References

- PreTeXt: `xml:id` + `<xref ref="..."/>` for robust internal references.
- DoenetML: `name` attributes + `$name` references for reactive data flow.

## Math

- PreTeXt: display/inline presentation math (`<md>`, `<m>`).
- DoenetML: computation-oriented math components (`<math>`, `<mathInput>`) with simplification and validation behavior.

## Assessment

- PreTeXt: authored exercises with optional hint/answer/solution for reading workflows.
- DoenetML: immediate evaluation via `<answer>`, `<award>`, and interactive inputs.

## Media

- PreTeXt: publication-grade figures/tables/listings with strong accessibility expectations.
- DoenetML: interactive graphs/inputs and dynamic components for browser delivery.

## Conversion Warning

When translating content:

- Do not mechanically map DoenetML components into PreTeXt tags.
- Rewrite around semantic pedagogy, narrative, and publishable structure.
