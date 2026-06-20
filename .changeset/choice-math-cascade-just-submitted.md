---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Answer: fix the check-work button getting stuck on "Checking..." for a choice answer with inline math inside a repeat in a `<cascade>`.

A `<choice>` computes its `text` from its inline children's `hiddenIgnoreParent` so that it ignores the visibility it inherits from ancestors (a choice's text feeds an answer's credit-achieved dependencies, and inside a `<cascade>` ancestor visibility changes after a submission). However, `hiddenIgnoreParent` still climbed up to ancestor sections through its source composite's `hidden` — so a choice with an `<m>` placed inside a `<repeat>`/`<repeatForSequence>` within a `<cascade>` still depended on the cascade's credit-based visibility. Submitting such an answer changed its own credit-achieved dependencies, which immediately reset `justSubmitted` to `false`, leaving the "Check Work" button spinning indefinitely. `hiddenIgnoreParent` now recurses through the source composite's and adapter source's `hiddenIgnoreParent` instead of `hidden`, so it no longer depends on ancestor-section visibility.
