---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<repeat>` or `<repeatForSequence>` whose template is, or holds, an `<abs>`, a `<round>` or a function evaluated with `<evaluate>` or `$$f(…)`, such as a Riemann sum's terms `<math>$$p($$ldeltat($i-1+$side))*$deltat</math>` or the points of a function's graph `<point>($v, $$f($v))</point>`, now keeps its values or points in one component, shown and drawn as before, instead of making a copy of its template for each one. This applies when the function is one reference to a function outside the repeat, and what a `<round>` rounds to is written as a whole number; otherwise the repeat works as before. A value written to an `<abs>` or a `<round>` goes where it went before, and a function's value is still not written to.
