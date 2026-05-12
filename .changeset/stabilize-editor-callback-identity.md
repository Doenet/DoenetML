---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Stabilize `<DoenetEditor>` callback identity. The `doenetmlChangeCallback`, `immediateDoenetmlChangeCallback`, and `documentStructureCallback` props are now routed through ref mirrors, so the editor's internal `useCallback` hooks (and the imperative handle exposed via `ref`) no longer churn when consumers pass inline arrow functions. Also fixes a stale-closure bug where the unmount cleanup could fire the original `doenetmlChangeCallback` instead of the latest one.
