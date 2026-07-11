---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Add a `SPLICE.flushState` message so hosts can unmount in-progress viewers losslessly.

Hosts that unmount off-screen viewers to reclaim memory could already remount with prior work via `initialState`, but state was only reported at (throttled) save events, so work since the last report was silently lost. A host can now post `{ subject: "SPLICE.flushState", message_id }` (to the viewer's window, or to its own window for `@doenet/doenetml-iframe`, which forwards it); once in-flight updates settle, the viewer replies with `{ subject: "SPLICE.flushState.response", message_id, activity_id, doc_id, success, state, score }`, where `state` is the current serialized document state in exactly the shape `initialState` accepts (regardless of the save flags) and any pending throttled save is pushed through the normal `reportScoreAndState` pipeline first. After the response, unmounting loses nothing — remounting later with `initialState: state` restores the document. `state: null` with `success: true` means the viewer holds no state beyond what it was initialized with (e.g. its core has not been created), so unmounting is equally safe.

Hosts should apply a retry/timeout around the round-trip (the viewer's listener registers on mount, and flushing is idempotent). Enables bounded-window / park-and-restore embedding (Doenet/assignment-viewer#36, #37). Closes #1440.
