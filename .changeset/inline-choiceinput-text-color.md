---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Apply each option's style text color in an inline `<choiceInput>`, matching the behavior of a block `<choiceInput>`.

Inline choice inputs render their options through a select dropdown, which previously suppressed the text color from the options' style definitions. The displayed value and the unselected (and focused) menu options now render with their style text colors; the currently selected, dark-highlighted menu option keeps white text for contrast.

Closes #1352.
