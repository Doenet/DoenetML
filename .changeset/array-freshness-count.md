---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Changes that reach a long list of computed values respond faster, such as dragging a point that sets the start of a simulation drawn as a polyline through hundreds of points or shown in a large table. When one entry of a list stopped being current, core rebuilt and checked every entry of the list to see whether any were still current; it now keeps a count. What documents compute and display is unchanged.
