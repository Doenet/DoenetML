---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Math can now be written with MathJax's `units` extension.

`\units` typesets a quantity beside its unit with the spacing a typesetter
would use, instead of leaving authors to approximate it with `\,` and
`\mathrm`. The same extension supplies `\unitfrac` and `\nicefrac`.

```
<m>\units{9.8}{\text{m}/\text{s}^2}</m>
```

Documents embedded in a page that provides its own MathJax now render the same
way they do on doenet.org. Doenet reuses such an engine rather than clobbering
it, which previously meant none of Doenet's configuration applied there — the
`units` macros above, and macros such as `\var`, typeset as their own names
instead. Doenet now teaches a reused engine those macros and packages before
rendering. Embeddings where Doenet loads MathJax itself, including every iframe
embedding, are unaffected.
