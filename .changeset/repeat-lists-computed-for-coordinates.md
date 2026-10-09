---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<repeat>` whose template is one `<math>`, `<number>` or `<point>` now keeps its values in one component in two more cases: when it repeats over a property whose value is a list, such as `for="$it.allIteratesWithInitial"` of a `<functionIterates>`, and when its template reads one coordinate of the value, such as `<point>($i, $x[1])</point>`. A simulation that plots its iterates with such repeats creates far fewer components and loads faster. A value written to such a coordinate lands on that coordinate of the list's entry, as before. A coordinate past the value's dimensions now reads as a blank, as `$m[2]` of a single `<math>` does, instead of being left out, and a value written to it extends the entry, as a write to `$l[2][2]` does. A template that is one value alone, such as `<math>$x</math>` or `<math>$x[1]</math>`, again shows it with the display settings (`displayDigits`, `displayDecimals`, …) of the list it reads, as does a reference to the repeat.
