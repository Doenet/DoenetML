---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Viewer: let screen readers read the list marker of an item that starts with a `<p>`.

A `<p>` renders as `<div class="para">`, and any wrapper element between the
`<li>` and its text stops a screen reader from folding the item's `::marker`
into the item's own text. VoiceOver then landed on the marker as a separate
object and announced "list marker" rather than "1. Apples, 1 of 3", so an
ordered list whose items each held a `<p>` lost its numbering out loud. The
paragraph that leads a list item is now presentational, which restores the
accessibility tree a plain `<li>Apples</li>` produces.

Paragraphs are also exposed as paragraphs now, in and out of lists: a `<div>`
carries no paragraph semantics on its own, so every `<p>` beyond the leading
one in a list item gets an explicit `paragraph` role. Nothing about the visual
layout changes.

Closes #662.
