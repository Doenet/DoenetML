---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Stop the virtual keyboard tray from leaving an unhandled promise rejection behind when it is torn down.

The tray is a React root of its own, shared by every viewer on the page and unmounted when the last of them goes away. Its keys are `<MathJax>` elements, and a typeset can still be in flight at that moment: unmounting clears the elements' refs, so the typeset reaches MathJax with a null element and rejects with `Typesetting failed: Cannot read properties of null (reading 'contains')`. Nothing is rendered wrong by it — the tray is on its way out — but the rejection is unhandled, so it reaches `window.onunhandledrejection` and any error reporting a host has wired up there. It became easier to hit now that focusing a math input on a touch device opens the tray by itself.

`MathJaxContext` now takes a `signal`, and the tray aborts it as it tears the tray down. A `<MathJax>` element reaches the engine in stages — waiting on the context promise, then on `startup.promise`, and only then reading the element it is to typeset — so each stage is gated on the signal: once aborted, none of them proceeds and no typeset starts against a tree that is going away. The rest of the engine is passed through untouched, since it is the page's one shared MathJax and cancelling the tray's view of it must not disturb anyone else's.
