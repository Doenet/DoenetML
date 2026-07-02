---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Problems: preserve list numbering through an intervening `<cascade>`.

When `<problem>` elements sit inside a `<cascade>` inside `<problems>`, the cascade is now treated as a transparent structural container for `asList` propagation. The problems receive the expected list numbering (`1.`, `2.`, `3.`), and the cascade itself no longer incorrectly renders as list item `1`.

Closes #1390.
