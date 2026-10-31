---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A reference resolves where it is written, among what is written. Content made by
a `copy` or `extend` is found only through the name of the copy (`$S2.h`), never
by a name on its own, even from a child written inside the copy tag. A child
added inside `<section copy="$S" name="S2">` now resolves `$h` as it would next
to the copy, instead of finding the copied `h`. An attribute on a `copy`,
`extend` or `<module copy>` now resolves like any other attribute: it sees the
children written inside the tag, so `<section copy="$S" hide="$h"><boolean
name="h">true</boolean></section>` is hidden, but still not the copied content.
An attribute on a module's own definition also sees what is written inside the
module, ahead of a same-named component outside it. One that names one of the
module's own attributes, such as `<module xmin="$xmin">` with a
`<number name="xmin">` in its `<moduleAttributes>`, refers to that attribute.
Since that would make it depend on itself, it is now reported with an error and
the module attribute keeps its own value. Before, it gave a "Multiple referents"
warning when a same-named component was outside the module, and otherwise
stopped the document with a circular dependency.
