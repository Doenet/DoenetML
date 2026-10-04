---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A reference inside an `<award>` that its `<answer>` records as a response is now one small component that reads the referenced value, as other references used only for their value already were. Before, it was made by a copy component that made a full component with its own display settings. Such references include the `$mi` in `<answer><award><when>$mi = x</when></award></answer>` when the answer has no input of its own, and a reference an award names in `referencesAreResponses`. Answers that check inputs placed outside them, as many assignments do, load faster and use less memory. The answer records the same responses with the same types, and awards the same credit.
