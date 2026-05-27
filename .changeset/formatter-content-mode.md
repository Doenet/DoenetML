---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

The "Format DoenetML"/"Format XML" buttons (and the LSP format-on-save) now lay out documents like a standard HTML/XML formatter: block-level elements always sit on their own line, inline elements flow with the surrounding text, and unrelated sibling elements never share a line. Each element's content mode (block, inline, pre) is derived from the component's `InlineComponent` / `BlockComponent` inheritance, emitted into the schema as `layoutCategory`. Blank lines between any two block-adjacent siblings (block↔block, text↔block, block↔text) are preserved and capped uniformly at one. `<pre>` content stays verbatim. Inside `<setup>` and `<moduleAttributes>` — definitional containers with no prose flow — every direct element child gets its own line regardless of inline/block classification, while each child's own internals format normally. Re-running the formatter on its own output is a no-op (idempotence enforced by tests). Closes #1116.
