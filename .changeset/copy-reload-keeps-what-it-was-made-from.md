---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `copy` now shows the same thing after a reload as before it, in two cases where it used to be made again from the document as it was at the reload:

- **A copy written as a different tag**, such as `<point copy="$m"/>` of a math. If the copy was made while the math's value was a tuple, it still shows the point after a reload, even if the value isn't a tuple anymore. If the copy showed nothing, it still shows nothing.
- **A copy of a `<conditionalContent>`**, such as `<group copy="$cc"/>`. It is made again from the case it was made from, with the reader's edits, even when another case is active at the reload. If no case was active when it was made, it still shows nothing.

Saves made before this change don't hold this information, so a copy restored from one of them is made as before.

Closes #2441.
