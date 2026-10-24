---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fixes for a `link` attribute written on a copy or an extend:

- `LINK="false"`, or `link` in any other letter case, on a component with `copy` used to report `Cannot repeat attribute link.` It is now accepted.
- `link` on a list's copy or extend, such as `<mathList extend="$ml" link="false"/>`, used to report that the list does not take a `link` attribute. On an extend it now applies, so that extend is unlinked. On a copy it is treated as on any other copy, as the next item says.
- A `copy` is never linked to what it copies, so a `link` written on one with any value but `false` is now ignored with a warning. Before, it was ignored silently, or reported as an error when written in a different case. A `link` written twice on a copy, in two letter cases, is dropped the same way, with a warning for each one that isn't `false`.

A `<moduleAttributes>` child named like a camel-cased attribute of `<module>` itself, such as `asList`, now gets the same warning as one named `hide` or `rendered`: the name is already taken, and the child keeps its own value. Before, setting that attribute on the module or on a copy of it stopped the document with `A module attribute that isn't an existing attribute must be unresolved!`. One named `isResponse` or `isPotentialResponse` was instead taken as a module attribute when set; it now gets the warning too, as the rule for a module's own attribute names says.

Closes #2326.
