---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A name inside a `<conditionalContent>` or a one-pick `<select>` is visible outside it, as a `<group>`'s is, and resolves only if every branch declares it with the same type.

- **A plain `$x` from outside finds the `x` in the active case** of a `<conditionalContent>`, as `$cc.x` does, and in the picked option of a `<select>` whose `numToSelect` is written as `1` or left out. It used to name nothing, with a warning. Two cases declaring `x` don't make it ambiguous; an `x` beside the `<conditionalContent>` does. With no `<else>`, an `x` in every case is enough: while no case is active, `$x` names nothing. A `<select>` that picks several keeps its names private: a name in one pick is reached with an index (`$s[2].x`), under the same every-option, same-type rule, as is `$s[1].x` on a `<select>` that picks one.
- **A name some branch lacks, or that two branches declare with different types, names nothing**, with a new warning at the reference that says which branch lacks it (`doenet-w0183`) or which types differ (`doenet-w0184`). `$cc.x` used to show the active case's `x`, whatever its type, or, while the active case had no `x`, what that case held. On a tag (`<math extend="$cc.x"/>`), a missing name is an error, as is a name that can be absent because there is no `<else>`; different types stay the error they were (`doenet-e0066`).
- **A property the referent doesn't have** (`$n.nonexistent`, `$$f.x(2)`) is now a warning (`doenet-w0104`), where it was silent. A property it has, with no value now (`$P.z` of a point in two dimensions), stays silent.

Closes #2450.
