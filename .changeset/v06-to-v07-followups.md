---
"@doenet/v06-to-v07": patch
---

Convert more v0.6 `<copy>` and `<map>` forms:
- `propIndex` and `componentIndex` on a `<copy>` become indices in the reference, e.g. `$poly.vertices[2][1]` and `$g[2]`.
- `$(a{assignNames='b'})` inside an attribute value names its copy `b`.
- A `<map>` with several `<sources>` becomes nested repeats. With `behavior="parallel"` or `assignNames` it is left with a diagnostic.
- An inner `<map>` whose sources refer to the outer map's alias converts.
- A map's alias is typed when all its values share one type, including written components.
- A `<sequence>` next to other sources is no longer dropped.
- A `<map>` whose sources mix a list, composite or reference with other items gets a `map/mixed-sources` warning, as 0.7 may not iterate over such a group correctly.
- A `<map>` placed before a module's `<setup>` no longer breaks the module's attributes.
- A `<sources>`'s `alias` and `indexAlias`, and a `<sequence>`'s `type`, are recognized however they are capitalized.
