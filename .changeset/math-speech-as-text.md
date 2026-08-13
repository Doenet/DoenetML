---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Viewer: let a screen reader read every formula on the page.

MathJax renders a formula as a visual `<mjx-math>` that is hidden from
assistive technology plus an empty `<mjx-speech role="img" aria-label="…">`
carrying the words the Speech Rule Engine generated. A screen reader therefore
saw a labelled graphic with no content of its own, which VoiceOver handles
badly: MathJax's own documentation records that it "skips the ARIA labels" and,
moving item by item, "might jump back to a preceding element after reading the
ARIA label on each expression". Formulas went unspoken.

That is what issue #1456 reported. A `<sideBySide>` of two `<stack>`s held three
formulas per column, and a reader heard only the first formula of the left
column before being carried off to the right one, so cosine and tangent were
never read at all. The layout is not what broke — Chrome's accessibility tree
for that document was already complete and in document order — but it is what
made the loss obvious, because the jump landed a whole column away instead of a
line or two down.

The same speech string is now real text: it moves out of the label and into a
visually hidden span inside `<mjx-speech>`, and the label and the `img` role
that would suppress the text as a name are dropped. Nothing looks different, and
nothing is lost — the braille label stays where it is and still applies, since
the element still has a name, and the element stays visible to assistive
technology because it is also the one MathJax focuses when a reader opens the
expression explorer. Walking into a subexpression rewrites the label, and the
text follows it.

This covers every formula in the page, not only `<m>`: math also reaches a
reader through every math-bearing input, choice options, buttons and the virtual
keyboard, and its speech string is attached a little after the typeset that
produced it. A host page that embeds Doenet and typesets its own math gets the
same treatment, since it has the same problem.

Separately, a `<sideBySide>` panel is now wrapped in a `<div>` rather than a
`<span>`. A panel's children are always block components, which phrasing content
may not hold.

Closes #1456.
