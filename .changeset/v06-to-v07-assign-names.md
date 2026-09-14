---
"@doenet/v06-to-v07": patch
---

Convert `assignNames` on the composites that were previously left behind — `<select>`,
`<selectFromSequence>`, `<conditionalContent>`, `<sort>` and the sampling components — by
turning each assigned name into the index that v0.7 uses to reach the same replacement.
References that live inside attribute values, macro indices and function-macro arguments
are now rewritten too, and an index the author already wrote is kept. Two composites
assigning the same name no longer end up with the same `name`, which v0.7 rejects, and a
hyphenated assigned name is kept rather than discarded — v0.6 and v0.7 both reference one
as `$(a-b)`.

Also upgrade the deprecated attributes that had no handling (`sourcesAreResponses`,
`sourcesAreFunctionSymbols`, `tname`, `updateValue`'s `prop`, `nVariants`, a graph's
`xlabel`/`ylabel`, and others), turn a parameterized `<copy uri="doenet:...">` into a
`<module copy="doenet:...">`, and replace a list's `maths`/`math2` props with indices. The
v0.6-only tags (`<copy>`, `<map>`, `<template>`, `<sources>` and the rest) are now
recognized however they were capitalized.

Fixes several ways conversion could quietly lose or corrupt content: a module's `<setup>`
kept only its `<customAttribute>` children, an `<image description="...">` lost the
alternative text screen readers need (it now becomes the `<shortDescription>` v0.7 wants),
an external copy's assigned name was dropped so references to it went nowhere,
`<image source="a/b.png">` had its slashes turned into dots, and `<copy source="../f">`
became `source="...f"`, a function macro nested in another's arguments or indices inside
an attribute was left in v0.6 syntax, a `<copy>` that had to be left alone because its
referent could not be found lost its `prop` and so quietly copied the whole component, and
a `<copy>` of something the document could not build was renamed to `<_error>`, which is
not an element anyone can write.

The same assigned name can appear in more than one v0.6 namespace, and a reference said
which it meant by writing the namespace in front of it. Only one of them can keep the bare
name once the namespaces are gone, so each reference now follows the one it was reaching
into rather than all of them following the first.

A reference written with dot notation is left alone. v0.6 reached public state variables
that way and nothing else, so `$p.y` was the point's y-coordinate and not a component that
`assignNames` had named — only the slash form could name one of those.

A document whose `<copy>` tags cannot be resolved, or that has a
`<collect assignNames="...">` with no `name` of its own, now converts instead of failing
outright, and most problems that need an author's attention are reported with a rule name
so they can be grouped.
