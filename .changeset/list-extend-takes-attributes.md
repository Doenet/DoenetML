---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

An `extend` or `copy` of a list (`<mathList extend="$ml"/>`, `<mathList copy="$ml"/>`) now takes the list's attributes it does not set itself, as an `extend` or `copy` of any other component does: a hidden list's extend or copy is hidden, and it has the list's display settings and style. The list's `maxNumber` now also limits entries written inside it, and the list's `splitSymbols`, `functionSymbols` and `parseScientificNotation` apply to text written inside it. An extend is fixed when the list is or where it sits is. A copy behaves as if the list's DoenetML were pasted there: it has the list's attributes, `fixed` included, as its own, an attribute the list gives by a reference, `unordered="$u"` included, keeps following it, and a later change to the list's own attributes does not reach the copy. An `extend` as a list of something that is not a list, such as `<mathList extend="$P"/>` of a point, likewise takes that component's attributes of the same names, such as `hide`.
