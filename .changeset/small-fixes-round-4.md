---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A section's own number, and small fixes to `<lorem>`, `<variantControl>` and the parser.

- **`ownNumber`, a section's own place as a number (D56).** `$s.ownNumber` is `3` for section 2.3, `2` for the second top-level section, and missing for a section with no number, such as a `<proof>`. Every sectioning component has it (`<section>`, `<problem>`, `<part>`, `<example>`, …), and one numbered as a list item has its number in the list. `sectionNumber` stays the text shown (`"2.3"`), which isn't a number: section 2.10 comes after 2.9. To compare where a section is, write `$s.ownNumber > 2`. A reference to `ownNumber` is checked for cycles at load just as `sectionNumber` is.
- **A `<lorem>` reading the number of a section loads.** `<lorem generateParagraphs="$s.sectionNumber"/>` was a false circular-dependency error (`doenet-e0005`), wherever `s` was. A `<lorem>` now keeps its text until one of its attributes changes value. Before, it made new random text whenever anything it reads was recomputed, and replacing the text caused that recomputation again.
- **`<variantControl numVariants="abc">` is an error at the attribute.** A value that isn't a number fell back to 100 variants, silently. It is now ignored, with a new error (`doenet-e0089`) at the attribute, as an empty `numVariants=""` already is.
- **The parser decodes numeric character references in attribute values.** `numVariants="&#x33;"` and `numVariants="&#51;"` are `3`, as `&#x33;` already was in text. This applies to every attribute. Formatting a document now writes such a reference in an attribute as the character it stands for (`n="&#x33;"` becomes `n="3"`), as it already did for a named entity (`&nbsp;`). A character past U+FFFF (`&#x1F600;`) is now one character, in text too. A `$` written as a reference in an attribute stays text before `(` or `$` too, as it already did before a letter: `&#36;(x)` and `&dollar;(x)` are the text `$(x)`, not a reference to `x` (`&dollar;(x)` was one before).
- **A reference to a `<variantControl>` says what is wrong.** A `<variantControl>` shows nothing and has no properties. `$vc.numVariants` said "No referent found", though `vc` exists, and `<p>$vc</p>` said the `<p>` has invalid children. `$vc` where a `<variantControl>` can be written made another one, which was ignored, silently. Each now names nothing, with a new warning (`doenet-w0199`) saying that a `<variantControl>` shows nothing and has no properties, and, for `$vc.numVariants`, that `numVariants` is one of its attributes. A tag made from one of its properties (`<number extend="$vc.numVariants"/>`) is missing, with the same warning.

A `<fractionInput>` made from a property of another (`<fractionInput extend="$g.value"/>`) is now pinned by tests. It is an error (`doenet-e0062`) suggesting `bindValueTo`, as a `<mathInput>` made from any math is, rather than an input with no boxes.

Part of #2509 (PR 39). Closes items 3–7 and 9 of #2623.
