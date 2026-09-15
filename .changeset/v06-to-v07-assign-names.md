---
"@doenet/v06-to-v07": patch
---

Convert `assignNames` on the composites that were previously left behind — `<select>`,
`<selectFromSequence>`, `<conditionalContent>`, `<sort>`, `<lorem>` and the sampling
components — by turning each assigned name into the index that v0.7 uses to reach the same
replacement. References inside attribute values, macro indices and function-macro
arguments are rewritten too, an index the author already wrote is kept, and a hyphenated
name survives as `$(a-b)`. Two composites assigning one name no longer end up with the
same `name`, and a name assigned in two different v0.6 namespaces now sends each reference
to the one it was reaching into.

Also upgrade the deprecated attributes that had no handling (`sourcesAreResponses`,
`sourcesAreFunctionSymbols`, `tname`, `updateValue`'s `prop`, `nVariants`, a graph's
`xlabel`/`ylabel`, and others), turn a parameterized `<copy uri="doenet:...">` into a
`<module copy="doenet:...">`, and replace a list's `maths`/`math2` props with indices. The
v0.6-only tags (`<copy>`, `<map>`, `<template>`, `<sources>` and the rest) are now
recognized however they were capitalized.

Fixes several ways conversion could quietly lose or corrupt content: a module's `<setup>`
kept only its `<customAttribute>` children, an `<image description="...">` lost the
alternative text screen readers need, an external copy's assigned name was dropped,
`<image source="a/b.png">` had its slashes turned into dots, `<copy source="../f">` became
`source="...f"`, a nested function macro was left in v0.6 syntax, a `<copy>` left in place
lost the `prop` that said what it copied, and a `<copy>` of something the document could
not build was renamed to `<_error>`, which is not an element anyone can write. A reference
written with dot notation is left alone, since v0.6 reached props that way and nothing
else.

A document whose `<copy>` tags cannot be resolved now converts instead of failing
outright, and problems that need an author's attention are reported with a rule name so
they can be grouped.
