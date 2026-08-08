---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Stop a hidden first child from taking the lead of a list item.

A list item — an `<li>`, or a `<problem>`/`<task>`/`<part>` rendered as one — lines its number up with its first child, and suppresses that child's top margin. A child hidden with `hide` counted as that first child even though nothing of it renders, so the child behind it kept its top margin and lost its claim on the number. In `<li><p hide/><answer><choiceInput/></answer></li>` that put the marker beside the first choice instead of beside the question label. The first child that actually renders is now the one used, so hidden content can sit at the front of a list item without disturbing it.

This holds at every level the number's alignment is passed down. Hiding a composite counts: a `<repeat hide>` or `<conditionalContent hide>` at the front of an item is skipped along with the replacements it stands in for. And a wrapper that leads the item — a `<div>`, `<blockQuote>`, `<stack>`, or `<sideBySide>` panel — now skips a hidden child of its own too, so `<li><div><p hide/><answer><choiceInput/></answer></div></li>` lines up the same way the unwrapped item does.

A `<cascadeMessage>` no longer takes the lead either. It is hidden whenever the step around it is revealed, so a `<problem>` that opened with one gave its number to a message the reader cannot see.

Only a child's own `hide` counts, though. Hiding a *container* changes nothing about which child leads the items inside it — the items in a hidden `<ol>` or a hidden section, and in a `<cascade>` step not yet revealed, lead with exactly the child they led with before, so revealing a cascade step never shifts a number.
