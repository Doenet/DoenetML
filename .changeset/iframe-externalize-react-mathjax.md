---
"@doenet/doenetml-iframe": patch
---

Fix `dispatcher.getOwner is not a function` when an `@doenet/doenetml-iframe`
`DoenetEditor`/`DoenetViewer` first renders inside a host React app. The iframe
package's library build only externalized the exact strings `react` and `react-dom`,
so the subpaths `react/jsx-runtime`, `react/jsx-dev-runtime`, and `react-dom/client`
— along with `better-react-mathjax` — were bundled into `dist/component/index.js`.
The bundled copy carried its own React dispatcher state, conflicting with the host's
React. The build now externalizes those subpaths and `better-react-mathjax`, so the
consuming app always supplies a single React instance. `better-react-mathjax` is now
a peer dependency of the published package.
