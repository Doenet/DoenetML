---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Number the divisions inside a `<div>` or `<cascade>` along with the divisions beside it.

A division inside a container that shows no number of its own — `<div>`, `<cascade>`, `<introduction>`, `<conclusion>`, `<statement>`, and the containers an external copy arrives in — used to start a count of its own, so it repeated the number of a division beside the container. It now continues the sequence around the container, and the divisions after the container continue after it: in `<section><subsection/><div><subsection/></div><subsection/></section>` the subsections are 1.1, 1.2, 1.3 rather than 1.1, 1.1, 1.2, and top-level sections with one inside a `<cascade>` are 1, 2, 3 rather than 1, 1, 2. The number in the heading, `sectionNumber`, and the text of a `<ref>` all agree.

Divisions are also renumbered when a `<repeatForSequence>` or `<conditionalContent>` before them changes how many divisions it holds while the document runs, where they used to keep their old numbers.
