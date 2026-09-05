---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add `<sampleMultivariateRandomNumber>`, which draws a vector-valued random number.

Every existing sampling component produces numbers that are independent of one another. This one draws a single sample whose numbers are drawn *together*: `numInCategories` describes a population split into categories, `numDraws` items are drawn from it without replacement, and the component expands to one number per category giving how many of the drawn items came from each. The counts always sum to `numDraws`.

```doenet
<p>An urn holds 5 red, 3 blue, and 2 green marbles. Draw 4 without replacement:</p>
<p><sampleMultivariateRandomNumber name="draw" type="hypergeometric" numInCategories="5 3 2" numDraws="4" /></p>
<p>Red: $draw[1], blue: $draw[2], green: $draw[3]</p>
```

The `numCategories`, `numTotal`, `means`, and `variances` properties describe the distribution, and the `resample` action draws a fresh set.

`type` accepts only `hypergeometric` so far, and is required rather than defaulting to it. It is unlikely to remain the most natural default — a joint normal distribution is the more usual multivariate one — so naming the distribution in every document means adding others later cannot change what an existing document does.

Invalid parameters produce `NaN` for both the samples and those properties, along with a warning describing what to change. Because each category is drawn in turn, parameters that would need more than ten million random draws for a single sample are refused the same way, instead of leaving the page unresponsive while they ran.
