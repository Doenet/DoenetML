---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
"@doenet/doenetml-headless": patch
---

A document or aggregating section with nothing scored (no answers, or every answer `weight="0"`) now has a `creditAchievedIfSubmit` of 1 rather than `NaN`, matching `creditAchieved`. The `NaN` no longer spreads to the containers around it, and a section-wide check work over only weight-0 answers records a credit of 1 in its `submitted` event. `gradeState` in `@doenet/doenetml-headless` reports these documents with a credit rather than `NaN`.
