---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

`<mathInput>` can now be placed inside a `<graph>`. Like `<textInput>`, it renders
at an `anchor` point on the board and honors `positionFromAnchor` for placement
relative to that anchor. Click inside the field to edit it; grab its label (or the
grip shown when it has no label) to drag it to a new position. Set
`draggable="false"` to pin it in place.
