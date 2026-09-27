---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Number the divisions inside a `<div>` or `<cascade>` along with the divisions beside it.

A division inside a container that shows no number of its own — `<div>`, `<cascade>`, `<introduction>`, `<conclusion>`, `<statement>`, and the containers an external copy arrives in — is numbered in sequence with the divisions around the container, and the divisions after the container continue the count: in `<section><subsection/><div><subsection/></div><subsection/></section>` the subsections are 1.1, 1.2 and 1.3, and top-level sections with one inside a `<cascade>` are 1, 2 and 3. The number in the heading, `sectionNumber`, and the text of a `<ref>` all agree.

Divisions after a `<repeatForSequence>` or `<conditionalContent>` are renumbered when it changes how many divisions it holds while the document runs.
