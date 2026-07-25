---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Give stable codes and translatable messages to the diagnostics raised by the
math components: `<circle>`, `<function>`, `<sequence>` and
`<selectFromSequence>`, `<animateFromSequence>`, `<odeSystem>`, `<angle>`,
`<parabola>`, `<intersection>`, and the ionic-compound and eigendecomposition
helpers. Counts inside these messages now agree with their nouns through the
catalog rather than through string concatenation.
