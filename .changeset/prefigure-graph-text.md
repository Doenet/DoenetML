---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Draw `<text>`, `<number>`, `<math>`, `<m>`, `<md>`, and `<label>` placed in a graph with the PreFigure renderer, which includes printed documents, along with components built on them such as `<integer>`, `<mdn>`, and `<evaluate>`, and each entry of a `<textList>`, `<numberList>`, or `<mathList>`. These were left out of the graph, with no warning. Each is drawn at its `anchor`, on the side its `positionFromAnchor` names, in its style's text color, and an `<annotation>` can refer to it.
