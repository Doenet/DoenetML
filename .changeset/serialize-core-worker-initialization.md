---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Keep the worker when a document's boot is restarted mid-handshake.

A boot restarted while the first one was still shaking hands with its core worker used to run a second initialization on the same worker, interleaved with the first. Three ordinary things restart a boot that way: a host answering `SPLICE.getState` at once, as doenet.org's assignment page does; a source edit, attempt change, locale switch or retry landing mid-boot; and `render` turning true on a viewer still priming its worker. The second initialization then initialized from a document DAST the first had already released, its handshake failed with a misleading `Cannot create normalized dast root before source is set`, and the boot ladder discarded the worker as wedged and booted a replacement — so the document rendered a worker and a WASM compile late, and on a page sharing one worker among documents the discard quarantined that worker for its siblings too.

Initializations are now serialized per worker: a boot that finds one in flight waits for it to settle, then runs whole on the worker it found — no failed handshake, no discarded worker, no replacement to boot. The second initialization still runs (skipping it when nothing has changed is #1800); what is gone is the failure and the second worker. They queue in the order they were asked for, so the worker ends up holding the document on screen even when an older initialization's external references were slow to fetch. The worker itself now refuses to initialize twice from one source and says why, and a refused initialization no longer leaves the worker's call queue held.

Closes #1533.
