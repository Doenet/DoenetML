---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
"@doenet/v06-to-v07": patch
---

A reference that depends on itself through what is written is now reported when the document loads, and the rest of the document renders. `<text name="t">$t</text>`, `<math name="z" extend="$z"/>`, two maths that read each other (`<math name="z1">$z2</math><math name="z2">$z1</math>`), and a math that indexes itself (`<math name="m">(1, $m[2])</math>`) each give a circular-dependency error (`doenet-e0005`) at every reference on the cycle, and are shown as that error. Before, the document failed to load, or, for the math that indexes itself, failed with an internal error.

The cycle is found over every case of a `<conditionalContent>`, every option of a `<select>` and every repeat template, whether shown or not, so the error is there from the start. A reference or copy elsewhere of a component that holds the cycle (`$x`, `<math extend="$x"/>` or `<p copy="$q"/>` of `<p name="q"><math name="x">$x+1</math></p>`, or `<module extend="$m"/>` of a module holding one) can report the error again, without a code, as for any error a reference copies (#2449): when the document loads, or, for a name declared in a case or option, once that case is shown or that option picked. Two `<conditionalContent>`s whose cases extend each other now give an error at both extends when the document loads, where they used to report one only after the case became true (and, with an `<else>`, an internal error too).

`<group extend="$cc.x"/>` (or `<group extend="$x"/>`) of a name that every case of a `<conditionalContent>` declares now follows the case, and `<group extend="$r[2]"/>` of an iteration of a `<repeat>` follows the repeat when its number of iterations changes. They used to report a circular dependency where there was none (for the case, at its first change; for the repeat, once the iteration was withheld), and then stay empty.

A tag extending something in an iteration of a `<repeat>` that is withheld after the document loads (`<math extend="$r[2].m"/>`, `<number extend="$r[2].io[1]"/>`) now gives the same info (`doenet-i0054`) as when the iteration is not there at load. Before, it gave no info, or kept an info about a value it no longer showed.

A tag whose error was decided at load, such as `<math extend="$g"/>` inside the `<group name="g">` it extends when the group holds two components, or `<math extend="$r"/>` in the template of the `<repeat>` named `r`, no longer also reports a circular dependency (`doenet-e0005`) once it is made.

The v0.6-to-v0.7 converter still treats a document with a reference cycle as one it cannot load, and leaves its `<copy>` tags as they are, as it did when the cycle stopped the load.

Closes #2439, #2453 and #2430.
