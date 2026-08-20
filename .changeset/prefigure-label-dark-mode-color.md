---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fix plain-text labels being invisible in dark mode on prefigure-rendered graphs.

Point, line/vector, and angle labels without LaTeX, along with graph axis
titles, are rendered by PreFigure as native SVG `<text>` elements. Without an
explicit color, PreFigure leaves these unstyled, which defaults to opaque
black and disappears against a dark canvas. Math/LaTeX labels were unaffected
since they render through MathJax, which already uses the page's text color.
Plain-text labels now carry an explicit color that follows the page's
light/dark theme.
