---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Propagate `styleNumber` from a composite (e.g. `<group>`) to the components it creates, and make the nearest setting win.

Setting `styleNumber` on a `<group>` previously had no effect on the members inside it — they rendered with the default style — because `styleNumber` only inherited from the rendered parent, and a group's members are reparented out of the group into its container. Members now also fall back to the `styleNumber` of the composite that created them.

Relatedly, when an attribute can inherit from both a parent and a source composite, the **source composite (the innermost authored wrapper) now wins over the parent**. This makes a `<group styleNumber="4">` behave like the nearest container: in `<graph styleNumber="5"><group styleNumber="4">…</group></graph>` the grouped points are style 4, and a loose point alongside them is style 5 — the same result you get from a `<graph styleNumber="4">` nested in a `<section styleNumber="5">`, so authors don't have to know which components are composites. Extending such a graph (`<graph extend="$g" styleNumber="2" />`) re-resolves each member in its new context: a loose point picks up the new `2`, while grouped points keep the group's `4`.

An explicit `styleNumber` on a member still wins over everything. The new precedence also applies to the other attributes that already used both fall-backs (`<math>`/`<mathList>` `functionSymbols`, `splitSymbols`, `referencesAreFunctionSymbols`), where a wrapping list composite now likewise takes precedence over a more distant containing element.
