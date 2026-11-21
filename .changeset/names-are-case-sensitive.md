---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Tag, attribute and property names are case-sensitive (D51), as names given with `name` always were. **This is a breaking change for authors.** A name written in another case is an unknown name, and its message suggests the name it differs from only in case:

- A tag written with `copy`, `extend` or `copyWithState` is matched exactly, as the tag written alone already was. `<MATH extend="$m"/>`, `<Label copy="$l"/>` and `<Award copy="$aw"/>` are now an error (`doenet-e0002`, "Did you mean `<math>`?"), shown in place of the tag, where before they were accepted. Inside an `<answer>`, `<Award copy="$aw"/>` is no longer wrapped in a second award, nor `<Label copy="$l"/>` read as award content. A tag that is no component type at all, written with `extend` or `copy`, is the same error, where it was a warning (`doenet-w0065`).
- A property is matched exactly: `$P.X` of a point names nothing, shown as a blank, with `doenet-w0104` suggesting `$P.x`. This includes a collection's own properties (`$r.numitems`, `$g.Fixed`), which before were read in any case, or not, depending on how the collection was built, and a property named in `sortByProp`.
- An attribute written in another case (`<graph xmin="-5">`, `<math SIMPLIFY="full">`) is, **for this release, still applied**, under the component's spelling, with a warning (`doenet-w0197`) that it will be an error in a later release. The documentation had used `xmin`, `xmax`, `ymin` and `ymax` on most of its graphs, so this gives authors a release to correct them; its examples now use `xMin`, `xMax`, `yMin` and `yMax`. This holds for every attribute, `name`, `extend` and `copy` included, so `Name="t"` (before, "Cannot repeat attribute name", and `$t` named nothing) and `<repeat ValueName="v">` (before, no `$v`) now work, with the warning.
- An attribute written twice, in two cases (`xMin="1" xmin="2"`), is an unknown attribute the second time (`doenet-e0004`, suggesting `xMin`), where it was "Cannot repeat attribute" (`doenet-e0003`).

A keyword in an attribute's value stays case-insensitive: `simplify="FULL"`, `hide="True"` and `<boolean>TRUE</boolean>` work as before.

Closes #2605.
