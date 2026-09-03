---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

An activity embedded in a page that does not speak SPLICE no longer tells readers their saved work could not be loaded.

Canvas listens for messages on every page it serves and answers any it does not recognize with `error: { code: "unsupported_subject" }`, quoting the id it was sent. So a Doenet activity embedded in a Canvas page got that back for its `SPLICE.getState` request, from a page that is not a host at all — and the viewer read it as a host reporting a failure. Readers were told their saved work was unavailable on an activity that has no saved work and nothing wrong with it; before the notice moved beside the document, the same reply replaced the activity entirely.

The viewer now recognizes that platform vocabulary — `unsupported_subject`, `unauthorized`, `wrong_origin`, `bad_request` — as a page saying it will not act on what was asked of it, which is the same to the viewer as no answer at all: it is logged and dropped, and the request stays open for a host that does speak SPLICE. Those four codes are reserved for that; a host's own load failures reach the reader under any other code.

An error the viewer cannot put on screen — one with no string `message` — is now logged and dropped too, rather than shown as "Invalid response to getState". That named the host's bug to a reader who could do nothing about it, over a document that was working. An error carrying text but no `code` is now shown rather than discarded.

Closes #1795.
