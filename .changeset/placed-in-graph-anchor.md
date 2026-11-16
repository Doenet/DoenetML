---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A component dragged in a graph only to place it (a `<number>`, `<math>`, `<text>`, `<label>` or `<image>`) changes its `anchor`, not its value, so a random selection's parameter that reads its value is no longer a false `doenet-e0070` (SEL-1). A `<number>` placed in a graph, or a number a `<math>` in a graph reads, is no longer an error; `$n.anchor` (also of an extend of it, or of what it extends, which shares the anchor unless it writes its own `anchor`), a number written in a text's `anchor` (or in the `anchor` of what it extends or copies), the `anchor` of a math an entry of a `<mathList>` in a graph references (`$a` in `<mathList>$a y</mathList>`), the `anchor` of an entry of a list (`$ml[1].anchor`) when that entry's component is dragged, and a number a draggable point reads still are. This also makes such a component's value, and what it reads, count as decided by the DoenetML for the level of other diagnostics (DIAG-2): a `w0031` from a fixed circle through `$m` of a `<math>` in a graph, or a `w0008` from a vector in a fixed graph with `displacement="$m"`, is a warning, not an info. Its `anchor` (`$m.anchor`), which the drag changes, still makes such a diagnostic an info, also in an iteration of a repeat.
