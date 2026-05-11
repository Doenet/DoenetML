# PreTeXt Do and Don't Checklist

## Do

- Use semantic elements (`<definition>`, `<theorem>`, `<proof>`, `<example>`, `<exercise>`).
- Add stable `xml:id` values for divisions and references.
- Use `<xref>` for references.
- Keep math in `<m>` and `<md>`.
- Include accessibility descriptions for visual media.
- Keep structure strict and valid XML.
- Verify references resolve before delivery.

## Don't

- Don't hardcode section/equation/figure numbers.
- Don't skip hierarchy levels.
- Don't rely on visual formatting instead of semantic tags.
- Don't omit media descriptions.
- Don't inject DoenetML runtime idioms (`$name`, reactive scoring) into PreTeXt.
- Don't assume PreTeXt `<answer>` behaves like DoenetML live grading.

## Final Check Before Sending

- All xrefs are id-based and not hardcoded labels.
- No DoenetML runtime constructs appear in the snippet.
- XML is well formed and hierarchy is valid.
- Accessibility text exists for instructional images.
