---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

The `vertices` of a `<polyline>` or `<polygon>` that names a whole list of points, such as `vertices="$points"`, is now read by the polyline or polygon instead of through a copy of the list. Documents that draw lists of points this way do less work. What documents compute and display, and how their vertices drag, is unchanged.
