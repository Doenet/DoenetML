---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/doenetml-headless": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Tags made with `extend`, `copy` or `copyWithState` from what a case or pick shows, or from a list held in a composite:

- **A `<repeat>`, `<select>`, `<collect>`, `<sort>`, `<sequence>`, `<selectFromSequence>` or other tag that makes its own content is made by `extend`, `copy` or `copyWithState` only from a reference that always names the same written tag of its kind** (`$r`, `$sec.r`, `$g.r`, `$outer[2].inner`). A reference that can name a different one as what is shown changes is now `doenet-e0071` when the document loads, with a message saying so: `<repeat extend="$cc.r"/>` where each case of `cc` holds a repeat named `r`, `$s.r` with one in each option of a `<select>`, and `$s[2].r` of a select that picks several, also when the branches are in an iteration or a copy (`$outer[1].cc.r`). These were allowed, and followed the case or pick shown. So is `<sequence extend="$cc"/>` of a `<conditionalContent>` or one-pick `<select>` holding a `<sequence>`, which was allowed too. `<repeat extend="$cc"/>` was already `doenet-e0071`; its message now says the same. Showing it (`$cc.r`) is unchanged.
- **A `<group>` made from a `<selectFromSequence>`, `<selectRandomNumbers>` or another chooser or sampler that picks one value is `doenet-e0065`**, as one made from a `<number>` is: it stands for that one value. It was a group holding the value.
- **A `<group>` made from a name after an index into a repeat inside a `<conditionalContent>`** (`<group extend="$r[1].m"/>` of a `<math name="m">` in the template) is `doenet-e0065`, as it is outside one. It was allowed.
- **A scalar tag made from an iteration, a case or a group holding a list whose entry count the DoenetML decides is `doenet-e0064` at load**, as made directly: `<mathList>$ml2</mathList>` and `<mathList extend="$x"/>` count the entries of the list they name. A `<math>` made from an iteration, a case or a group holding a list of one entry is that entry; it was a blank when the list was a reference (`<repeat for="1">$x</repeat>`) or in a case. One whose count a value decides (`<mathList>$a 2</mathList>`, `<sequence length="$n"/>`) is missing, with a `doenet-e0064` warning, while it isn't one; it showed the entries together in one math. One holding a list of no entries is missing with a warning that says so; it was a blank with no message.
- **`doenet-e0064` says "may hold up to" a count** when a `<conditionalContent>` beside other components may show nothing. A `<conditionalContent>` whose case holds one component beside an empty `<else>`, and another component beside it in a group, made from the group, is now `doenet-e0064`; it was a blank with no message.
