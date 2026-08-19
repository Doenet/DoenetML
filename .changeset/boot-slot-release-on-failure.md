---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Free a boot slot when a document's core fails to start.

Hosts that cap how many documents boot at once released a slot only from `initializedCallback`, so a failed boot held one until the manager's own watchdog expired: 90 s for the `@doenet/standalone` coordinator and for windowed `@doenet/doenetml-iframe` viewers, 30 s for the docs site's editors. The queue that exists to keep a page from overloading was starved by the failures themselves.

`DoenetViewer` and `DoenetEditor` gain **`coreStartFailedCallback`**, the failure counterpart of `initializedCallback`. It fires once per core-start attempt and covers every way a start can end without a core: handshake retries exhausted, a rejected evaluation, or a document-state load that failed. A windowed `@doenet/doenetml-iframe` viewer releases its slot on the signal whether or not the host passed a callback of its own, and the docs site's editors release theirs the same way.

The standalone bundle posts `bootFailed` to a parent-page coordinator, which frees the slot and marks the activity `failed` — still budgeted and still parkable, but parking skips the state flush, since a failed realm has no core to answer one and whatever it last reported is already warehoused. A later attempt in that realm that does start a core clears the mark, so an activity that recovers flushes its state like any other. A failure that lands while the activity is already parking is not lost either: the flush in flight will never be answered, so the coordinator stops waiting for it — detaching at once off-screen, and keeping the `failed` mark if the reader scrolled back mid-flush.

The coordinator script also accepts `data-boot-watchdog-ms`, the one option that had no data attribute.
