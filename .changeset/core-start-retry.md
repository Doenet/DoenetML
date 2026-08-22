---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Offer a retry when a document's core cannot be started.

The failure pane advised reloading the page, which is the wrong advice on the page that produces most of these failures: a section that starts many documents at once on a slow device. Reloading restarts all of them, and the reader who tried it was worse off the second time.

A failed document now offers **Try again**, which starts that one document over — a fresh saved-state load and boot ladder, without reloading the page or re-parsing the bundle — and shows that it is working rather than leaving a blank pane while it boots. The message beside the button leaves out the reload advice, and still names contention when that is what the failure is attributable to.

The offer is made once per document. A retry that fails too is shown the previous message, whose advice to reload is by then the honest next step, and no further button — so the reader is never left clicking at a document that will not start. A viewer handed a different document — an editor recompile, a host moving on to the next activity — starts the count over.

Both panes are announced now, since a reader who cannot see them is otherwise told nothing about what their click did: the button removes itself when clicked, so the "Initializing…" pane that replaces it reports politely that the retry is working, and the failure pane interrupts the way a failed renderer already does.

A message raised while a document was still starting no longer outlives it: a host that reports it cannot produce the saved state puts its message where the document would be, and a document that then starts is no longer left behind it.

A boot-scheduling host needs no changes to keep up: a retry that succeeds reports `initializedCallback` as any boot does, which is what clears the `failed` mark the `@doenet/standalone` coordinator put on the activity, and a retry that fails reports `coreStartFailedCallback` again.
