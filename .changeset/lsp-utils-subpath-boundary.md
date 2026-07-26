---
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Stop the language server from pulling `@doenet/utils`' root barrel in for a
single function. The math-input function-name helpers now have their own entry
point, which shrinks that import from 65 KB to under 1 KB and keeps the
extension's startup path clear of math-expressions and the AST helpers.
