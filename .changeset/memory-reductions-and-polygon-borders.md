---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Reduce worker and renderer memory usage (no change to authored behavior).

- Build state-variable definition objects/closures once per component class
  instead of once per component instance (flyweight definitions).
- Slim the dependency graph: store dependency definitions by reference, intern
  frozen downstream-variable-name lists, share a frozen initial change record,
  and delete consumed `valuesChanged` records instead of retaining empty
  objects. Read-only resolve-blocker lookups no longer materialize empty
  nested blocker chains.
- Polygon renderer: skip creating border segment elements for zero-width
  lines (recreating the polygon if a visible border is later needed) and
  attach vertex drag handlers only while vertices are draggable.
