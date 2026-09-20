---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Stop a piecewise function whose pieces are bounded by a free variable from taking the document down when it is used as another function's body.

A `<piecewiseFunction>` whose pieces have symbolic domains — `<function domain="(-infinity, q)">` — has no numeric domain, and reports so as `domain: null`. A `<function>` wrapping it stores that in an array state variable of one interval per input, which turns "no domain" into an array that is present but empty. The piecewise extrema search then read the first interval off that array and threw, and the thrown error out of a state-variable definition took the whole document with it — a blank page rather than a graph.

The array is now tested entry by entry, the way `find_effective_domain` alongside it already did, and an empty one falls back to the real line.

This is easiest to hit through a field, whose sugar wraps whatever is written inside it in a `<function>`: `<slopeField>$g</slopeField>` naming such a piecewise function was enough.
