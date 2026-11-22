---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/doenetml-headless": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `$` written as a reference is a `$` in the value, a reference after a character reference is located where it is written, and a `<variantControl>` error gives no advice that doesn't work.

- **A `$` written as a reference is a `$` in the value.** `<textInput prefill="&#36;(x)"/>` prefilled `$`, an invisible zero-width space, then `(x)`, and `<text>&dollar;x</text>` was `$`, the space, then `x`. The space keeps the `$` from starting a reference, and is no longer in the value: these are `$(x)` and `$x`, in an attribute and in content. A zero-width space written right after a `$` is removed too.
- **A reference in an attribute after a character reference is located where it is written.** In `<math simplify="&lt; $nothing"/>`, the warning for `$nothing` was marked 3 characters early, by how much shorter `&lt;` is than what it stands for. Every reference, and every part of its path, is now marked where it is written, after any named (`&lt;`) or numeric (`&#x33;`) reference.
- **A tag made from a `<variantControl>` doesn't advise writing the reference.** `<text extend="$vc"/>` of a `<variantControl>` is an error (`doenet-e0065`) that ended "To show it as it is, write `$vc`". A `<variantControl>` shows nothing, so the error now says that instead.

Part of #2509 (PR 45). Closes #2637.
