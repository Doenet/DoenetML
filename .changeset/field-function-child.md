---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

`<slopeField>` and `<vectorField>` take their function as a child rather than a `function` attribute, and gain a `variables` attribute.

The `function` attribute is gone. A field's function is now written inside the component, either as a bare expression — `<vectorField>(y, -x)</vectorField>` — or as a `<function>` child, which may be a reference to one declared elsewhere. The two ways of saying the same thing were doing the same work: the bare expression was already being turned into a `<function>`, and the attribute created one too, so an author had to pick between forms that could not differ.

The new `variables` attribute names the inputs of a bare expression, in order, and defaults to `x y`. `<slopeField variables="s t">s - t</slopeField>` reads that equation in the letters its author wrote it in, rather than requiring an explicit `<function variables="s t">` for the sake of two names. It is the same `variables` a `<function>` takes, references included, so `<vectorField variables="$v1 $v2">($v2, -$v1)</vectorField>` lets a student name the variables through a pair of `<mathInput>`s and the field follows as they type. It has no bearing on a `<function>` child, which names its own variables and is used exactly as written.
