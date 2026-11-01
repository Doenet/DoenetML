---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

An index selects among the items a component makes (the entries of a list, the iterations of a `<repeat>` or `<repeatForSequence>`, the picks of a `<select>`) and no longer among the children of a container. To reach something inside an iteration or a pick, name it: `$r[2].x`, `$s[1].x`.

**Breaking: nested repeats take one index per level.** When the whole content of an iteration or a pick is one component that has items of its own, such as a repeat or a list, an index after the iteration passes to that component. In `<repeat name="r"><repeat>…</repeat></repeat>`, `$r[1][2]` is now iteration 2 of the inner repeat in iteration 1, where it used to name nothing. What used to be written `$r[1][1][2]` is now `$r[1][2]`, and the old form reads with the new meaning: iteration 1 of the inner repeat, then index 2 into that iteration. Likewise `$s[1][2]` on a `<select>` whose options each hold one list is entry 2 of the list that was picked.

**Deprecated: selecting a child by its position.** `$g[2]` on a `<group>`, `$s[1][2]` into a picked option, `$r[2][1]` into an iteration (unless the option or the iteration holds just one component with items of its own, as above), and `$cc[1][2]` into what a `<conditionalContent>` shows still select that child, but now give a deprecation warning that shows the reference to write instead, naming the child.

The warnings for an index that names nothing now say what the author wrote, rather than naming an internal type: `$s[3]` on a `<select>` that picked two options says the select made only 2 picks, and `$sec[2]` on a `<section>` says that an index cannot select anything in a `<section>`, where it used to say it could not find a property `sec[2]`.
