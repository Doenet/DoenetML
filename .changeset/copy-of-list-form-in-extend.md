---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `copy` or `extend` of a `<collect>` inside an `extend` now shows what the
`<collect>` collects, instead of nothing with the warning "No source found for
collect". For example, with `<group name="gB" extend="$A.g"/>` where `A.g`
holds `<collect name="x" componentType="text" from="$h"/>`,
`<collect copy="$B.gB.x"/>` and `<collect extend="$B.gB.x"/>` now show the
same as `$B.gB.x`. Attributes set on such a copy, such as `maxNumber`, apply
to what it collects. A `copy` or `extend` of a `<sort>` or `<shuffle>` of
values inside an `extend` is made the same way.
