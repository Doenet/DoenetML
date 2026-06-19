---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: support enumerated `validValues` on list-valued attributes (e.g. `createComponentOfType: "textList"`).

When an attribute declares `validValues`, it is now interpreted per-item on a list-valued attribute: every item of the list must be one of the listed values. This flows through schema generation (the attribute is marked as a list of keywords), so editor autocomplete suggests the allowed values, the context-sensitive help panel labels them "Allowed values (one per item)", and the reference docs render the value table with a list type. The schema-violation check validates each whitespace-separated item rather than the whole value, and at runtime invalid items are dropped with a diagnostic. `<sideBySide>`/`<sbsGroup>` `valign`/`valigns` are migrated as the first worked example.
