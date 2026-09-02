---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

The context-sensitive help explains what a `width` or `height` accepts.

Cursor on one of these attributes, the help panel now lists the forms its value
may take — `600`, `600px`, `6in`, `450pt`, `15cm`, and, for a width, `50%` —
along with the note that a bare number is pixels. A height is offered only the
absolute forms, since a percentage there has no page height to measure itself
against. The `width` of a `<graph>`, `<image>` or `<video>` is marked as
choosing the nearest `size` preset rather than being used exactly.

The panel keys off the attribute's type, so every component taking a size is
covered. A size default also reads as `120px` now, instead of as the internal
`{"size":120,"isAbsolute":true}` — in the reference tables as well as the panel.
