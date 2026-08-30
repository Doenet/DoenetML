---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

The `text` property of an `<md>` reads an aligned display whose rows use a
literal `&`.

`<md><mrow>q &amp;= \sin(x)</mrow></md>` and the same display written with
Doenet's `\amp` macro render identically, but only the macro spelling was
stripped before each row was parsed. A row aligned with `&` could not be read,
and `text` silently handed back the raw LaTeX — `\notag` and `\\` included —
instead of the plain-text expression. Both spellings are now removed, by one
helper shared with the accessible name of an embedded math input. That name
also reads a marker that opens a row correctly now, instead of breaking the
`\\` before it.
