---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

`<slopeField>` and `<vectorField>` take their function as a child rather than a `function` attribute, and gain a `variables` attribute.

The `function` attribute is gone. A field's function is now written inside the component, either as a bare expression — `<vectorField>(y, -x)</vectorField>` — or as a `<function>` child, which may be a reference to one declared elsewhere. The two ways of saying the same thing were doing the same work: the bare expression was already being turned into a `<function>`, and the attribute created one too, so an author had to pick between forms that could not differ.

The new `variables` attribute names the inputs of a bare expression, in order, and defaults to `x y`. `<slopeField variables="s t">s - t</slopeField>` reads that equation in the letters its author wrote it in, rather than requiring an explicit `<function variables="s t">` for the sake of two names. It is the same `variables` a `<function>` takes, and it is moved onto the wrapping `<function>` rather than read, so the names may themselves be references: `<vectorField variables="$v1 $v2">($v2, -$v1)</vectorField>` lets a student name the variables through a pair of `<mathInput>`s and the field follows as they type. It has no bearing on a `<function>` child, which names its own variables and is used exactly as written; writing both warns, rather than letting one of them silently do nothing, as does writing `variables` on a field with no expression inside it at all.

A field also no longer takes a `<label>`. It covers the whole visible region, so there is nowhere for a label to sit, and none was ever drawn; one written on a field is now reported as the invalid child it is rather than accepted and ignored. The `labelIsName`, `applyStyleToLabel` and `maskLabel` attributes go with it, having nothing left to name, style or mask. `<pegboard>` is in the same position and is unchanged for now.

A field whose function takes a single input now respects that function's `domain`. Such a function was being called with the lattice's `y` as a second argument, which is not a second input but a flag that suppresses the domain check, so marks were drawn right across the interval the function's author had excluded — everywhere except along `y = 0`.
