---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fix two autocomplete papercuts when typing an unquoted attribute value.

- The wrap-in-quotes / value-completion hint for a bare value past `=` (e.g. `<math name=hello`) now also fires inside a parent element. Previously the parser's error-recovery wrapped the bare run in an `AttributeValue` node when the partial element was followed by `</...>` or another `<`, which masked the bare-value branch. The cursor-position detector now distinguishes a real quoted value (starts with `"`/`'`) from this recovered form.
- The value popup no longer flickers closed when whitespace follows `=` (e.g. `<math simplify= full`). The CodeMirror gate that decides whether to ask the LSP for completions now treats whitespace immediately following `=` as "still in trigger reach," so typing a space after `=` doesn't close the popup that opened on `=`. Scoped to `=` only — other server triggers (`<`, `/`, `"`, `'`) don't reopen the popup across whitespace, so `<math name="hello" ` behaves like `<math ` and waits for a letter before suggesting attributes.
- Typing the *closing* quote of an attribute value (e.g. `<math name="hello"`) no longer pops a popup of attribute names. `"` and `'` are server trigger characters so the opening quote can pop value completions, but the gate now distinguishes openers from closers by walking back to a matching quote on the line, so closers behave like `<math ` and wait for a letter before suggesting attributes.
