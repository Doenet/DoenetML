---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A reference used only for its value, such as `$n` inside `<math>$n+1</math>` or in an attribute like `displayDigits="$n"`, now creates one small component in place of a full copy of the referenced component and the shadow attribute components that came with it. Documents with many such references load faster and use less memory. What the reference shows is unchanged, and a write through it still reaches the referenced component. A reference now agrees with the component it refers to on whether that component can be changed and whether it is unordered, which an author can see in two ways. A `<mathInput>` bound to an expression such as `$r + $w` now changes `w` in some cases where `r` cannot be changed and the write used to be refused, such as when `r` is a fixed `<mathInput>` or a `<math>` holding only a fixed component. And a comparison with a reference to a math that is unordered because of what it holds, such as `$m = (2,1)` with `<math name="m">$u</math>` and `u` unordered, is now true. One more visible difference: a `<collect>` no longer gathers the component such a reference used to create, so `<collect componentType="number">` over a section containing `<math>$n+1</math>` or `<text>$n</text>` no longer lists a second copy of `n`.
