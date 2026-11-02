---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A diagnostic caused by a value that can change now appears and goes away with its cause, instead of staying once reported. The info for an `extend` written as a different tag than content made as the document runs (such as `<text extend="$cc"/>` while the active case holds a point) goes away once the content matches again, and comes back if it stops matching: there is one of it while the mismatch lasts, naming the value as it is now, rather than one more each time it starts or the value changes. It is also withdrawn while the `extend` is inside content that isn't shown, such as a case that isn't chosen, or once the `extend` is removed. The warning for an index into a math whose value is a single expression (`$m[2]`) now follows the value too: it goes away once the value is a tuple, and is reported when a value that was a tuple becomes a single expression, which it used to miss. In both cases the diagnostics after a save and reload match those before it.

Closes #2442.
