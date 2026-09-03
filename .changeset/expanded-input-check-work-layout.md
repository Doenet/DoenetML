---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

An expanded `<textInput>` carries its check-work button beneath it.

An expanded input fills the width it is given, so a button beside it was
squeezed against the right margin, its label wrapping onto a second line that
the button's fixed height then clipped. The button now sits under the input, as
it already does under the choices of a non-inline `<choiceInput>`, and it is the
full labelled button by default there — `forceFullCheckWorkButton` is no longer
needed to get one, and `forceSmallCheckWorkButton` asks for the compact one. A
word-sized input is unchanged: its small button still rides beside it on the
line. An expanded input's `<description>` popover moves under it too, travelling
with the button.

Every check-work button now grows to hold a label that wraps, rather than
clipping it, which a long translated label could run into anywhere.
