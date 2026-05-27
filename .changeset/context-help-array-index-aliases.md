---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: resolve coordinate-style chains via array `indexAliases`, so autocomplete and the context-help panel both surface `$vector.head.x`, `$line.points[1].x`, `$circle.center.y`, and `$curve.controlVectors[0][2].x` (3D, with two bracket indices on one segment).

The DoenetML runtime already resolves these chains: each array state variable carries an `indexAliases` table — `Vector.head` has `[["x","y","z"]]`, `Line.points` has `[[], ["x","y","z"]]`, `Circle.center` has `[["x","y","z"]]` — and the runtime treats the trailing segment as an exact-match alias for one dimension. The editor previously dead-ended at the first segment past the array property because the schema didn't carry the alias table.

This change emits `indexAliases` onto each array `SchemaProperty` from the runtime's existing per-state-var declaration, then wires a small `walkIndexAliases` helper into both the autocomplete and the context-help layers:

- **Autocomplete** at `$container.arrayProp.` (or `$container.arrayProp[N].`) now offers each alias name for the current dimension as a Reference-kind completion (`x`, `y`, `z` for `$vector.head.`).
- **Help panel** renders a new `arrayEntry` payload for a fully-consumed chain (`$vector.head.x`, `$line.points[1].x`), showing the array property's description plus the alias path and the entry's leaf type.

The chase is intentionally exact-match on the alias table — it never looks up properties of the array entry's `type` (e.g. `<point>` for `head`). So `$vector.head.hidden` continues to produce no completion and no help, matching the runtime: `hidden` IS a `<point>` property, but it isn't in `head`'s alias table and the runtime won't resolve it either. This keeps the editor in lockstep with what authors will actually see at runtime instead of inviting them down chains that look plausible but don't work.

Picks up any array state variable that ships `indexAliases` automatically once the schema is regenerated, with no per-component plumbing.

Closes #1180.
