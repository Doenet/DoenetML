---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

`<repeat for="$g">` over a `<group>` now gives each iteration the right value when the group mixes written components with references to a list, as in `<group name="g"><math>7</math>$l</group>`, or holds a list, sequence, repeat or group written inside it. The repeat already had the right number of iterations, but the values were out of order or blank. It now shows the items in the order `$g` displays them, and keeps them in step as the group's contents change.

The same fix covers a `<repeat>` over a `<group>` or `<sort>` whose items contain references, as in `<group name="g"><math>$a</math><math>$b</math></group>`, which showed only the first value and warned that it found no referent. Indexing into a group whose contents are a reference to a group that mixes components with references, or whose items contain references, such as `$h[2]` for `<group name="h">$g</group>`, now also finds the right item.

Closes #2073.
