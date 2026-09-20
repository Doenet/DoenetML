---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Say that `<selectRandomNumbers>` has no `resample` action instead of throwing when one is asked for.

`<selectRandomNumbers>` extends `<sampleRandomNumbers>` and inherited its `resample` action, which has nothing to act on here: a selection is drawn once from the variant's generator and is deliberately immutable, so the same document under the same variant shows the same numbers. The inherited action also writes `sampledValues`, a state variable `<selectRandomNumbers>` replaces with `selectedValues` — so `<callAction actionName="resample">` aimed at one threw a `TypeError` into the console, and the author saw a button that did nothing and no explanation.

The action is no longer offered, which is what it already was in practice, and `<callAction>` now reports that the action is unavailable, naming the reference as written.
