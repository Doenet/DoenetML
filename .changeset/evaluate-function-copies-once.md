---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Make evaluating a function, such as `$$f(0.3)`, about as fast as writing its formula out, even when the function is evaluated in many places and changes often, as in an animation.

The function is computed once each time it changes rather than once for every place it is evaluated, and only in the form (symbolic or numerical) it is evaluated in.
