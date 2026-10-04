---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

A reference used only for its value, such as `$n` inside `<math>$n+1</math>`, `$i` inside a `<repeatForSequence>`, or `$P.x` inside a `<number>`, now resolves its own reference instead of being made by a copy component that resolved it for it. When the document already says what the reference reads (a number, math, text or boolean, or a prop or coordinate of one), the reference is one component with a handful of state variables, and the copy component with its dozens of state variables and dependencies is not created. Documents with many such references load faster and use less memory. What the reference shows is unchanged, and a write through it still reaches the referenced component. A reference whose referent or type is only known once the document runs, such as `$l[2]` into a list or the value of a `<repeat>` over a list, is still resolved by a copy.
