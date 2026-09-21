---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

`<selectRandomNumbers>` freezes `exclude` with the rest of its distribution.

A selection is drawn once and stays put, and every parameter describing the distribution it was drawn from is held fixed alongside it so that the reported `mean`, `variance` and `standardDeviation` keep describing that distribution. `exclude` was the one parameter still following its reference.

Because the moments are computed on demand, this showed whenever an `exclude` reference changed before anything had read them: the numbers on the page came from the original exclusion set while the moments described the new one. With `from="1" to="5" exclude="$e"` and `$e` moving from 3 to 5, the selection could contain a 5 that the reported distribution excludes beside a 3 it includes. Where the change also altered how many values survived, the reported mean belonged to no set of values at all, because the count it divides by was frozen while the exclusions it sums over were not.

`<sampleRandomNumbers>` is unaffected: it freezes nothing, and its moments and values both follow the reference, which is what that component is for.
