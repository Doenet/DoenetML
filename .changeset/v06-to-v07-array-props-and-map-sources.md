---
"@doenet/v06-to-v07": patch
---

Keep every entry when converting a copy of a whole array prop. `<copy prop="vertices" source="poly" />`
now becomes `$poly.vertices`, or `<pointList extend="$poly.vertices" />` when the copy has other
attributes, instead of a single `<point>`. A `<map>` whose sources are only references now
iterates over them directly (`<repeat for="$c.iterateValues">`). References with attributes to a
map's alias or index, such as `$(x{displayDigits="5"})`, now convert when the type of the values
is known: from a single list or array prop, or from a `<sequence>`. The copy made for a macro with
attributes inside an attribute value, such as `x="$(a{link='false'})"`, now goes inside the
enclosing `<module>` or `<repeat>`, where it can see the same names.
