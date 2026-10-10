---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

The `target` of an `<indexOf>` or `<searchSorted>` that names a whole list, such as `target="$indices"`, is now read by the operator instead of creating a component for each entry of the list. Documents that search lists this way create fewer components. What documents compute and display is unchanged.
