---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Viewer: reliably render math when embedded in a page that provides its own MathJax 4.

When a Doenet activity is embedded inline in a page that loads its own MathJax 4
(e.g. a PreTeXt book), the viewer reuses the host engine instead of loading its
own. The check that recognizes a live engine required `MathJax.startup` to be a
plain object, but MathJax 4 exposes `startup` as a function, so the host engine
was never recognized: the viewer waited until it timed out and every piece of
math rendered blank (with a couple of spots showing raw LaTeX). A live engine is
now detected whether `startup` is a function (MathJax 4) or an object
(MathJax 3).

As a safety net, if a host-provided MathJax is present but never becomes usable
within the timeout, the viewer now falls back to loading — and taking over with —
its own MathJax instead of leaving math blank, and a failed load no longer
prevents later attempts from retrying.
