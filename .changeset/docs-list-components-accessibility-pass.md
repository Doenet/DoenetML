---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add reference documentation pages for `<asList>`, `<convertSetToList>`, `<pointList>`, `<tupleList>`, and `<vectorList>`. Editor context-sensitive help links to these new pages instead of treating them as undocumented.

Documentation pass on the rest of `pages/reference/`: every `<*Input>` now has a programmatic label (a `<label>` child, a sibling `<label for="$name">`, or a `<shortDescription>` for inputs that have no natural visible prompt); every `<graph>`, `<image>`, and `<video>` now has a `<shortDescription>` first child; sugared answers (no explicit `<*Input>` child, no `<award><when>`) get their own `<label>`. The accessibility rules behind these changes are written up in `.github/skills/doenetml-docs-authoring/SKILL.md`.

The List-component docs (`<mathList>`, `<numberList>`, `<textList>`, `<booleanList>`, `<intervalList>`) gained an explicit note that items are separated by **spaces**, not commas. The `asList` attribute's description was corrected from "each on its own line (false)" to "with no separator (false)" across the 21 List/composite source files that share it.
