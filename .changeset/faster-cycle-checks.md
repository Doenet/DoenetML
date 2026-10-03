---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Documents with many references load faster. While a document is built, core checks for circular dependencies each time a state variable starts depending on another; those checks took about 15% of the load time of large documents. They now run once per state variable instead of once per dependency, skip edges that cannot close a cycle, and keep their bookkeeping in maps instead of rebuilding key strings and path copies on every step. Which cycles are reported, and how, is unchanged.
