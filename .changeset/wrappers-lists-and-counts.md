---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/doenetml-headless": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Tags made with `extend`, `copy` or `copyWithState` from a wrapper or a list held in a composite:

- **A `<repeat>`, `<collect>`, `<sort>` or other tag that makes its own content can be made through a `<conditionalContent>`, a `<select>` that picks one, or a `<group>` holding only one**, when each case or option holds one of that tag, or nothing. `<repeat extend="$cc"/>` is the repeat the case shown holds, and follows the case as it changes, as `<repeat extend="$cc.r"/>` does: an index (`$r2[2]`) and `$r2.numItems` follow too. It was `doenet-e0071`. A case or option holding several components, or one of another type, beside one holding that tag, is `doenet-e0095`; when none holds that tag, it is still `doenet-e0071`.
- **A `<group>` made from a `<selectFromSequence>`, `<selectRandomNumbers>` or another chooser or sampler that picks one value of a type written in the DoenetML is `doenet-e0065`**, as one made from a `<number>` is: it stands for that one value. It was a group holding the value.
- **A `<group>` made from a name after an index into a repeat inside a `<conditionalContent>`** (`<group extend="$r[1].m"/>` of a `<math name="m">` in the template) is `doenet-e0065`, as it is outside one. It was allowed.
- **A scalar tag made from an iteration holding a list whose entry count the DoenetML decides is `doenet-e0064` at load**, as made directly: `<mathList>$ml2</mathList>` and `<mathList extend="$x"/>` count the entries of the list they name. A `<math>` made from an iteration holding a list of one entry (`<repeat for="1">$x</repeat>`) is that entry; it was a blank. One whose count a value decides (`<mathList>$a 2</mathList>`, `<sequence length="$n"/>`) is missing, with a `doenet-e0064` warning, while it isn't one; it showed the entries together in one math.
- **`doenet-e0064` says "may hold up to" a count** when a `<conditionalContent>` beside other components may show nothing. A `<conditionalContent>` whose case holds one component beside an empty `<else>`, and another component beside it in a group, made from the group, is now `doenet-e0064`; it was a blank with no message.
- **`<repeat copyWithState="$cc.r"/>` no longer stops the document from loading** from a save made after the case changed.
