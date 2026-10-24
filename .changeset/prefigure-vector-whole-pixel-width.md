---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

With the PreFigure renderer, which includes printed documents, draw a `<vector>` whose `lineWidth`, set on it or in its style, is fractional or zero. Such a vector, and everything drawn after it in the graph, used to be left out with no warning. Its line width is now rounded to a whole number of pixels, at least 1, and a vector with a line width of 0 draws only its label, as in the interactive graph.
