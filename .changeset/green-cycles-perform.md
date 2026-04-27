---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Introduce the `avoidScientificNotation` display attribute and support it consistently across math/number rendering paths.

- Add `avoidScientificNotation` support to core number/math formatting behavior in the worker.
- Propagate `avoidScientificNotation` through related formatted component outputs (including line/function/point/vector/angle/piecewise/ode displays).
- Wire `avoidScientificNotation` through graph controls worker payloads and viewer parsing/model logic so formatting is respected end-to-end.
- Add worker and viewer test coverage for the new attribute behavior.
