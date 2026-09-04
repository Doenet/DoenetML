---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Finish resolving a reference that indexes into a repeat nested inside another element.

`$a[2][1][3]` and `$a[2].b[3]`, pointing into a repeat nested inside a repeat, returned the whole inner repeat — every item of `$a[2]` rather than its third — whenever the reference sat directly in the document and the repeats sat inside a `<p>` or other element. `<number extend="$a[2][1][3]" />` written the same way showed the same fault as `NaN`, a number extending three items rather than one. The same references written inside a `<p>`, or as the content of a `<number>`, were correct, which is what made paragraphs look responsible: a reference in a block is resolved later, after the repeats have expanded, and so never went through the intermediate state that got stuck.

A reference resolved before the repeat it indexes into exists gets a provisional answer and is meant to be resolved again once that repeat expands. The second resolution did run and did find the right component, but the reference kept the component it had been paired with the first time. Clearing a state variable's `currentlyResolving` flag on every exit from `resolveItem` — the early returns for an unresolvable blocker used to leave it set — lets the reference be repaired when its target changes.
