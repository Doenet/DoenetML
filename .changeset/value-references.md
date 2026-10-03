---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

A reference used only for its value, such as `$n` inside `<math>$n+1</math>`, in an attribute like `displayDigits="$n"`, or between index brackets, now creates one small component in place of a full copy of the referenced component and its six shadow attribute components. Documents with many such references load faster and use less memory. What the reference shows and how writes through it reach the referenced component are unchanged. One visible difference: a `<collect>` no longer gathers the component such a reference used to create, so `<collect componentType="number">` over a section containing `<math>$n+1</math>` or `<text>$n</text>` no longer lists a second copy of `n`.
