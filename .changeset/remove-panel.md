---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/doenetml-headless": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Remove the undocumented `<panel>` component. Its responsive column layout was lost when renderers were reworked in 2020, and since then it has shown its children inline, with no border or columns, despite its `columns` attribute. It was already left out of the schema and documentation. A document that uses `<panel>` now gets the error for an unknown component type; use `<div>` to group content, or `<sideBySide>` to place it in columns.
