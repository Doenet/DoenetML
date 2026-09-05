---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add hypergeometric, binomial, and Poisson distributions to `<sampleRandomNumbers>` and `<selectRandomNumbers>`.

Until now the only distributions available were `uniform`, `discreteUniform`, and `gaussian`, so there was no way to sample count data without building it by hand.

`type="hypergeometric"` counts the successes obtained when drawing `numDraws` items *without replacement* from a population of `numTotal` items containing `numSuccesses` successes. `type="binomial"` counts the successes in `numTrials` independent trials that each succeed with the given `probability`, defaulting to a single fair trial. `type="poisson"` is determined entirely by its `mean`, which defaults to 1 rather than the 0 that `gaussian` uses, since a Poisson distribution with mean 0 always returns 0.

The `mean`, `variance`, and `standardDeviation` properties report the exact values for each new distribution. Invalid parameters produce `NaN` for both the samples and those properties, along with a warning describing what is wrong. Those warnings are shown wherever the document's other warnings are, rather than only in the browser console; the long-standing warning about an invalid `gaussian` mean or standard deviation is now shown there too.

Because these distributions are drawn one item, trial, or event at a time, parameters that would need more than ten million draws for a single sample are refused the same way impossible ones are, rather than leaving the page unresponsive while they ran. The limit is far above any population, trial count, or rate that arises in practice; it is there so that mistyping an extra digit reports a problem instead of freezing the activity.
