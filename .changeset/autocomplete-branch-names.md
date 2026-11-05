---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: autocomplete now offers names declared in the cases of a `<conditionalContent>` or the options of a `<select>` that picks one, from outside the container, when every branch declares the name with the same tag. These names became visible from outside in an earlier change, but autocomplete still left them out.

- Typing `$` outside such a container offers `$x` when every `<case>` and the `<else>` (or every `<option>`) declares `x` with one tag, and its detail and help describe that tag. A name only some branches declare, or that branches declare with different tags, is still left out, since it doesn't resolve.
- `$cc.` and `$s.` (for a `<select>` that picks one) list only the names every branch shares, and `$s[2].` does the same for a `<select>` of any number of picks. A name only some branches declared used to be offered there too.
- `$x.` for such a name offers what every branch's `x` shares.
- A `<select>` that picks more than one keeps its option names private, as before.

Closes #2455.
