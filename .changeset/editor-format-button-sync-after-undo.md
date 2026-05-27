---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Fix the EditorViewer Format button silently doing nothing after an undo or whitespace-only edit. The editor was tracking the user's text in a ref but not in the React `value` state passed to CodeMirror, so once the state drifted from the buffer (e.g., after Ctrl+Z reverted a previous format), formatting again to the same output was an `Object.is` no-op and CodeMirror was never told to update. The keystroke handler now keeps React state in sync with the editor buffer.
