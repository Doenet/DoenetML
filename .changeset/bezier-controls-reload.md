---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A curve's bezier control vectors that were dragged into place now keep their positions after a reload. Previously, a control vector the document did not give a value for, such as the second vector of `<controlVectors direction="both">(-1,5)</controlVectors>` or a symmetric control vector with none given, went back to its default when the saved state was loaded, as did a control's direction changed from the curve.
