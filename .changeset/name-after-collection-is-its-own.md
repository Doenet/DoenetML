---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

**Behavior change: a name or a property after a collection is the collection's own, never each item's.** A collection is a list (`<mathList>`, `<pointList>`, …), a `<sequence>`, a `<collect>`, a `<sort>`, a `<shuffle>`, a `<sortIndices>`, a `<repeat>`, a `<repeatForSequence>`, a list operator (`<cumulativeSum>`, …), a `<functionIterates>`, and a `<select>` or other random chooser or sampler whose `numToSelect` (or `numSamples`) is written as anything but `1`. After one, a name or a property is its own: `numItems`, the settings every component has (`hide`, `fixed`, `disabled`, …), and the properties the tag declares, such as a list's `maxNumber`. Anything else now names nothing, with a warning when the document loads that suggests an index: `$pl.x` of a `<pointList>` (was each point's x) → `$pl[1].x`, `$r.P` of a `<repeat>` (was every iteration's `P`) → `$r[1].P`, `$r.P.x` → `$r[1].P.x`, `$s.P.x` of a `<select numToSelect="2">` → `$s[1].P.x`, `$c.P` of a `<collect>` → `$c[1].P`, and a repeat's `$r.v` → `$r[1].v`. A tag made from one (`<point extend="$pl.x"/>`) is missing, with the same warning, where it was an error. This reverts the per-item names and properties of the release that added `numItems`: with them, `$r.fixed` was the repeat's own but `$r.x` each item's, so an author couldn't tell from `$r.something` which it meant.

Which a tag is comes from the tag as written, never from how many items it holds: a `<mathList>` of one entry is still a list (`$ml.x` names nothing), and `numToSelect="$n"` is a collection even while `n` is 1. A name written inside a list, a `<sort>` or a `<shuffle>`, or inside the list an `extend` or `copy` copies, is still that component (`$pl.P` of a `<point name="P">` written in it). A `<group>` holding only a collection, or only a reference to one, stands for it: `$g.x` of `<group name="g">$r</group>` names nothing, as `$r.x` does, and `$g.numItems` is `$r.numItems`.

A `<conditionalContent>`, and a `<select>` or other chooser that picks one, are not collections for this: each stands for what it shows, so `$cc.x`, `$s.P` and `$s.P.x` work as before, when every case or option declares the name with one type.

An action's `target` follows the same rule: `<updateValue target="$r.mi"/>` and `<animateFromSequence target="$r.x"/>` name nothing, with the warning, where they changed every iteration's; write `target="$r[1].mi"`. So does `target="$pl.x"` of a `<pointList>`, where it set every entry's x.
