---
"@doenet/v06-to-v07": patch
---

Convert `assignNames` on the composites that were previously left behind — `<select>`,
`<selectFromSequence>`, `<conditionalContent>`, `<sort>` and the sampling components — by
turning each assigned name into the index that v0.7 uses to reach the same replacement.
References that live inside attribute values, macro indices and function-macro arguments
are now rewritten too, and an index the author already wrote is kept. Two composites
assigning the same name no longer end up with the same `name`, which v0.7 rejects.

Also upgrade the deprecated attributes that had no handling (`sourcesAreResponses`,
`sourcesAreFunctionSymbols`, `tname`, `updateValue`'s `prop`, `nVariants`, a graph's
`xlabel`/`ylabel`, and others), turn a parameterized `<copy uri="doenet:...">` into a
`<module copy="doenet:...">`, and replace a list's `maths`/`math2` props with indices. The
v0.6-only tags (`<copy>`, `<map>`, `<template>`, `<sources>` and the rest) are now
recognized however they were capitalized.

Fixes three ways conversion could quietly lose or corrupt content: a module's `<setup>`
kept only its `<customAttribute>` children, `<image source="a/b.png">` had its slashes
turned into dots, and `<copy source="../f">` became `source="...f"`. A document whose
`<copy>` tags cannot be resolved now keeps the rest of its conversion instead of failing
outright, and problems that need an author's attention are reported with a rule name.
