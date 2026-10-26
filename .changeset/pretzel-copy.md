---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<pretzel>` can now be copied with `extend` or `copy`. `<pretzel extend="$p"/>` used to stop the whole document from loading, with `Cannot read properties of undefined (reading 'componentIdx')`. `<pretzel copy="$p"/>`, and a `<section copy="…">` containing a pretzel, showed a pretzel with no problems. Each copy now shows its source's problems in the same order, with the same random choices, and is graded the same way. As with other copies, a copy made with `extend` shares its source's responses, and one made with `copy` has its own.

Closes #2340.
