---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Shrink the eagerly-parsed standalone bundle by lazy-loading the editor stack
(#1437). The `EditorViewer` behind both `DoenetEditor` and the `<codeEditor>`
renderer now loads through a `React.lazy` boundary (an editor chunk that
still fails to load after the retries renders the same inline
renderer-failed-to-load message the viewer renderers use, keeping the rest of
the page mounted), `@doenet/standalone` is
code-split (`doenet-standalone.js` plus lazy `chunks/` resolved relative to
the bundle URL), and duplicate copies of the component schema are eliminated
(five down to two, none of them eagerly loaded). Hosts that evaluate the bundle from a Blob or `srcdoc` URL, where
relative chunk imports cannot resolve, can use the new single-file
`doenet-standalone-inline.js` published beside it. The `CodeMirror` component
is now exported from `@doenet/doenetml/codemirror.js` instead of the main
`@doenet/doenetml` entry, so importing the viewer no longer parses the editor
stack.
