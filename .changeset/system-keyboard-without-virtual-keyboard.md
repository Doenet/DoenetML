---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Viewer: a math input on a touch device keeps the device's own keyboard down only when the Doenet virtual keyboard is there to replace it.

A viewer embedded with `addVirtualKeyboard={false}` used to suppress the device's keyboard anyway, so on a tablet or phone a reader had no keyboard at all for math inputs. Without the virtual keyboard, tapping a math input now raises the device's keyboard.
