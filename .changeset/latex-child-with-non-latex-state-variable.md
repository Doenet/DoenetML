---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/v06-to-v07": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fix `<latex>` crashing when one of its children lacks a `latex` state variable. Constructs like `<latex><text>foo</text></latex>`, `<latex>$mathInput.latex</latex>` (where `<mathInput>` does not expose a `.latex` prop), or any reference whose resolved component lacks `latex` previously raised "Unknown state variable latex of `<idx>`" from the worker, which leaked the internal state-variable name to the rendered viewer. The `<latex>` value-dependency now marks `text`/`latex` as optional on its children, matching `<m>`/`<me>`/`<md>`, so children without `latex` fall back to their `text` value.
