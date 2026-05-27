---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Fix the EditorViewer's context-sensitive help panel intermittently staying on the placeholder text after a programmatic source reset (e.g. when a parent component pushes a new `doenetML` prop and the user immediately interacts). The LSP server's `textDocument/didChange` notification is fire-and-forget, so the editor can send a help RPC before the server has finished populating its `documentInfo` map — the server returns `{kind: "none"}` and the panel never updated. The help handler now retries once after 400 ms when a `none` response lands within 3 s of a source reset; cursor changes, additional source resets, and unmount all invalidate the pending retry.
