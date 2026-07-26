---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Give stable codes and translatable messages to the remaining directly authored
diagnostics in the worker: the PreFigure renderer's fallbacks, `<updateValue>`,
`<copy>`, `<collect>`, `<dataFrame>`, `<answer>` and section-wide check work,
`<module>` attributes, `<conditionalContent>`, `<slider>`, pretzel validation,
`<mathInput>` function names, and invalid attribute values. Lists and counts in
these messages now agree through the catalog rather than through string
concatenation.
