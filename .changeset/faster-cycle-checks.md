---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Documents with many references load faster. While a document is built, core checks for circular dependencies each time a state variable starts depending on another; on large documents those checks took about a seventh of the load time, about half of it spent rebuilding key strings and copying path arrays on every step. The checks now keep their bookkeeping in maps and reuse one path stack, and do the same searches as before, so which cycles are reported, and how, is unchanged.
