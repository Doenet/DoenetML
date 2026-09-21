---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

`<sampleRandomNumbers>` and `<selectRandomNumbers>` can draw from a mixture of normal distributions.

`type="normalMixture"` draws each value from one of several normal distributions, choosing a component at random and taking the value from that component alone. It describes a population made of distinct groups, and it is the only type here that can produce a bimodal sample — a single `gaussian` cannot.

The components are given as lists: `means` (which has no default, and whose length is how many components there are), `standardDeviations` or `variances`, and `weights`. Weights are relative and need not add up to 1. A list holding a single value applies to every component, which is how the defaults — a spread of 1, and equal weights — are written, so `standardDeviations="2"` beside three means gives all three a spread of 2.

The reported `mean` is the weighted average of the component means; the reported `variance` adds to the weighted average of the component variances the spread of the components' own centers about that mean, so it is larger than any component's. Both are computed in a form that stays exact for components far from the origin, where the textbook `E[X²] - E[X]²` loses the answer to cancellation. Parameters that describe no distribution — a list of the wrong length, a negative spread or weight, weights that are all zero or that do not add up to a finite total — give `NaN` values and `NaN` moments together, with a warning naming what to change, as the other distributions already do.
