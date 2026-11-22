---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

More names are matched exactly, as written (D51), and a few more messages suggest the name written in another case:

- A `<module>`'s own attributes, declared in its `<moduleAttributes>`, are matched exactly. `<module copy="$mod" A="5"/>` for a declared `a` sets `a`, as before, but now with the warning `doenet-w0197` that other attributes in another case get, saying it will be an error in a later release; before, it was silent. With both `a` and `A` declared, each attribute sets the one of its own name, where before `A="5"` set both.
- The element of an external reference (`copy="doenet:…"`) and the external content merged into it follow the same rule: `Copy="doenet:…"`, `Name` or `Simplify` written in another case is given its spelling, with `doenet-w0197`. An external `Name` is the external document's `name`, where before it could become the `name` of the element it was merged into. An attribute written on the element takes precedence over the external one, also when one of them is in another case, where before the two clashed, and the one in another case was an attribute the component doesn't have (`doenet-e0004`).
- A property that names an array entry in another case suggests the entry by index: `$P.X1` suggests `$P.xs[1]`, `$poly.Vertex2` suggests `$poly.vertices[2]` (`doenet-w0104`), where before there was no suggestion.
- `<updateValue>` and `<animateFromSequence>` with a `target` whose property is in another case (`target="$n.Value"`) suggest it (`value`) in their warning (`doenet-w0044`).
- A `<sort>` or `<sortIndices>` whose `sortByProp` names no property of the items it sorts is a warning when the document loads (`doenet-w0198`). Before, the items were left unsorted, silently. They still are. (One naming a property in another case, `sortByProp="X"`, is applied with `doenet-w0197`: see the changeset for an attribute written twice and names written as values.)
