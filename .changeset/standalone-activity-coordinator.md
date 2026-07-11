---
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

New `coordinator.js`, published alongside the standalone bundle: a small
script a static host page (e.g. a PreTeXt book) adds next to its same-origin
DoenetML activity iframes. It lazy-loads activities with a page-wide
boot-concurrency cap, keeps at most `maxLiveViewers` live (parking
off-screen ones by flushing their state and detaching the iframe, and
restoring them — reader's work intact — on scroll-back via a
`SPLICE.getState` warehouse), and can serve all activities from a shared
core-worker pool. The activity pages themselves need no changes: the
coordinator marks each activity URL with a fragment token that the
standalone bundle detects.
