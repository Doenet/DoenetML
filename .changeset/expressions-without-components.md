---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

An attribute written as an expression over references, such as `hide="not $b"`, a case's `condition="$x > 9"`, a line's `equation="y = $a x + 1"` or a curve's `parMax="2 $a"`, is now held by its component instead of creating a component for the expression. So is a point whose coordinates read a `<max>` or `<min>`. Documents with many such attributes create fewer components and load faster. What documents compute and display is unchanged.
