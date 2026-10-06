---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<repeat>` or `<repeatForSequence>` whose template is one `<point>`, such as the points of a dot plot, now keeps its points in one component, drawn and dragged point by point as before, instead of making a copy of its template for each point. Documents with such repeats create far fewer components and load faster: a dot plot of 50 points is about a tenth of the components it was. This applies when the point's coordinates read the repeat's value or index, an entry of a list at the index (`$l[$i]`), the value of a `<repeat for="$l">` over one list, or values outside the repeat, and its attributes and constraints are the same for every point; otherwise the repeat works as before. A point dragged writes each coordinate where it wrote before.
