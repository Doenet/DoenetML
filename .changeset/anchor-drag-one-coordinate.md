---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Moving a component placed at an `anchor` by one coordinate (only its `y`, from an action or a `<callAction>`) now moves it there and keeps its other coordinates, where it used to leave it in place.
