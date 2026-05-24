---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fix the editor's context-sensitive help for `$container.member` access through composite wrappers, when multiple wrapper branches each declare a descendant with the same name.

Example: a `<select name="s">` with two `<option>` branches each containing `<text name="t">`. The autocomplete dropdown correctly offered `t` at `$s[1].`, but the help panel went blank — `getNamedDescendant` requires a uniquely-addressable name and saw two matches.

The resolver already includes such names in `visibleDescendantNames` for indexed access through a composite (walking `<case>` / `<else>` / `<option>` wrappers transparently via `collectNamesFromCompositeChildren`). The help-side descendant lookup in `resolveRefMemberDescendantHelp` now mirrors that wrapper walk and returns the first match: sibling-replicated descendants of those wrappers share schemas, so any one match yields the right help payload.

Closes #1179.
