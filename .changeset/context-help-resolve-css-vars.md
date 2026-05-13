---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Resolve CSS variables in the editor's context-sensitive help panel so attribute defaults like `var(--lightGreen)` are shown as their concrete computed value (e.g. `#a6f19f`) instead of an opaque variable reference. Resolution happens at runtime via `getComputedStyle` on `:root`, so `DoenetML.css` remains the single source of truth — any new attribute whose default is a `var(--name)` is handled automatically.
