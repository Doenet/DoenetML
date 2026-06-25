---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Support `addChildren`/`deleteChildren` on more parent components.

The `addChildren` (and `deleteChildren`) actions, previously available only on `<graph>`, now also work on `<stickyGroup>` and the sectioning components `<section>`, `<subsection>`, `<subsubsection>`, and `<paragraphs>`. For example, a `<callAction actionName="addChildren">` can now add a `<point>` to a `<stickyGroup>` inside a `<graph>`, or add a `<graph>` to a `<section>`.

The underlying mechanism (a `<_dynamicChildren>` internal child appended during normalization, plus shared worker actions that delegate to it) has been generalized so additional parent components can opt in with minimal changes.

Closes #1361.
