---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Shrink the eagerly-parsed standalone bundle by lazy-loading the editor stack
(#1437). The `EditorViewer` behind both `DoenetEditor` and the `<codeEditor>`
renderer now loads through a `React.lazy` boundary, `@doenet/standalone` is
code-split (`doenet-standalone.js` plus lazy `chunks/` resolved relative to
the bundle URL), and the component schema is bundled once instead of five
times. Hosts that evaluate the bundle from a Blob or `srcdoc` URL, where
relative chunk imports cannot resolve, can use the new single-file
`doenet-standalone-inline.js` published beside it. The `CodeMirror` component
is now exported from `@doenet/doenetml/codemirror.js` instead of the main
`@doenet/doenetml` entry, so importing the viewer no longer parses the editor
stack.
