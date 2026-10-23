---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Slider: keep the handle where it was clicked instead of flashing back to its old value.

When the mouse went up, the slider moved its handle to core's current value. If core had not answered the click yet, that value was still the old one, so the handle jumped back and then forward again once core caught up. This was easy to see in a document where each step sets off a long recompute. The handle now moves to core's value only when core's answer arrives. A slider bound to one with a coarser step still lands on core's adjusted value when the drag ends.
