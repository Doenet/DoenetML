---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Stop a hidden first child from taking the lead of a list item.

A list item — an `<li>`, or a `<problem>`/`<task>`/`<part>` rendered as one — lines its number up with its first child, and suppresses that child's top margin. A child hidden with `hide` counted as that first child even though nothing of it renders, so the child behind it kept its top margin and lost its claim on the number. In `<li><p hide/><answer><choiceInput/></answer></li>` that put the marker beside the first choice instead of beside the question label. The first child that actually renders is now the one used, so hidden content can sit at the front of a list item without disturbing it.

A child hidden by its container rather than by itself is untouched: an unrevealed `<cascade>` step, or anything inside a section whose content is hidden, leads its item exactly as before.
