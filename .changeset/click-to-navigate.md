---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: Add bidirectional click-to-navigate between the source editor and the rendered preview.

Clicking a rendered element now moves the editor's cursor to (and reveals/centers) its source location, and moving the editor's cursor scrolls the preview to follow, debounced so it doesn't fight active typing. Works in both the VS Code extension's preview panel and `DoenetEditor`'s built-in CodeMirror editor. Clicks on a graph navigate to the `<graph>` source, clicks on the graphical elements inside it (point, vector, line, ray, lineSegment, circle, polygon, polyline) navigate to the element's own source, and drag releases don't navigate.

Implementation notes: the core now includes each component's source `position` in its renderer instructions; `DocViewer` maintains an id-to-position map from that stream to power a delegated capture-phase click handler and a `scrollToSourceOffset` prop; the line-family renderers report clicks on their JSXGraph elements through a `DocContext` callback at the same click-vs-drag disambiguation point that powers `triggerWhenObjectsClicked`. Content brought in by a copy (e.g. `$g` or `<graph extend="$g">`) navigates to the copy the author wrote where it renders, not to the copied component's original definition.

Also fixes `@doenet/codemirror`'s library build, whose Vite config pointed `lib.entry` at `CodeMirror.tsx` instead of `index.ts` — silently dropping any runtime (non-type-only) export added to `index.ts` from the built bundle that `@doenet/doenetml` consumes.
