---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Report a function reference whose name names nothing the same way as a plain reference. `$$f(2)` with no `f`, or with more than one `f`, now gets the warning `$f` gets ("No referent found for reference" or "Multiple referents found for reference"), quoting the whole function reference, such as `$$f(2)`. It used to get a warning with no code that didn't say which reference failed ("Ref resolution error: No node identified by path"). In a `<math>`, the missing value now shows as `＿`, as it does for `$f`: `<math>$$f(2)+1</math>` shows `＿ + 1` rather than `+1`.
