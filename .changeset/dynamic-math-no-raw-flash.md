---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Viewer: stop flashing raw LaTeX while inline math updates (e.g. dragging a point).

Inline math that references a changing value — like `$P` for a dragged point, or
a `<number>`/`<line>` bound to it — is rendered with `better-react-mathjax`'s
`<MathJax dynamic>`, which writes the new raw LaTeX into the DOM and typesets it
asynchronously. When updates outpaced MathJax (e.g. a point referenced many
times, dragged), the raw LaTeX (`\left( 3, 4 \right)`) stayed visible during the
drag, and its update effect could drop the final typeset, leaving one copy stuck
showing raw LaTeX until the next unrelated re-render.

These value-display renderers (`<m>`/`<me>`/`<men>`, point, number, line, vector,
angle, label, answer, and response/label helpers) now render through a new
double-buffered `DynamicMath` component: it typesets the new LaTeX on an
off-screen buffer and swaps the result in only once it is ready, keeping the
previously rendered math on screen meanwhile. Rapid updates are coalesced to the
latest value (so nothing is left un-typeset) and throttled. The math therefore
stays rendered throughout a drag — momentarily stale during a fast drag, but
never showing raw LaTeX and never blanking.

Math inside inputs and some labels (e.g. `<mathInput>` previews) still uses the
previous path and is unaffected by this change.
