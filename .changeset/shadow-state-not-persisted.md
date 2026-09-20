---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

A copy no longer saves its own duplicate of the state belonging to what it copies.

`<mathInput extend="$mi" />`, and every replacement a composite makes of something it copies, *shadows* the component it came from. A write into a shadow is redirected to its source before it is recorded, and the source's write is then mirrored back down onto every shadow. Both ended up in the saved state, so every copy carried an entry of its own repeating what had already been recorded under the component it copies.

The copy keeps whatever state really is its own. A few things a copy holds are never mirrored from what it copies — a revealed `<hint>` stays revealed only on the copy the reader opened, and a `<choice>` inside a `<shuffle>` records that it was submitted on the shuffled copy rather than on the choice as written — and those are saved as before.

Nothing a reader can see changes here — the copy is restored from its source's entry, as it already was — but the payload a host stores is smaller wherever a document copies anything, which is most documents that use a composite.

It also removes a defect that has been in the way of `<sort>` and the composites after it. The duplicate entries are restored independently, and nothing makes the order they land in agree with the order a composite hands its replacements out. A composite that rebuilds its replacements on every change hides that, because deleting a replacement drops its entry too; one that *keeps* them keeps the stale duplicate, and it is applied over the value restored to the source. A reader's answer comes back on a different element of a sorted list from the one they typed it into. That is what #1949 measured and could not fix at the keying layer, and what would have met each of #1947's composites in turn as they were converted.

Refs #1947, #1949.
