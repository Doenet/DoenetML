---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fix auto-completion of closing tags when nesting an element with the same
tag name as its parent. Previously, typing `<p>` inside an existing
`<p></p>` would not insert the inner `</p>` (the parser's stack-matching
"stole" the only `</p>` for the inner element), and typing `</` afterward
would not suggest the closing tag. The completion logic now walks up the
contiguous chain of same-name ancestor elements and, if any of them is
missing a close tag, treats the inner element as still needing one. (#1117)
