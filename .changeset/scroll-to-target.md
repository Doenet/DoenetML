---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

A new `scrollToTarget` prop on `DoenetViewer` names an element to scroll to once it has rendered, so a host can open a document at a figure or equation, for example from a link to `…/page#fig3`. The viewer scrolls there once, through `requestScrollTo` when the host gives one (as for an in-document link). For a few seconds it keeps the element in place while content above it, such as images, finishes loading, unless the reader starts scrolling. If no element of that name appears, nothing happens.
