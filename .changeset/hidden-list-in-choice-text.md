---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A hidden list no longer counts toward the text of a `<choice>` holding it, or as the child a list item (`<li>`) leads with. Before, `<choice><textList hide>q</textList> r</choice>` had the text `q r` although the `q` isn't shown, while the same with a `<group hide>` had ` r`. This also holds for a list inside a hidden `<group>`, for other hidden lists (a `<sequence hide>`, a `<mathList hide>`, a `<pointList hide>`, a `<sampleRandomNumbers hide>`, …), and for `$c` of a `<collect hide>`, which is not shown either. Now the choice's text is the text of a `<p>` holding the same content.

A bare reference to a hidden list (`$l`) is still shown, so its entries still count. `$l[1].hide` is still the entry's source's own `hide`.

Closes #2375.
