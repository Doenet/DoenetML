---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A point or vector whose coordinates are written with references, such as `<point>($i, 2$i)</point>` or the vertices of `<polygon vertices="($a, 1) (3, $a)"/>`, now holds its coordinates itself instead of creating a component for each coordinate and for the list of them. Documents with many such points create fewer components and load faster: a page of 150 such points in a repeat loads about 10% faster. What documents compute and display is unchanged, and a dragged point writes each coordinate where it wrote before.
