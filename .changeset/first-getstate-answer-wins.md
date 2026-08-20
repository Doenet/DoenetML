---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Let the first usable answer to a document's `SPLICE.getState` be the one that counts.

A page can hold more than one listener willing to answer that request. On a Runestone or SCORM page running the standalone coordinator there are two: the coordinator, which answers a restored activity out of the in-page warehouse it filled when it parked the activity, and the book's own persistence layer, which answers out of durable storage. Both answers were processed, so the document was rebuilt from whichever one happened to arrive last — and the durable one, being a round trip to storage, generally arrives second while carrying older work than the reader had just done. A reader who typed something, scrolled past the activity, and scrolled back could find the answer they gave before that reverted to an earlier one.

A request now has a single answer: the first that carries state for this document wins, and later answers to it are ignored. Within a page load the coordinator's warehouse is the fresher of the two and answers first, so the reader keeps their work; on a boot the warehouse cannot answer — the first visit of a session, say — the persistence layer is the only answerer and restores as before. An answer with no state does not consume the request, so a host with nothing saved for an activity cannot shut out a better answer still on its way.

Rebuilding the document twice also cost a second full core start on every restore, which is now spent only when a state actually arrives to rebuild from.
