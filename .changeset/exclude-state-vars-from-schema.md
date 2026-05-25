---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Stop offering plumbing state variables as author-facing properties.

Editor autocomplete and context-help no longer suggest the renamed-aside or pre-processed state variables that components keep around as runtime scaffolding — `disabledOriginal`, `valuePreRound`, `valuePreOperator`, `valuePrePluralize`, `originalValue`, and `colorCorrectnessPreliminary`. The derived author-facing names (`disabled`, `value`, `colorCorrectness` attribute, …) stay available; only the internal twin is hidden from the schema.
