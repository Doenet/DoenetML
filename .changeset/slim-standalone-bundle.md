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
the bundle URL). The split bundle pins its chunk URLs to its own version at
runtime when served from a floating CDN tag (`@latest`, a version range, or no
version), so an already-cached entry keeps loading its own release's chunks
across releases instead of 404ing on the next release's hashes; under any
other URL (self-hosted, exact-version) chunks resolve relative to the bundle
URL as before. The `onload` contract of PreTeXt-style pages is preserved:
`window.renderDoenetViewerToContainer` / `renderDoenetEditorToContainer`
exist at `load` (queueing until the bundle finishes evaluating), and
`window.doenetGlobalConfig` values a host sets at `load` are honored —
`@doenet/doenetml` now adopts a host-created config object instead of
replacing it, and a host-chosen `doenetWorkerUrl` stays in force (the
bundle's own worker-URL resolution and version pinning defer to it).
Duplicate copies of the component schema are eliminated
(five down to two, none of them eagerly loaded). Hosts that evaluate the bundle from a Blob or `srcdoc` URL, where
relative chunk imports cannot resolve, can use the new single-file
`doenet-standalone-inline.js` published beside it. The `CodeMirror` component
is now exported from `@doenet/doenetml/codemirror.js` instead of the main
`@doenet/doenetml` entry, so importing the viewer no longer parses the editor
stack.
