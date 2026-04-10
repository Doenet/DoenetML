---
"@doenet/doenetml": minor
"@doenet/standalone": minor
"@doenet/doenetml-iframe": minor
"@doenet/v06-to-v07": minor
---

Replace `sortResults` boolean attribute with `sort` text attribute for `selectFromSequence` and `selectPrimeNumbers` components. The new `sort` attribute accepts three values: "unsorted", "increasing", and "decreasing". Backward compatibility is maintained through deprecation shims that automatically convert `sort="true"` to `sort="increasing"` and `sort="false"` to `sort="unsorted"`.
