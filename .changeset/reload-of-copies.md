---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A copy of a component named in a case of a `<conditionalContent>` (`<p copy="$cc.p"/>`, `<mathInput copyWithState="$cc.p.a"/>`, or a name inside a `<group>` in the case) is now made again, after a reload, from the case it was made from, with what the reader entered in it, though another case, or none, is active then. Before, it was made from the case active at the reload, so a reader who changed the case before reloading saw a different paragraph, without their entries. This holds for `copy` and `copyWithState`, and through nested `<conditionalContent>`s.

`<conditionalContent copy="$cc"/>` (or `copyWithState`) now shows, after a reload, the case its own condition selects, with what the reader entered in each case. Before, once its condition had selected another case than the one it was made with, a reload left it empty.

A value saved from one component is no longer restored to a component of another type that has the same id. A `copy` or `copyWithState` of a `<collect>` is made again on a reload from what the collect holds then, so a `<textInput>` it now makes could receive what the reader typed into the `<mathInput>` it made before, and the document failed to load. Now the `<textInput>` starts empty and the document loads. This check applies only to state saved from now on.
