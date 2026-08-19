---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Stagger document boots on pages nothing else schedules.

Every embedding of ours that puts many documents on one page caps how many boot at once, but all of those caps live on the parent page and are opt-in. PreTeXt/Runestone has adopted none of them, so a textbook section starts every activity simultaneously — each parsing a multi-MB bundle and spawning its own core worker — and on a low-end machine the contention pushed healthy handshakes past their watchdog until the activities failed outright (#1707).

When no embedding layer is scheduling boots, a document now holds one of a few page-wide slots across its core handshake and retry ladder. The slots are Web Locks, which span every same-origin realm, so activity iframes gate against each other with no host script — and even other tabs on the same site, which contend for the same CPU, share the cap. The browser releases a lock when its realm goes away, so a crashed activity cannot wedge its siblings. A boot that finds every slot busy queues for all of them and takes whichever frees first, so free capacity is never idle while boots wait behind a busier slot.

Only a document's *first* boot waits. The stampede being bounded is many documents starting at once on page load; a rebuild is one already-visible document replacing its core, and making that queue behind other documents' first boots would delay an update the reader is looking at (and serialize an editor, which rebuilds on every recompile).

The gate fails open in every direction — no Web Locks, a rejected request, or a long wait all boot ungated — because a document that never boots is worse than a contended one. It bounds worker creation and WASM compilation, not the standalone bundle parse, which each iframe realm pays before any of our code runs there. `doenetGlobalConfig.maxConcurrentBoots` pins the cap; the default derives from `navigator.hardwareConcurrency`.

**Uniform managed-boot signal.** `doenetGlobalConfig.externallyManagedBoot` records that a host already schedules this realm's boot, so the gate stands down instead of nesting under a host cap and serializing the page — two independent semaphores compose multiplicatively. `@doenet/doenetml` exports **`markBootExternallyManaged`** to set it, for a host that caps boots itself. The coordinator and windowed viewers set it from signals they already carried; editors had none, so `@doenet/doenetml-iframe`'s `<DoenetEditor>` gains **`bootManagedByHost`**, which the docs site passes from its editor mount manager.
