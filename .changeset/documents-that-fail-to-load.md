---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Three documents that failed to load, or a core that threw, now work (DIAG-5).

- **A composite after a section can read the section's number.** `<section name="s">…</section><sequence to="$s.sectionNumber"/>` failed with a circular dependency, as did `<selectRandomNumbers>` and `<option selectWeight>` reading `$s.sectionNumber`. A section's number now depends only on what comes before it, so it is known before a composite after it expands. The same holds for a `<part>` in a `<problem>`, a `<problem>` in `<problems>`, and a section in a list item. A copy given a type that can't be counted among the sections, such as `<text extend="$s.sectionNumber"/>` written before `s`, can read that number too.
- **A document with millions of unique variants loads in any variant.** A `<select>` of 9 beside a `<selectFromSequence to="100" numToSelect="3"/>` (8,731,800 unique variants) ran out of memory in variant 2, whose unique variant is far into that list. Each variant is now worked out directly, and is the same one as before.
- **An `<updateValue>` that sends a `<textInput>` something other than text no longer crashes.** `newValue` is read as a math unless `type` says otherwise, and the text input stored the math as its value, so reading its words threw. So did `type="number"` or `type="boolean"`. A `<textInput>` or `<codeEditor>` now stays unchanged when sent anything but text, as a `<text>` written with content does; write `type="text"` to set its text.
