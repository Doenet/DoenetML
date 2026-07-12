---
"@doenet/doenetml-iframe": patch
---

New opt-in `mountPolicy` prop on `<DoenetViewer>`: windowed mounting. With
`mountPolicy={{ mode: "windowed", maxLiveViewers: K }}`, at most K viewers
stay live page-wide; off-screen viewers beyond the budget are parked — their
state is flushed via `SPLICE.flushState` and their iframe is replaced by a
fixed-height placeholder — and restored (typed work intact) when scrolled
back near the viewport. Parking requires a persistence path
(`flags.allowSaveState` or `flags.allowLocalState`); viewers without one
always stay live. Idle memory then tracks what the user can see instead of
how many documents the page embeds: a parked instance measures ~0 MB versus
~200 MB for a live iframe viewer.
