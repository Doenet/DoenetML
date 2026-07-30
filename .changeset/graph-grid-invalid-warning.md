---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Graph: warn about an unusable `grid` value instead of failing.

A `grid` whose pieces could not be parsed — `grid="(1, 2)"`, where the space falls inside the parentheses — took the whole document down with a red `Expecting ) or ]` box. It is now reported as an invalid value like any other.

Values that were already ignored in silence, such as `grid="(1,2) (3,4)"`, `grid="0 1"`, and `grid="1"`, now say so: the warning names the value and the forms `grid` accepts. A value that comes from a reference stays quiet, since an unfilled `<mathInput>` is not an authoring mistake.

The editor's own description of `grid` was offering values it never accepted — `off`, `minor`, `major`. It now describes the values it does accept.
