---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

A document or section with nothing scored now gets full credit in `creditAchievedIfSubmit`, as it already does in `creditAchieved`. Before, a document or aggregating section with no answers, or whose answers all have `weight="0"`, had a `creditAchievedIfSubmit` of `NaN`, and the `NaN` spread to any document or aggregating section containing it: a document with an empty `<problem>` beside a correct `<answer>` had a `NaN` `creditAchievedIfSubmit`. A section-wide check work's `submitted` event reports this value as its `creditAchieved`, so that event now records 1 rather than `NaN` for such a section.

Closes #2630.
