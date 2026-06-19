---
"@doenet/doenetml-prototype": patch
---

Prototype: wrap composite list replacements in synthetic `<asList>` parents in the FlatDast.

When the JS core reports a `_compositeReplacementActiveRange` for a renderable parent, the FlatDast bridge now wraps the relevant replacement range in an `<asList>` element (and, where nested composites require grouping, a passthrough `<_fragment>`), reproducing exactly the commas the `doenetml` renderers add via `addCommasForCompositeRanges`. This applies to both the initial FlatDast and FlatDast updates, so prototype renderers no longer need to inspect `_compositeReplacementActiveRange` to decide where to insert commas.

Closes #1334.
