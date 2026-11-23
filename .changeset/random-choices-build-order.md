---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A random choice reads its parameters once what they come from is there, whatever order the document is written in, and four smaller fixes.

- **A sampler whose parameters come from a `<group>` or `<conditionalContent>` written after it draws once.** With `<sampleRandomNumbers name="s" numSamples="$g.n"/>`, `<sampleRandomNumbers copyWithState="$s"/>` and then `<group name="g"><number name="n">2</number></group>` (or `$cc.n`, or an `exclude`, `type`, range or mean from the group), the sampler drew before the group was there and again once it was, so it showed new draws at each reload, and its `copyWithState` drew its own. It now draws once, keeps its draws through a reload, and the copy shows them (COMP-8, CPY-8, SAVE-1).
- **A selection whose range comes from a `<group>` written later is made from the range in a `copyWithState`.** A `<selectRandomNumbers from="$g.a" to="$g.b">` in a `<section>` that a `copyWithState` copies, before the group, was `doenet-e0075` in every variant (before that, it selected `null`), and a `<selectFromSequence>` there was `doenet-e0036`. It now selects from the range, and the copy shows the same selection (SEL-7).
- **A `copyWithState` of a `<module>` keeps the carried choices through a one-entry `<mathList>` whose entry is written with a space**, as `2x`: the nested choice's attribute is held at what the source chose with, with `doenet-w0186`, as for any other list. Before, the module attribute written on the copy applied as written.
- **An input's edit that its value replaced with the edit itself is not brought back.** With an input bound to `x`, a reader who types `6` over `4` without entering it, then `x` set to `6`, then back to `4` while the input is in a case not shown, saw `6` again when the case was shown, where it now shows `4`.
- **An `<updateValue>` whose `target` is a `<group>` of several components, or a `<repeat>` or `<repeatForSequence>`, is a warning when the document loads** (`doenet-w0195`), naming the target: neither has one value to change, so the action does nothing. Before, it said so only when it acted (`doenet-w0044`). Name the component to change: `$g.a`, or `$r[1].x` for a component named `x` in the first item.

Closes #2553. Closes #2554.
