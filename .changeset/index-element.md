---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/v06-to-v07": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

An element can now be written between a reference's index brackets.

```xml
<numberList name="myList">100 300 200 50</numberList>

<p>$myList[<indexOf target="100">$myList</indexOf>]</p>
```

renders `100`. Until now the element there was silently dropped as an index: the
reference expanded in full, the brackets survived as literal text, and the element
rendered its value between them — `100, 300, 200, 50[1]` — with nothing reported.

Any element works, not just `<indexOf>`, and the brackets may hold a mixture of text,
references and elements the way `$myList[$k + 1]` already could. Naming the element and
referencing it — `<indexOf name="io" …/>` then `$myList[$io]` — remains fully supported
and is still the better form when the same position is wanted more than once.

Two shapes still cannot take an index, because the reference has already ended before
the brackets: `$(x)[…]`, where the closing paren ended it, and `$x{z}[…]`, where a
`{…}` block did. Those now say so instead of rendering the element between literal
brackets. For `$(x)[…]` the index belongs inside the parentheses; for `$x{z}[…]` the
remedy is to delete the `{…}`, which v0.7 drops on the floor anyway.

A name written on an element inside an index resolves from the surrounding document,
and the element itself is not rendered where it was written.
