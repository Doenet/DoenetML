---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Stop a hidden first child from taking the lead of a list item.

A list item — an `<li>`, or a `<problem>`/`<task>`/`<part>` rendered as one — lines its number up with its first child, and suppresses that child's top margin. A child hidden with `hide` counted as that first child even though nothing of it renders, so the child behind it kept its top margin and lost its claim on the number. In `<li><p hide/><answer><choiceInput/></answer></li>` that put the marker beside the first choice instead of beside the question label. The first child that actually renders is now the one used, so hidden content can sit at the front of a list item without disturbing it.

This holds at every level the number's alignment is passed down. Hiding a composite counts: a `<repeat hide>` or `<conditionalContent hide>` at the front of an item is skipped along with the replacements it stands in for. And every component that hands the alignment on now applies the same test to its own children:

- A wrapper that leads the item — a `<div>`, `<blockQuote>`, `<stack>`, or `<sideBySide>` panel — so `<li><div><p hide/><answer><choiceInput/></answer></div></li>` lines up the same way the unwrapped item does. A wrapper also stops leading with a child that draws nothing anywhere, such as an `<animateFromSequence>`.
- A `<sideBySide>` leading the item, which took its top-or-baseline alignment from its first panel whether or not that panel was shown. `<li><sideBySide><p hide/><graph/></sideBySide></li>` was laid out as though it led with a paragraph; it now top-aligns, exactly as it does with the hidden panel deleted.
- An `<answer>` leading the item, which pointed at its first block `<choiceInput>` even when that input was hidden. The item now falls back to its usual alignment instead of lining the number up against an input nobody can see.

A `<cascadeMessage>` no longer takes the lead either. It is hidden whenever the step around it is revealed, so a `<problem>` that opened with one gave its number, and the top-margin suppression, to a message the reader cannot see.

Only a child's own `hide` counts, though. Hiding a *container* does not re-pick the lead of anything inside it: a hidden `<ol>`, a hidden section, and a `<cascade>` step held back until earlier ones are done all hide their contents while leaving each item leading with exactly the child it would lead with if shown.
