---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Align list-item section numbers consistently.

Section numbers for list-rendered sections (for example `<problem>`s inside `<problems>`, including through a `<cascade>`) now line up at the decimal regardless of how the content wraps, the container width, or whether an item starts with text or with an element. Previously a number could drift horizontally as its content wrapped, as the viewport narrowed, or when the item's first child was a plain string.
