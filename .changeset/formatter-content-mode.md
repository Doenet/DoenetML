---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

The "Format DoenetML"/"Format XML" buttons (and the LSP format-on-save) now lay out documents like a standard HTML/XML formatter: block-level elements always sit on their own line, inline elements flow with the surrounding text, and unrelated sibling elements never share a line. Each element's content mode (block, inline, pre) is derived from the component's `InlineComponent` / `BlockComponent` inheritance, emitted into the schema as `layoutCategory`. Blank lines between block siblings are preserved (collapsed to one max), `<pre>` content stays verbatim, and re-running the formatter on its own output is now a no-op. Closes #1116.
