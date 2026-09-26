---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Make a function written in terms of another function, such as `<function>$$normalpdf(x, 0, 1)</function>`, faster and as accurate as one whose formula is written out.

Its minima and maxima come back in milliseconds rather than tens of seconds, and it no longer reports minima it does not have: out in the tails, where its values are tiny, they were computed imprecisely enough to look like dips. When the inner function has no domain, dragging on a graph that uses such a function is as responsive as dragging with the formula written directly.

When the inner function has a domain, the function still gives no value where its input falls outside that domain.

A graph drawn with `renderer="prefigure"` now includes such a function when the inner function has no domain; it previously skipped it with a warning.
