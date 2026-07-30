---
"@doenet/doenetml-iframe": patch
---

Bundle Comlink into the iframe's boot script instead of importing it from unpkg at runtime.

Every `DoenetViewer`/`DoenetEditor` iframe used to `import` Comlink from `https://unpkg.com` before any of its boot script could run. If that request was slow, blocked, or intercepted, the iframe stayed on its loading placeholder indefinitely — no timeout, no error. Comlink is compiled into the boot script now, so an iframe boots with no third-party network dependency.
