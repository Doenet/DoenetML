---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

`<sampleRandomNumbers>` and `<selectRandomNumbers>` can draw from a log-normal distribution.

`type="logNormal"` raises `e` to the power of a normal variable, so every value is positive and the distribution is skewed to the right — the shape that fits quantities such as incomes, particle sizes, or times to finish a task, none of which the existing `gaussian` type describes.

Its parameters are the center and spread of the normal distribution being exponentiated rather than of the values themselves, so they are named apart from the gaussian's: `logMean` (default 0) and either `logStandardDeviation` (default 1) or `logVariance`, exactly as `standardDeviation` and `variance` pair up for the `gaussian` type. Reusing `mean` would have meant `mean="0"` producing values averaging about 1.65, and the reported `mean` disagreeing with the attribute of the same name.

The reported `mean`, `variance` and `standardDeviation` are those of the values, computed from the parameters: a `logStandardDeviation` large enough reports `Infinity` for moments genuinely beyond what a number can hold, and a value past about `e^709` comes back as `Infinity` for the same reason. Parameters that describe no distribution — an infinite center, or a negative or infinite spread — give `NaN` values and `NaN` moments together, with a warning naming what to change, which is what the gaussian and the discrete distributions already do.

The reference pages for both components also gained the grouping the schema drives. Neither highlighted anything, so every section rendered closed and a reader met a wall of headings; `type` and the count are now highlighted, and the fifteen distribution parameters are sorted into a group per distribution — uniform and discrete-uniform, gaussian and Poisson, log-normal, hypergeometric and binomial — with the reported `mean`, `variance` and `standardDeviation` highlighted and grouped as moments. The five number-display attributes had been losing their `number-display` group where this component redeclares them, and now keep it.
