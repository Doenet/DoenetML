---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/doenetml-headless": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A name or property after a collection (D59) is now checked in a few more cases, and a few references that were silent or reported too much now behave as the rest do:

- **Two indices into an item that holds a `<conditionalContent>` or `<select>` holding a list** (`$o3[1][1].x`) name nothing, with `doenet-w0200` suggesting `$o3[1][1][1].x`. Before, they read every entry's `x`, silently.
- **A name from a `<repeat>` or a `<select>` of several inside a `<sort>`, a `<shuffle>` or a list** (`$so.P`, `$pl.P`) names nothing, with `doenet-w0200`. Before, it gave `doenet-w0105` "Multiple referents" after a sort or shuffle holding a repeat, nothing after a list, and the picked component after a shuffle holding a select of several. When the name is one of the collection's items itself (`$so.P`, `$pl.P`, or `$c.A` of a point `A` a `<collect componentType="point">` collects), the warning says so and suggests the index alone (`$so[1]`, `$pl[1]`, `$c[1]`). Before, it suggested `$c[1].A`, which names nothing too.
- **Nothing more is reported of a reference into a component in error**: an index into a component in error (`$s[1]` of a `<select>` in error, `$f[1]` of an unknown tag `<foo name="f"/>`, `$P[1]` of a `<point name="P" extend="$t"/>` made from a `<text>`) no longer gives `doenet-w0180` naming an internal `<_error>`, `$r[1].hidden` of a `<repeat>` in a cycle no longer gives `doenet-w0104`, and `$o[1].x` of a `<repeat>` in a cycle no longer gives `doenet-w0200` beside the cycle's `doenet-e0005`.
- **A `<group>` holding only a list stands for it** for a name written in the list too: `$g.P` of `<group name="g">$pl</group>`, with `<point name="P">` written in `pl`, is that point, as `$pl.P` is. This also works when the group holds a `<pointList extend="$pl"/>`, and in each iteration of a `<repeat>` holding the group and the list. Before, it was a blank with no message, or `doenet-w0200` with a suggestion that named nothing.
- **`doenet-w0191`** now speaks of "a pick of `s`" or "the case shown by `cc`", not "what each pick holds".

Part of #2638 (items 1–6). Item 7, a `<group extend>` of a `<repeat>` showing nothing, is left to #2649.
