---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<group copy>` now shows the random values of its source when they are nested in groups inside other elements. Before, a random choice inside a `<group>` inside another element of the copied group, such as `<group name="g"><div><group><selectFromSequence/></group></div></group>`, could take a new value in `<group copy="$g"/>`.

A random component added as a child of a `<group copy>`, as in `<group copy="$g"><selectFromSequence/></group>`, now gets a value of its own, which is the same for a given variant, as one added to a `<p copy>` or `<section copy>` does. Before, it could repeat a random value of the copied group.

The random values in the template of a `<repeat>` or `<repeatForSequence>` are now kept in an unlinked copy of the repeat, as in `<repeat copy="$r"/>`. Before, those in a `<group>` in the template, as in `<repeatForSequence from="1" to="2"><group><selectFromSequence/></group></repeatForSequence>`, could take new values, the same in every iteration, and those in the template of a `<repeat for>` could take different values in the copy.

The random values in a `<group>` in the template of a repeat are also now kept when a page is loaded again with the variant it generated. Before, they could take new values there, the same in every iteration.
