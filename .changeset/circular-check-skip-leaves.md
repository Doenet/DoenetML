---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Large documents load a little faster. The check for circular dependencies among computed values now skips the many dependencies that cannot form a loop, such as one on a value that depends on nothing else. What documents compute and display is unchanged.
