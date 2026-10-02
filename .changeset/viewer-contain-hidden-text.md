---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: Cmd/Ctrl+clicking a line near the end of a document no longer scrolls the whole editor page along with the viewer, which used to leave a blank band below the editor.

Visually-hidden text in the viewer, such as an input's short description, was positioned relative to the page instead of the viewer. Far down a long document it made the page taller than the editor, so scrolling the viewer to an element scrolled the page too. That text now stays inside the viewer's scroll area.

Also in the editor, clicking a link to another part of the document now scrolls its target into view; it used to land above the top of the viewer, out of sight.

Viewer: clicking a `<subsetOfRealsInput>` number line now adds the point under the pointer even when the page is scrolled sideways or the input sits inside a positioned element; such clicks used to land at the wrong value.
