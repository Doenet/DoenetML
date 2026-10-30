---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Content hidden on its own inside a list is no longer drawn. Before, `<textList><textList hide>q</textList> r</textList>` drew `q, r`, and so did a `<group hide>`, a `<collect hide>` or a `<sequence hide>` inside a list, and a `<group hide>` inside a `<sort>` or `<shuffle>`. Now the hidden entries are left out there, and also from a `<choice>`'s text, an `<li>`'s lead, and a reference to the whole list (`$l`) placed elsewhere.

Such an entry is hidden only by a container of its source, so `$l[1]` placed elsewhere is still shown, `$l[1].hide` is still the source's own `hide`, and `$l[1].hidden` is `true`. A value position such as `<math>$l</math>` still counts every entry.

Closes #2390.
