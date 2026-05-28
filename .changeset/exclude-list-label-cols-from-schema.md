---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Exclude the ignored `label` and `cols` attributes of `<ol>`/`<ul>` from the schema.

These two list attributes are accepted by the parser but not acted on — the renderer ignores `cols` entirely and does not yet render `label`. They now set `excludeFromSchema: true`, so they disappear from editor autocomplete, RelaxNG validation, and the docs reference tables while remaining registered. Existing content that sets `label` or `cols` on an `<ol>`/`<ul>` continues to parse silently instead of erroring.
