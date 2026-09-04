---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Finish resolving a reference that indexes into a repeat nested inside another repeat.

With the repeats inside a `<p>` or any other element, a reference to an inner item written directly in the document dropped its last index. `$a[2][1][3]` and `$a[2].b[3]` returned the whole inner repeat — all three of its items rather than the third — and `<number extend="$a[2][1][3]" />` written that way came out as `NaN`, since it was extending three items rather than one. The same references written inside a `<p>` of their own, or as the content of a `<number>`, were already correct: those are resolved after the repeats have expanded, and so never passed through the intermediate state that got stuck.

A reference resolved before the repeat it indexes into exists gets a provisional answer, to be resolved again once that repeat expands. The second resolution did run and did find the right component, but the reference kept the component it had been paired with the first time: the flag marking it as mid-resolution was left set when an attempt gave up early, and while that flag is set the reference is never told to rebuild what it points at. The flag is now cleared however the attempt ends.
