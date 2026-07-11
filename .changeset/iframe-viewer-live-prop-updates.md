---
"@doenet/doenetml-iframe": patch
---

`<DoenetViewer>` prop changes no longer reload the iframe. The wrapper now
pushes serializable prop changes into the already-loaded iframe as messages
(the pattern `<DoenetEditor>` already used), and the inner viewer applies
them with in-process semantics: `render`/`darkMode`/`flags`/callbacks apply
live, and a `doenetML` (or `activityId`/`docId`/`attemptNumber`/
`requestedVariantIndex`) change re-initializes the document's core inside
the same realm instead of re-parsing the multi-MB standalone bundle. Only a
change of the bundle itself (`standaloneUrl`/`cssUrl`/`doenetmlVersion`, a
version change detected in `doenetML`, or `useSharedCoreWorker`) reloads the
iframe; to force a full remount, change the component's React `key`.
Function props follow the latest identity passed, including identities
passed after mount. Bundles older than 0.7.18 (which cannot re-render in
place) keep the historical reload-on-change behavior.
