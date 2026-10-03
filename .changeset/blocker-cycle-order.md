---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Large documents load a little faster. While a document is built, core checks that what each part waits on never loops back on itself; that check now keeps an ordering it updates as it goes instead of searching again each time. What documents compute and display is unchanged.
