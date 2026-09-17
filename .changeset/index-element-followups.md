---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A reference's path now carries on past an element written between its index brackets.

```xml
<pointList name="pts">(1,2) (3,4)</pointList>

<p>$pts[<number>2</number>].x</p>
```

renders `3`. Until now the path stopped at the bracket and the `.x` was left as literal
text beside the whole point. A property, a further index, or both may follow —
`$pts[<number>2</number>].xs[1]` works the same way — and what is claimed is exactly what
a written-out path would have claimed, so a space or a stray dot still ends the reference
where it always did.

Editor support inside the brackets has caught up. With the cursor in an element written
there, attribute and tag completion and hover work again, and a name given to that element
can be referenced from the rest of the document.

An invalid attribute on an element in an index now names the component as written. A lone
`<number>` between the brackets is converted to a whole number on the way through, and the
error reported that conversion's `<integer>` — a component the author never wrote.

A reference whose index cannot be worked out now reports instead of stopping the document.

```xml
<numberList name="myList">100 300 200 50</numberList>
<indexOf name="io" tolerance="1e-6" target="100">$myList</indexOf>

<p>$myList[$io]</p>
```

`tolerance` is not an attribute of `<indexOf>`, which was already reported — but the
reference then failed outright and the reader got a blank page with the explanation lost
along with it. The mistake is now shown, the rest of the document renders, and the
reference says why it came up empty. A computed index on a function reference that is then
called, as in `$$f[$k](3)`, stopped the document the same way and no longer does.

One shape gained a warning it should always have had: `$$f(<math>3</math>)[<number>1</number>]`
said nothing at all, where the same brackets after a plainly written argument list have
been reported for a while. Neither can index, and both now say so.
