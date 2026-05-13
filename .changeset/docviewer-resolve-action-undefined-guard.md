---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fix `DocViewer.resolveAction` crash when the Doenet core worker terminates mid-action.

`coreWorker.current?.dispatchActionJavascript(...)` short-circuits to `undefined` when the worker has been terminated between dispatch and resolution, after which `resolveAction(undefined)` threw `TypeError: Cannot destructure property 'actionId' of 'undefined' as it is undefined` as an unhandled promise rejection. The call site now skips resolution when the dispatch returns `undefined`, matching the "action effectively cancelled" semantics — the per-action promise is left unresolved, which is the same outcome as before the crash and is safe because the React tree that issued the action tears down with the worker.

This was observed under timing pressure in Cypress component tests when invalid markup (e.g. `<math bad`) or a `$name` reference forced a core re-init while an action was still in flight. Two `cy.on("uncaught:exception", ...)` workarounds in `DoenetEditor.contextHelp.cy.tsx` are removed in the same change so future regressions surface.
