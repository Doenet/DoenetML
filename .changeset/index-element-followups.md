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
there, tag and attribute completion and the help panel work again, a reference written
there resolves, and a name given to that element can be referenced from the rest of the
document.

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

An element index on a function reference that is then called now works, where it was
previously left as literal text with a warning.

```xml
<group name="fs">
  <function variables="x">x^2</function>
  <function variables="x">x^3</function>
</group>
<numberList name="powers">2 3</numberList>

<p>$$fs[<indexOf target="3">$powers</indexOf>](3)</p>
```

renders `27`. An index written before a function reference's arguments picks which
function to call, so this asks the same question `$$fs[2](3)` does, with the position
worked out rather than written down. `$$fs[$i](3)` was what stopped the document before,
and it is what made this shape unsafe to accept.

Two shapes gained a warning they should always have had. Brackets written after a function
reference's arguments cannot index, and `$$f(3)[<number>1</number>]` has said so for a
while — but `$$f(<math>3</math>)[<number>1</number>]` and
`$$fs[<number>2</number>](3)[<number>1</number>]` said nothing at all. All three now give
the same reason.
