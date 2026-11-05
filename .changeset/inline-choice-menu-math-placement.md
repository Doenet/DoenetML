---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

An inline `<choiceInput>` whose choices contain math no longer opens its menu past the bottom of the page or embedding frame. Once the math in the choices is drawn, a menu that no longer fits below the control opens above it, or scrolls within the room below.
