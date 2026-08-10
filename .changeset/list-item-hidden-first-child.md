---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Line a list item's number up with a labeled `<choiceInput>` however it is wrapped, and stop a hidden first child from taking the lead.

A labeled block `<choiceInput>` leading an `<ol>`/`<ul>` list item drew the item's number beside the first choice instead of beside the question label, because the label was rendered in a `<legend>` and a browser aligns a list marker with the content *after* a legend. #1668 fixed that only where the core could tell the input it was leading a list item, which left the bug in place for wrappers that pass no such signal on — `<li><p>`, `<li><span>` and `<li><em>` all still drew the number a line low. The label now renders in an equivalent `<div>` wherever it appears, so nesting the input in anything at all keeps the number on the label's row. Its accessible name is unchanged (`aria-labelledby` names the fieldset either way) and so is its position on the line.

A list item — an `<li>`, or a `<problem>`/`<task>`/`<part>` rendered as one — lines its number up with its first child, and suppresses that child's top margin. A child hidden with `hide` counted as that first child even though nothing of it renders, so the child behind it kept its top margin and lost its claim on the number. In `<li><p hide/><answer><choiceInput/></answer></li>` that put the marker beside the first choice instead of beside the question label. The first child that actually renders is now the one used, so hidden content can sit at the front of a list item without disturbing it.

This holds at every level the number's alignment is passed down. Hiding a composite counts: a `<repeat hide>` or `<conditionalContent hide>` at the front of an item is skipped along with the replacements it stands in for. And every component that hands the alignment on now applies the same test to its own children:

- A wrapper that leads the item — a `<div>`, `<blockQuote>`, `<stack>`, or `<sideBySide>` panel — so `<li><div><p hide/><answer><choiceInput/></answer></div></li>` lines up the same way the unwrapped item does. A wrapper also stops leading with a child that draws nothing anywhere, such as an `<animateFromSequence>`.
- A `<sideBySide>` leading the item, which took its top-or-baseline alignment from its first panel whether or not that panel was shown. `<li><sideBySide><p hide/><graph/></sideBySide></li>` was laid out as though it led with a paragraph; it now top-aligns, exactly as it does with the hidden panel deleted.
- An `<answer>` leading the item, which pointed at its first block `<choiceInput>` even when that input was hidden. The item now falls back to its usual alignment instead of lining the number up against an input nobody can see.

A `<cascadeMessage>` no longer takes the lead either. It is hidden whenever the step around it is revealed, so a `<problem>` that opened with one gave its number, and the top-margin suppression, to a message the reader cannot see.

Only a child's own `hide` counts, though. Hiding a *container* does not re-pick the lead of anything inside it: a hidden `<ol>`, a hidden section, and a `<cascade>` step held back until earlier ones are done all hide their contents while leaving each item leading with exactly the child it would lead with if shown.

An `<li>` leading with a box that offers no first line of text — a `<graph>`, `<image>`, `<video>`, `<figure>` or `<tabular>` — had its number drawn at the bottom of that box rather than beside its top. That was tracked separately as [#1673](https://github.com/Doenet/DoenetML/issues/1673); the entry for it in this same release fixes it, so a list item of any shape now has its number beside the top of its content.
