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
the brackets: `$(x)[…]`, where the closing paren ended it, `$$f(1)[…]`, where the
argument list did, and `$x{z}[…]`, where a `{…}` block did. They still render the
element between literal brackets, as they always have, but each now warns and says what
to write instead — for `$(x)[…]` give the element a name and write the index inside the
parentheses, as `$(x[$idx])`, and for `$$f(1)[…]` give the result of the call a name and
index that.

For `$x{z}[…]` the remedy is to delete the braces, because **`{…}` written after a
reference is not v0.7 notation.** It is left over from v0.6. The parser still accepts
it, but nothing downstream reads it: whatever is written inside has no effect at all.

```xml
<number name="x">7.123456789</number>

<p>$x{displayDigits="8"}</p>                     <!-- renders 7.12      -->
<p><number extend="$x" displayDigits="8" /></p>  <!-- renders 7.1234568 -->
```

Attributes belong on an element, as the second line shows — which is what the v0.6 to
v0.7 converter already produces, so upgraded documents are unaffected and this is only
a trap for v0.7 written by hand. Note that only the index case says anything: a `{…}`
block on its own is still discarded silently, and the notation is expected to be
removed in a future version.

Writing an element as a function reference's argument — `$$f(<math>3</math>)` — no longer
stops the document. It parsed correctly, but registering the names in it hit a node
whose parent was the reference rather than an element, and the document failed to load.

A comment written among those arguments no longer renders. `$$f(<!-- c --><math>3</math>)`
showed `9 c²` — the comment's own words arrived as content and were read as maths — and
an XML instruction leaked the same way. Both are now removed before the document is
built, as they already were everywhere else, while still surviving a reformat.
