---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Content hidden inside a `<sort>` or `<shuffle>` is no longer drawn when the sort or shuffle can't be made into a list. Before, `<sort><group hide><number>1</number></group><math>2</math></sort>` drew `1, 2`, and so did a sort or shuffle holding a `<repeatForSequence hide>`, a `<group hide>` that sets another attribute, or a hidden list among entries of another type. Now the hidden entries are left out there, and also from a `<choice>`'s text and from a reference to the whole sort or shuffle (`$s`) placed elsewhere.

As with the sorts and shuffles that become lists, such an entry is hidden only by a container of its source, so `$s[1]` placed elsewhere is still shown, `$s[1].hide` is still the source's own `hide`, and `$s[1].hidden` is `true`.

Closes #2394.
