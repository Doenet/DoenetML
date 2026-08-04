---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Warn that the `description` attribute is deprecated in favor of a `<shortDescription>` child.

`<image description="A tree" />` has quietly gone on working since version 0.6: normalization rewrites the attribute into a `<shortDescription>` child, so it still supplies the alt text. But the attribute is in neither the schema nor the documentation, which left old source being carried forward with no indication that it is writing something no longer supported. It now says so, on all ten components that accepted it — `<image>`, `<video>`, `<graph>`, `<answer>` and the `<*Input>`s — and keeps working exactly as before.
