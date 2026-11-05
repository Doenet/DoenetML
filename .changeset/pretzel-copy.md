---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<pretzel>` can now be copied with `extend` or `copy`. `<pretzel extend="$p"/>` used to stop the whole document from loading, with `Cannot read properties of undefined (reading 'componentIdx')`. `<pretzel copy="$p"/>`, and a `<section copy="…">` containing a pretzel, showed a pretzel with no problems. Each copy now shows its source's problems in the same order, with the same random choices, and is graded the same way. As with other copies, a copy made with `extend` shares its source's responses, and one made with `copy` has its own.

A `<pretzel copy>` can also be given problems of its own, or a `mode`, and arranges all of its problems together in that mode, keeping its source's random choices and making new ones for the problems added to it. With added problems, which change the correct answers, or a source order its mode does not allow, it arranges the problems in a new order. A `<pretzel extend>` ignores problems or a `mode` given to it, with a warning: `A <pretzel> that extends another shows the same problems in the same mode, so the problems or mode given to it are ignored. To add problems or change the mode, use copy instead of extend.`

Closes #2340.
