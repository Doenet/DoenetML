---
"@doenet/doenetml-iframe": patch
---

Bundle Comlink into the iframe's boot script instead of importing it from unpkg at runtime.

Every `DoenetViewer`/`DoenetEditor` iframe used to `import` Comlink from `https://unpkg.com` before its boot script could run, so the whole document waited on a public CDN it had no control over. If that request was slow, blocked, or intercepted, the iframe stayed on the loading placeholder indefinitely — no timeout, no error. Comlink is now compiled into the boot script, so an iframe boots with no third-party network dependency.
