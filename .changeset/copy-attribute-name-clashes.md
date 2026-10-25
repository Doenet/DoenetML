---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

`link`, `createComponentOfType`, `numComponents`, `uri`, `createComponentIdx`, `createComponentName` and `copyInChildren` are no longer treated specially when written on a component with `copy` or `extend`. They were settings of the internal copy DoenetML makes for `copy` and `extend`, and an author's attribute of the same name was taken for one of them. Whether a component is linked to what it names is said by `extend` or `copy` alone. Each is now an attribute like any other name the component does not have. For example, `<point extend="$P" link="false"/>`, a v0.6 idiom, is now linked like any other `extend`, where it used to make an unlinked copy; write `copy="$P"` for that. `<module copy="$m" link="x"/>` now passes `link` on to a module attribute named `link`, where it used to be taken by the copy, and `LINK="false"` on a copy no longer reports `Cannot repeat attribute link.`

- An attribute whose name starts with `_` is now an error, `Invalid attribute "_x". Attribute names cannot start with an underscore.`, and is removed, as a component or `name` starting with `_` already is. Such names are kept for the settings DoenetML sets itself.
- `<group>` and `<module>` no longer take `createComponentOfType` or `numComponents`. On a `<group>`, each is now an invalid attribute. On a `<module>`, each can now name a module attribute.
- `removeEmptyArrayEntries` on an extend of a list now applies in any letter case. Written as `RemoveEmptyArrayEntries`, it used to be reported as an attribute the list does not take.

A `<moduleAttributes>` child named like a camel-cased attribute of `<module>` itself, such as `asList`, now gets the same warning as one named `hide` or `rendered`: the name is already taken, and the child keeps its own value. Before, setting that attribute on the module or on a copy of it stopped the document with `A module attribute that isn't an existing attribute must be unresolved!`. One named `isResponse` or `isPotentialResponse` was instead taken as a module attribute when set; it now gets the warning too, as the rule for a module's own attribute names says. The editor no longer offers a module attribute named `isPotentialResponse`, `modifyIndirectly` or `permid` on a copy of the module either, as the runtime ignores it.

Closes #2326. Closes #2330.
