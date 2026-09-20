---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Say that `<selectRandomNumbers>` has no `resample` action instead of throwing when one is asked for.

`<selectRandomNumbers>` draws its numbers once, so that the same document under the same variant shows the same numbers; resampling is what `<sampleRandomNumbers>` is for. It nonetheless inherited a `resample` action, and `<callAction actionName="resample">` aimed at one threw a `TypeError` into the console — the author saw a button that did nothing and no explanation. The throw also abandoned whatever else that button was still going to do: the rest of a `<triggerSet>`, and anything chained with `triggerWith`, never ran.

`<callAction>` now reports that the action is unavailable, naming the reference as the author wrote it, and the actions sharing its trigger run as usual.
