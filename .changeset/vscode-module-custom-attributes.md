---
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

VS Code extension: stop flagging custom `<module>` attributes as unknown when they are declared inside the copied module's `<moduleAttributes>` block.

The extension now passes its bundled DoenetML worker to the language server so the Rust-backed resolver can inspect the referenced module definition before validating a `<module copy="$name" ... />` site.

Closes #1375.
