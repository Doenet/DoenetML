---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

The buttons of `<updateValue>`, `<callAction>` and `<triggerSet>` outside a graph no longer make the line of text they sit in taller. They lost the 12px margin above and below them and are now no taller than an inline check-work button, so a line holding one is about as tall as a plain line of text, rather than more than twice as tall.
