---
"@doenet/doenetml-iframe": patch
---

Windowed viewers (`mountPolicy`) now mount lazily with a boot-concurrency
cap: a windowed `<DoenetViewer>` starts as a fixed-height placeholder and
only creates its iframe when it comes near the viewport AND a page-wide boot
slot is free (`maxConcurrentBoots`, default 2, visible-first) — an
off-screen viewer never boots at all, eliminating the initialization
stampede when a page with many activities loads. Measured on the windowed
benchmark: a 16-activity page settles at ~735 MB (vs ~1041 MB when
everything booted before parking, and ~3 GB unwindowed), with no N-realm
boot transient.
