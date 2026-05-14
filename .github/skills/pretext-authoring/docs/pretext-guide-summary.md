# PreTeXt Guide Summary

## Authoring Model

- PreTeXt is semantic XML for long-form educational publishing.
- Focus is structural meaning (theorem, proof, exercise, figure) rather than interactive runtime behavior.
- Content is transformed into formats such as HTML and PDF.

## Structure

- Use clear hierarchy (`part` -> `chapter` -> `section` -> `subsection` ...).
- Include `<title>` in divisions.
- Use `<frontmatter>` and `<backmatter>` where appropriate.

## Mathematics

- Inline math: `<m>`.
- Display math: `<md>`.
- Prefer MathJax-compatible LaTeX syntax.

## Cross References

- Add stable `xml:id` values to referenceable elements.
- Use `<xref ref="..."/>` instead of hardcoded numbering.

## Exercises

- Typical structure: `<exercise>` with `<statement>` and optional `<hint>`, `<answer>`, `<solution>`.
- Keep prompts and solution components semantically separated.

## Media and Accessibility

- Place images in semantic containers such as figures when appropriate.
- Provide `<shortdescription>` and/or `<description>` for non-decorative visual media.
- Avoid communication that depends only on color.

## Validation and Build

- Validate against PreTeXt schema and related validation tooling.
- Keep markup strict and well-nested.

## Common Pitfalls

- Skipping section hierarchy levels.
- Hardcoding labels instead of xrefs.
- Missing media descriptions.
- Writing presentational XML instead of semantic XML.

## High-Risk Mistakes To Prevent

- Do not treat PreTeXt `<answer>` as runtime grading logic. In PreTeXt it is authored content, not live validation.
- Do not mix DoenetML-only constructs into PreTeXt (`$name`, `<mathInput>`, `<award>`, reactive graph logic).
- Do not hardcode figure/equation/section numbering.
- Do not omit required titles or skip structure levels.

## Pre-Delivery Self-Check

- Confirm all internal references use `<xref ref="..."/>` and resolve to existing ids.
- Confirm no DoenetML-only runtime tags or patterns are present.
- Confirm XML nesting is valid and hierarchy levels are not skipped.
- Confirm math is authored in `<m>` and `<md>` where appropriate.
