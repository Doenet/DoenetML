---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: Add bidirectional click-to-navigate between the source editor and the rendered preview.

Clicking a rendered element now moves the editor's cursor to (and reveals/centers) its source location, and moving the editor's cursor scrolls the preview to follow, debounced so it doesn't fight active typing. Works in both the VS Code extension's preview panel and `DoenetEditor`'s built-in CodeMirror editor.

Implementation notes: the core now includes each component's source `position` in its renderer instructions; `DocViewer` maintains an id-to-position map from that stream to power a delegated click handler and a `scrollToSourceOffset` prop, with no changes required to individual renderer components. Content produced via `<copy>` collapses to the `<copy>` tag's own source range rather than mapping to the exact nested element, since copied content doesn't retain its original element-level positions.

Also fixes `@doenet/codemirror`'s library build, whose Vite config pointed `lib.entry` at `CodeMirror.tsx` instead of `index.ts` — silently dropping any runtime (non-type-only) export added to `index.ts` from the built bundle that `@doenet/doenetml` consumes.
