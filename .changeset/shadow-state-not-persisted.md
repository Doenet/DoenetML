---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

A copy no longer saves its own duplicate of the state belonging to what it copies.

`<mathInput extend="$mi" />`, and every replacement a composite makes of something it copies, *shadows* the component it came from. A write into a shadow ends up recorded against its source either way — redirected there outright for a variable the copy shadows, and otherwise recorded on the copy and then walked up to the source — and from there mirrored back down onto every shadow. Both ended up in the saved state, so a copy carried an entry of its own repeating what had already been recorded under the component it copies: a copy of an input the reader types into, of an `<answer>` they submit through, of a `<number>` or `<text>` an `<updateValue>` rewrites, or of a point, vector, line or other graph object they drag that was written without coordinate attributes.

The copy keeps whatever state really is its own. A few things a copy holds are never mirrored from what it copies — a revealed `<hint>` stays revealed only on the copy the reader opened, and a `<choice>` inside a `<shuffle>` records that it was submitted on the shuffled copy rather than on the choice as written — and those are saved as before. So is everything an unlinked `copy` holds, which is tied to its source in neither direction.

Not every copy duplicated something, and most documents' payloads do not change at all. A point written as `<point x="1" y="2" />` and dragged records the drag against the `x` and `y` it was written with rather than against the point itself, so a copy of it never had an entry to drop; the same document saves the same bytes as before.

Nothing a reader can see changes here — the copy is restored from its source's entry, as it already was — but the payload a host stores is smaller where a reader types into, submits through, or drags a copy that duplicated something — the cases named above, not every copy.

It also removes a defect that has been in the way of `<sort>` and the composites after it. The duplicate entries are restored independently, and nothing makes the order they land in agree with the order a composite hands its replacements out. A composite that rebuilds its replacements on every change hides that, because deleting a replacement drops its entry too; one that *keeps* them keeps the stale duplicate, and it is applied over the value restored to the source. A reader's answer comes back on a different element of a sorted list from the one they typed it into. That is what #1949 measured and could not fix at the keying layer, and what would have met each of #1947's composites in turn as they were converted.

Refs #1947, #1949.
