---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/doenetml-headless": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fixes for documents that hung or broke, and for diagnostics that depended on the variant or on what a reader did:

- **A point's label that shows another point which is a copy of it no longer hangs the document.** `<point name="a"><label>$b</label></point><point name="b" extend="$a"/>` (or `copy="$a"`) froze the page while it loaded. It is now the error `doenet-e0005` at `$b`, and the rest of the document renders. The same holds when `$b` is in a `<text>`, an `<m>` or a `<group>` in the label, or when two points are each other's label. In a `<math>` or a `<number>`, which read the point's value, it stays valid.
- **An index past the end, and back, no longer leaves a group in error.** With `<group name="s">$ls[$i]</group>` shown by `$s`, `$s` became `doenet-e0005` once `i` passed the end of `ls`, and stayed blank when `i` came back. It is now blank only while `i` is past the end.
- **A `$` written as `&#36;` or `&dollar;` in an attribute read as text** (`staticName="a&#36;1"`, `permid`) is a `$`. Before, it was the error `doenet-e0090`.
- **A `$` written as `&#36;` or `&dollar;` before `(` or before `$`** (`<p>&#36;(x)</p>`, `<p>&#36;$f</p>`) is formatted back as text, not as a reference. Before, formatting the document changed its meaning.
- **A group and a component in it that are each hidden by their own `hidden`** (`<group name="g" hide="$g.hidden"><number name="n" hide="$n.hidden">`) are each `doenet-e0005`. Before, only the number's was reported. A component hidden by whether something it holds is hidden (`<group hide="$n.hidden">` around `n`) is `doenet-e0005` at load too.
- **An index after a `<select>` or `<conditionalContent>` whose options or cases all hold several components** (`$s[1][2]`) is the warning `doenet-w0191` when the document loads, as a property after one already was. Before, it was `doenet-w0188` only once the document ran. An option or case holding a `<group>` of several components counts as holding several, so a `<select>` whose options differ in that way gets `doenet-w0191` in every variant, where before only the variants picking the group were warned. Where only some options or cases hold several, the `doenet-w0188` for the one picked or shown now is an info. When the component the index would select has the same name in every option or case, `doenet-w0191` suggests that name (`$s[1].q` for `$s[1][1]`), as `doenet-w0188` did.

The references page has a new section on writing a literal `$` before a name.

Part of #2643.
