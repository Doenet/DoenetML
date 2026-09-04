---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fix two defects in the automatic commas placed between the replacements of a list composite.

A `<math>` containing a list next to a component froze the document. To decide whether the comma-separated list needs parentheses around it, the core looks at what sits on either side of it, walking past whitespace to find it — but that walk never advanced its index, so it never ended when the neighbor was a component rather than a string. `<math><number>3</number> <numberList>1 2</numberList></math>`, and the same with the list first, both hung.

Commas also appeared around a replacement that cannot be a list item, whenever the composite was not the first thing in its container. A composite holding something that can't be part of a list — a `<me>`, say — is shown without commas, but the record of which replacements are eligible was kept in step with the parent's children rather than with the composite's own, so the answer slid by however far the composite sat from the start. `<p><group asList><numberList>1 2</numberList><me>x</me></group></p>` was correct while `<p>lead <group asList><numberList>1 2</numberList><me>x</me></group></p>` was not.
