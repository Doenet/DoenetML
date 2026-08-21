---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Show a reader the load failure their host reported, even when the host quotes the request's `message_id`.

A viewer asks its host for saved state with `SPLICE.getState`, and a host that cannot produce it answers with an error. The protocol asks for that error to carry no `message_id`, and that shape was handled — but the branch that handled it hung off the id *not* matching, so a host that quoted the request's id instead had its error dropped. Quoting it is the natural thing for a host to do: it is what its own answers carrying state do, and what every other request/response pair in the protocol does.

Nothing hung as a result, because the viewer never waits for this answer — it boots fresh and reboots seeded with whatever state arrives. The failure was quieter than that. The reader carried on in a document started without the work they had saved, with nothing on screen to say why, while the host believed it had reported the problem.

An error is now surfaced whether it quotes the open request's id or carries none, and one quoting a different id is ignored, since that id belongs to another request — one some rebuild has already replaced, or another viewer's on the page. A response carrying state is unchanged: it is read only when it quotes the request it answers, because replies reach every viewer in the window and `cid` alone cannot tell two of them apart. An error still does not close the request, so a page holding a second listener — the `@doenet/standalone` coordinator beside a book's own persistence layer — can still restore the document after the first answerer has failed.
