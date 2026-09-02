---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

The context-sensitive help explains what a `width` or `height` accepts.

With the cursor on one of these attributes, the help panel now lists the forms its value
may take — `600`, `600px`, `6in`, `450pt`, `15cm`, and, for a width, `50%` —
along with a note naming the unit each carries. Each attribute is offered only
what it honors: a height gets the absolute forms, since a percentage there has
no page height to measure itself against, and a `<sideBySide>` width gets the
percentage, since it divides a row into shares. The `width` of a `<graph>`,
`<image>` or `<video>` is marked as choosing the nearest `size` preset rather
than being used exactly.

The panel keys off the attribute's type rather than its name, so every attribute
taking a single size is covered. A size default also reads as `120px` now,
instead of as the internal `{"size":120,"isAbsolute":true}` — in the reference
tables as well as the panel.
