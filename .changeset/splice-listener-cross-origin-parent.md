---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

A viewer embedded in a page on another site no longer throws an uncaught error for each message it receives from a third origin, such as a YouTube player's. Messages are now accepted from the viewer's own origin or from its parent window, checked by window rather than by reading the cross-origin parent's location.
