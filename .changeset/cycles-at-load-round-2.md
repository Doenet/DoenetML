---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/doenetml-headless": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fewer false circular-dependency errors around a section's number, and more documents with cycles load (D61, DIAG-5).

- **A section's number and a `condition`.** A reference to a section's number (`$s.sectionNumber`, `$s.ownNumber`, `$s.title`) inside a composite before the section is a circular-dependency error (`doenet-e0005`) found when the document loads only when it can change how many sections the composite makes: a `<repeatForSequence>`'s `from`, `to` or `length`, a `<repeat>`'s `for`, a `<select>`'s `numToSelect`. One in a `condition` of a `<conditionalContent>` or a `<case>`, or a `selectWeight`, can only switch which case is shown, so it is no longer reported when the document loads. If the document settles, it loads with no error: `<group><conditionalContent condition="$s.sectionNumber = 2"><section/></conditionalContent></group>` before `s` was an error, and now loads with `s` numbered 1. If it never settles, the loop is reported at the `<conditionalContent>`, or at the reference to the number as before.
- **More than one cycle.** A document with two or more independent circular dependencies that the checks made when it loads don't find no longer stops: each is a `doenet-e0005` where it is written, and the rest renders. A document with more than five such cycles still stops.
- **In a chain of copies,** the error is at the copy that writes the attribute the cycle runs through. With `<number extend="$k" name="n"/>` and `<number extend="$n" name="m" hide="$m.hidden"/>`, the document stopped, and is now an error at `m` only.
- **Within one attribute,** a reference to a section's number that the cycle doesn't run through is no longer blamed. In `<number name="n" hide="$s.hidden and $s.sectionNumber=1">` with `<section name="s" hide="$n.hidden"/>`, the cycle runs through `$s.hidden`, and the error was at `$s.sectionNumber`; it is now at `$n.hidden`.
