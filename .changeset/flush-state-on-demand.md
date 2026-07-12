---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Add a `SPLICE.flushState` message so hosts can unmount in-progress viewers losslessly.

Hosts that unmount off-screen viewers to reclaim memory could already remount with prior work via `initialState`, but state was only reported at (throttled) save events, so work since the last report was silently lost. A host can now post `{ subject: "SPLICE.flushState", message_id }` (to the viewer's window, or to its own window for `@doenet/doenetml-iframe`, which forwards it). The viewer settles in-flight updates and pushes any pending state out through the **normal `SPLICE.reportScoreAndState` message** — so a host that already persists those reports saves the just-flushed state with no extra code, and need not know a flush occurred. It then replies with a stateless acknowledgement `{ subject: "SPLICE.flushState.response", message_id, activity_id, doc_id, success, hadState }`. Once the acknowledgement arrives every saved report is current, so tearing the viewer down loses nothing — remounting later with the last saved state (as `initialState`) restores the document. `hadState: false` means the viewer held no state beyond what it was initialized with (e.g. its core was never created), so unmounting is equally safe.

This split suits a host topology where the party managing lifecycle (which sends `flushState` and waits for the acknowledgement) is not the party persisting state (which just saves `reportScoreAndState`). Hosts should apply a retry/timeout around the round-trip (the viewer's listener registers on mount, and flushing is idempotent). Enables bounded-window / park-and-restore embedding (Doenet/assignment-viewer#36, #37). Closes #1440.
