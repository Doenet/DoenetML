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

Attribute suggestions no longer go missing. Typing `<math exp` reaches the
language server only if quick suggestions open the suggestion widget — unlike
`<`, which is a trigger character the server is always asked about — so an
editor configured to render them inline instead left element suggestions
working while attribute suggestions appeared to be missing entirely. Doenet
documents now ask for the widget by default; an explicit
`editor.quickSuggestions` setting still wins.

Both defaults are contributed under `[doenet]`, which raises the extension's
minimum VS Code version to 1.85 — the release where
`editor.wordBasedSuggestions` became an enum.

The language server also attaches to Doenet documents on any filesystem rather
than only `file:` and `untitled:` ones, so completions, diagnostics, hovers and
formatting work on vscode.dev, github.dev, and in virtual workspaces.

Two fixes alongside: the preview no longer throws when the last editor closes
or focus leaves the editor area, and the extension now publishes to the Open
VSX registry as well as the VS Code Marketplace, putting it within reach of
VS Code-compatible editors such as VSCodium (#1317).
