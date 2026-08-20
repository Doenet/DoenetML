---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Serve the core WASM as its own file beside the worker script instead of inlining it into the worker bundle as a base64 data URL. The worker fetches it at run time (from beside its own script, or from a jsDelivr URL pinned to the built release as a last resort) and hands the response to streaming compilation, so the browser's URL-keyed machine-code cache shares one compilation across all workers, iframes, and repeat page views — and the worker bundle shrinks from ~15 MB to ~6.3 MB. Single-file consumers (the inline-worker entry, the VS Code extension) still work with no network access: they bake the WASM in as a `data:` URL the worker decodes without fetching.

Closes #1438.
