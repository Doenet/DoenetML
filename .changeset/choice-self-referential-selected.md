---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fix circular dependency when referencing `choice.selected` inside the same `<choice>`.

`$c1.selected` (or a `<conditionalContent>` whose condition references `$c1.selected`) inside `<choice name="c1">` previously threw a "Circular dependency detected" error. The root cause was that `choiceInput.indicesMatchedByBoundValue` always declared a dependency on `choiceChildren.text` even when `bindValueTo` is absent — a dependency that is never used in that case. This created a resolver-blocker cycle:

`allSelectedIndices` → `indicesMatchedByBoundValue` → `c1.text` → composite expansion of `$c1.selected` → `c1.selected` → `childIndicesSelected` → `selectedIndices` → `allSelectedIndices`

The fix makes `indicesMatchedByBoundValue` only declare the `choiceChildren.text` dependency when `bindValueTo` is actually set, breaking the cycle.

Closes #1399.
