---
"@doenet/doenetml": minor
"@doenet/standalone": minor
"@doenet/doenetml-iframe": minor
"@doenet/vscode-extension": minor
"doenet-vscode-extension": minor
---

Add a context-sensitive help tab to the editor's diagnostics panel. When the cursor is on a component, attribute, or `$ref.property`, the panel shows the relevant description and a link to the corresponding `/reference/<slug>` docs page. Components can override the slug via `componentDocs.docsSlug` (or set it to `null` to suppress the link), and parents can redirect sugar-rewritten children via `componentDocs.childAliases` so e.g. `<row>` inside `<matrix>` shows `<matrixRow>`'s help. Adds a new `docsURL` prop on `DoenetEditor` (default `https://docs.doenet.org`) so embedding apps can point at staging or local docs builds.
