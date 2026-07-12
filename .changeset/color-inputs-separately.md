---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

New `colorInputsSeparately` attribute on `<answer>`: when set, each input is
colored based on the awards that reference it rather than all inputs sharing the
same overall credit color. Works with `<fractionInput>` (coloring numerator and
denominator boxes independently) and with multiple `<mathInput>`s connected via
`forAnswer`. Requires `numAwardsCredited` ≥ 2 for meaningful results.

Also renames `forceIndividualAnswerColoring` → `colorAnswersSeparately` on
sectioning components (section, exercise, problem, etc.) for naming consistency.
The old name is deprecated and rewritten at parse time with a warning.

Closes #1389.
