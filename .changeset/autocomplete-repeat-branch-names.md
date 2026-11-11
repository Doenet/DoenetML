---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: autocomplete follow-ups, and a hint for a reference joined to the text beside it in a list.

- `$rep[1].` now offers a name declared in every branch of a `<conditionalContent>` or one-pick `<select>` inside the repeat, as `$cc.` and `$sec.` do, since `$rep[1].x` resolves to the active branch's `x`. A name declared both in the branches and beside the container is no longer offered there, as it names nothing.
- `$v[1].head.` for a plain `<vector name="v">` no longer offers `x`, `y` and `z`: an index on a component that takes none names nothing (`doenet-w0180`), and so does the rest of the path. The same holds for any property after such an index.
- In a list separated by spaces (`<mathList>`, `<textList>` and the other list tags), the editor shows a hint (`doenet-i0059`) on an entry where a reference is written with no space beside text or another reference, such as `2$a`, saying that it is one entry. `2 $a` is two entries and gets no hint, nor does a list separated by commas or a reference joined inside brackets.

The rule for lists is now also stated on the Essential Concepts page.

Closes #2479 and #2168.
