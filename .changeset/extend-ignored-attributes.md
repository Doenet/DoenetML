---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

An `extend` of a composite or a list, such as `<sequence extend="$s" to="5"/>` or `<repeat extend="$r">…</repeat>`, shows the same content as the component it extends. The attributes that would change that content, such as `to` on a `<sequence>`, `for` on a `<repeat>` or `numToSelect` on a `<select>`, and children written inside the extend of a `<repeat>`, `<repeatForSequence>` or other composite, were ignored without a word. They are still ignored, and DoenetML now warns about each one. `asList`, `hide`, the number display attributes such as `displayDigits`, and children written inside a `<group extend>` apply as before, without a warning.

`fixLocation="false"` written on an `extend` or `copy` of a point with `fixLocation`, as in `<point copy="$F" fixLocation="false"/>`, now applies, as `fixed="false"` does. The copy can then be dragged. A drag of an `extend` still moves the point it extends, so that point's own `fixLocation` still refuses it.
