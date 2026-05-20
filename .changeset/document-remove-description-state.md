---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fix crash when `<description>` is a direct child of `<document>` (including standalone `<description>` at the top level).

`<document>` declared a `description` child group and a `description` state variable that read `text` from any `<description>` child. `<description>` extends `BlockComponent` and never defined a `text` state variable, so dependency setup threw `Unknown state variable text of <idx>`. The bug was pre-existing — `<description>` previously extended `<div>`, which also lacks `text` — but only surfaced when a `<description>` sat directly under the document.

The `document.description` state variable was a legacy hook with no consumers in the worker, the renderer, or the surrounding packages. The `description` child group and `description` state variable have been removed from `<document>`; a `<description>` anywhere in a document now resolves cleanly, and the schema no longer lists `<description>` as a direct child of `<document>`.
