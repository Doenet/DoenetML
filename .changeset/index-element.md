---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
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
references and elements the way `$myList[$k + 1]` already could. What is written
between the brackets sees the rest of the document, so a reference in there resolves
as it would anywhere else — `$myList[<indexOf target="$wanted">$myList</indexOf>]`
finds `$wanted` — and the element is not rendered where it was written. Naming the
element and referencing it — `<indexOf name="io" …/>` then `$myList[$io]` — is still
the better form when the same position is wanted more than once, and is the way to
reach a property after the index, as below.

One more shape is left alone for a different reason: an index on a function reference
that is then called, as in `$$f[<number>1</number>](3)`. An index there picks which
function to call rather than part of what it returns, and a computed one is not
supported, so the brackets stay literal and warn rather than failing to build. To index
what a call returns, give the result a name and index that.

Two rough edges to know about. A reference's path stops at the index, so
`$pts[<number>2</number>].x` renders the point and a stray `.x` rather than the
x-coordinate; name the element and write `$pts[$i].x` for that. And editor support
inside the brackets lags: once the brackets balance, attribute and tag completion and
hover no longer see the element between them, though while they are still unbalanced —
which is most of typing — it is an ordinary child and the editor behaves as usual.

Three shapes still cannot take an index, because the reference has already ended before
the brackets: `$(x)[…]`, where the closing paren ended it, `$x{z}[…]`, where a `{…}`
block did, and `$$f(1)[…]`, where the argument list did. They still render the element
between literal brackets, as they always have, but each now warns and says what to
write instead — for `$(x)[…]` give the element a name and write the index inside the
parentheses, as `$(x[$idx])`; for `$$f(1)[…]` give the result of the call a name and
index that; and for `$x{z}[…]` no braces at all, which v0.7 drops on the floor anyway.

Writing an element as a function reference's argument — `$$f(<math>3</math>)` — no longer
stops the document. It parsed correctly, but registering the names in it hit a node
whose parent was the reference rather than an element, and the document failed to load.

A comment written among those arguments no longer renders. `$$f(<!-- c --><math>3</math>)`
showed `9 c²` — the comment's own words arrived as content and were read as maths — and
an XML instruction leaked the same way. Both are now removed before the document is
built, as they already were everywhere else, while still surviving a reformat.
