---
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

VS Code: Ctrl+Space now offers Doenet elements anywhere in a document.

Pressing Ctrl+Space (or Ctrl+I / Cmd+I) where no `<` has been typed used to
produce nothing from the language server, so VS Code fell back to its own
word-based suggestions — words scraped out of the file, which read as invented
tags and attributes. It now opens the element menu, the same as Ctrl+Space in
the web editor, and keeps narrowing it as you type. Word-based suggestions are
off by default in Doenet documents, where they only ever compete with the
schema; `"[doenet]": { "editor.wordBasedSuggestions": ... }` turns them back on.

The language server also attaches to Doenet documents on any filesystem rather
than only `file:` and `untitled:` ones, so completions, diagnostics, hovers and
formatting work on vscode.dev, github.dev, and in virtual workspaces.

Two fixes alongside: the preview no longer throws when the last editor closes
or focus leaves the editor area, and the extension declares a valid SPDX
license so it can be mirrored to the Open VSX registry (#1317) — publishing
there needs only an `OVSX_PAT` repository secret.
