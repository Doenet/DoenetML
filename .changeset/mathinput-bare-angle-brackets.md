---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Show angle brackets in a math input whose `prefillLatex` writes them without `\left` and `\right`.

`<mathInput prefillLatex="\langle 2, 3 \rangle" />` rendered an empty field. The vector reached the input's `value` correctly — only the field the reader looks at was blank, so the prefill was invisible.

MathQuill recognizes `\langle` as a delimiter but had no rule for what follows it, so it took only the one block an ordinary LaTeX command takes — just the `2` — and then had nothing left to give `\rangle`. That failed the parse of the whole expression, and a math field whose LaTeX will not parse renders as empty. `\left\langle 2, 3 \right\rangle` worked, but that is not how the brackets are usually written.

An opening delimiter written without `\left` now takes everything up to its matching partner, the way it behaves when typed: `\langle 2, 3 \rangle`, `\langle \rangle`, `\lVert x \rVert`, and nestings of them all render. One with no partner — `\langle 2, 3` — keeps all of its contents and shows the same half-open bracket typing one produces, rather than closing after the first term.

Closes #1336.
