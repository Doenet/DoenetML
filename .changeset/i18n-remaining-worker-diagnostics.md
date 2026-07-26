---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Translate the last of the worker's author-facing diagnostics: circular
dependencies in a copy or composite, references that resolve to nothing or to
several things, children that do not match what a component accepts, an
attribute value that falls back to its default, and the embed's
DoenetML-version failure.

Circular dependencies were reported by two components in two places with the
same wording; they now share one code, so a host filtering on it catches both.
