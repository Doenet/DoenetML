---
"@doenet/doenetml": patch
---

Deliver a core boot's result only while it still owns the document.

Getting a document on screen is a chain of waits — hash the source, read any saved state from IndexedDB, hand shake with a fresh worker, evaluate — and a rebuild during any of them (a locale switch, an editor recompile, new source from the host) leaves the previous boot still running. Both boots drive the same core worker, so the older one's result is no longer its to deliver: whichever way its evaluation ends, it now stands aside rather than rendering a superseded document over the new one or putting the "could not be started" screen over a document that booted fine.

The rule covers what a boot delivers *while* running, not only its final result: a superseded initialization no longer announces the old document's structure or resolved language, and a superseded core's mid-evaluation deliveries — renderer updates, diagnostics, score reports, clipboard writes, host events, solution-view requests, and the async renderer-chunk loads that commit the document's React tree — are dropped rather than written under the identity of the document that replaced it. Only a boot whose viewer has gone away disposes what it created; after a rebuild there is a successor that has already inherited it. The safety net that turns an unexpected throw during a boot into a visible error follows the same rule, and additionally stays quiet once the boot has already put its document on screen — the last thing a boot does is call `initializedCallback`, and a host handler that throws there must not replace the document it was told about. The state load that *precedes* a boot obeys the same rule: a load that has been overtaken now stops, rather than seeding the successor's core with the state saved for the document it replaced or reporting its own failure as that document's.

At most one boot runs per document at a time. A viewer brought back after being prepared off-screen restarted its boot on every re-render until that boot finished, and the two then tore down each other's worker — on that path aborting the render outright and leaving the viewer dead.
