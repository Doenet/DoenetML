---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Context help now names the shortcut that works on a Mac: Option+I.

The panel's "Press Ctrl+Space to see all N components" footer named a key
combination Mac users cannot use. CodeMirror binds a literal Control+Space on
every platform, but macOS claims Control+Space for "Select the previous input
source", so the keystroke is swallowed before the editor sees it. CodeMirror
ships mac-only alternates for that reason, and the panel now points at one of
them (Option+I) when running on a Mac; other platforms still see Ctrl+Space.
The authoring guides that point at the autocomplete menu name the Mac
alternate too.

Closes #1537.
