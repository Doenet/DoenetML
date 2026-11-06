---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A property of an entry of a `<sort>` or `<shuffle>` that stays a composite (its entries are of different types), where the entry is itself an entry of a list, is now the list entry's. Before, `$s[1].hide`, `$s[1].hidden`, `$s[1].value` and `$s[1].text` were each `＿` there. Now `$s[1].hide` is the entry's own `hide`, `$s[1].hidden` is also `true` while the list holding it is hidden inside the sort, and the other properties are the entry's, as for `$l[1].hide` of the list itself.

Closes #2480.
