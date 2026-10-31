---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A copy of an `extend` keeps the referents of the extend's source. A reference
in the copy to a component outside what was extended now points at the
component the original points at, instead of at a component of the same name
next to the `extend`. This holds along any chain of copies and extends. In a
copy of an `extend` of a `<group>`, a reference to another component inside
the group, such as `$g.x` inside `<group name="g">`, now points at the copy's
own `x` instead of the original's.
