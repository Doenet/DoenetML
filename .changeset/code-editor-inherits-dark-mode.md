---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Make a `<codeEditor>` inside a dark-mode document use the dark editor theme.

The `<codeEditor>` renderer mounts the same `EditorViewer` the authoring editor
does, but never told it which theme to use, so it fell back to the light-mode
default. Inside a dark-mode document that left light syntax colors — chosen for
contrast on a white canvas — painted on the dark canvas, and plain text content
in particular came out nearly invisible. The renderer now reads the document's
resolved theme from context and passes it down, so the embedded editor's
canvas, gutters, and syntax highlighting follow the surrounding document.
