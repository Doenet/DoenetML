---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fix `<odeSystem>` failing with "numeric is not defined" in the browser.

Any document containing an `<odeSystem>` rendered as that error banner instead of a document, and any graph of a solution drew no curve. The solver, `dopri`, comes from numeric.js, bundled inside math-expressions. numeric builds most of its helpers at load time with the `Function` constructor, and the generated bodies reference a bare `numeric` — resolvable only if numeric has registered itself on the global object. It did that solely through Node's `global`, which neither a browser main thread nor a web worker has, so every generated helper threw the first time it was called, and `dopri` reaches them immediately. The worker's evaluation and the main-thread renderer's curve sampling both went through that path, so both failed.

Fixed upstream in math-expressions 2.0.0-alpha95, which registers numeric itself; this bumps to it.
