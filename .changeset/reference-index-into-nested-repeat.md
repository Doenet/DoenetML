---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Finish resolving a reference that indexes into a repeat nested inside another repeat.

`$a[2][1][3]` and `$a[2].b[3]` returned the whole inner repeat — all three of its items rather than the third — whenever the reference sat directly in the document and the repeats sat inside a `<p>` or other element. The same fault made `<number extend="$a[2][1][3]" />` written that way come out as `NaN`, since it was extending three items rather than one.

The same references written inside a `<p>`, or as the content of a `<number>`, were already correct. The element around the reference is not what mattered — the order was. Those forms are resolved after the repeats have expanded, and so never passed through the intermediate state that got stuck.

A reference resolved before the repeat it indexes into exists gets a provisional answer, to be resolved again once that repeat expands. The second resolution did run and did find the right component, but the reference kept the component it had been paired with the first time: the flag marking it as mid-resolution was left set when an attempt gave up early, and while that flag is set the reference is never told to rebuild what it points at. The flag is now cleared however the attempt ends.
