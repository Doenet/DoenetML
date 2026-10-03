---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

A reference used only for its value, such as `$n` inside `<math>$n+1</math>` or in an attribute like `displayDigits="$n"`, now creates one small component in place of a full copy of the referenced component and the shadow attribute components that came with it. Documents with many such references load faster and use less memory. What the reference shows is unchanged, and a write through it still reaches the referenced component. One write now succeeds that used to be refused: a `<mathInput>` bound to an expression such as `$r + $w` whose `r` is fixed now changes `w`. One visible difference: a `<collect>` no longer gathers the component such a reference used to create, so `<collect componentType="number">` over a section containing `<math>$n+1</math>` or `<text>$n</text>` no longer lists a second copy of `n`.
