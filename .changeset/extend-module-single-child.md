---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<module extend="$m"/>` of a module with a single child and no `<moduleAttributes>`, such as `<module name="m"><text>hi</text></module>`, now shows that child, as `$m` and `<module copy="$m"/>` do. It used to show nothing and report `Found a duplicate componentIdx`.

Closes #2227.
