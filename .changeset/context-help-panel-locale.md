---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Render the editor's context-help panel in the reader's language.

The panel that explains whatever the cursor is on was the last English surface left inside the editor. Its labels, its placeholder, and the sentences it writes about a reference — "`$m` is a reference to `<point>` (line 4)" — now come from the catalogs, with Spanish alongside.

Those sentences stay whole rather than being split at the markup inside them, so a translation decides where each quoted name sits and how the sentence is punctuated around it. Element names, attribute names and `styleNumber` stay as written, and the descriptions the panel shows still come from the schema, which is generated from the documentation and is not translated.
