---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A host that cannot produce a document's saved state no longer takes the document away.

The viewer does not wait for the host's answer to `SPLICE.getState` — it boots and restores if state arrives — and the request stays open until an answer carries usable state. So an error could land on a document that had been on screen and worked in for minutes, and it replaced that document with a red box nothing but a page reload cleared.

What the host says is now a notice beside the document, in the reader's language and carrying the host's own words. The document, and the work in it, stay where they are, and the host is not told the document failed. A reader who cannot see the notice is told about it politely, without being interrupted in what they were doing.

The failure pane also follows a rule instead of an arrival order. It is reserved for failures that leave no document at all — a core that never started, saved state that could not be read — so a document that failed to start and a host that could not produce its saved work no longer overwrite each other: the pane says the core never started, and what the host said is shown beneath it. The **Try again** button stays with the failure it addresses, rather than following whichever message settled last.
