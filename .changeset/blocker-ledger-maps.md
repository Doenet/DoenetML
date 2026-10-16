---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Large documents load about 5 to 8% faster, and dragging in them responds a little faster. While a document is built, core keeps a record of what each part of it is still waiting on; that record is now kept in maps, and the source position a value carries for warnings is copied once instead of on every read. What documents compute and display is unchanged.
