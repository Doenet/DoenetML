---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Make the document viewer resilient to a stalled core-worker startup, and stop slow documents from being aborted before they finish loading.

- If the core worker stalled while starting up (under CPU/timing pressure), the viewer could be left permanently blank — no document and no error. It now watchdogs the worker's brief startup handshake and restarts a worker that fails to come up or hangs; after repeated failures it shows a "could not be started — reload the page" message instead of staying blank.
- The document-evaluation phase — which can legitimately take seconds to minutes on complex documents — is no longer time-limited, so large documents finish loading instead of being aborted.
