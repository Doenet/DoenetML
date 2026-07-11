---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Opt-in shared core-worker host: multiplex document cores onto shared workers.

Setting `doenetGlobalConfig.useSharedCoreWorker = true` makes viewers on a page share core workers (up to `sharedCoreWorkerMaxCores` cores per worker, default 12) instead of booting one ~100 MB dedicated worker per document. Each document's core runs independently on its own message channel with the same API as before; tearing down one document releases only its core. Measured on the memory benchmark: 8 viewers drop from ~1455 MB to ~584 MB total (marginal cost per additional viewer ~136 MB → ~12 MB).

For iframe embedding, `@doenet/doenetml-iframe`'s `DoenetViewer` gains a `useSharedCoreWorker` prop: the parent page owns the shared worker pool and forwards each iframe's core over a `MessagePort`, so the cores of many same-origin iframes — which cannot share workers on their own — multiplex onto parent-owned workers (pools are keyed per standalone version). This works with the default CDN-served bundle (the worker is loaded via a same-origin `importScripts` bootstrap when cross-origin).

Default off. Trade-off when opted in: a worker-level hang or crash affects every document on that worker (per-core teardown is still individual); the recovery escalation ladder is tracked in #1466.
