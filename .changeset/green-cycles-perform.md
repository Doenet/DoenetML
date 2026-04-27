---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Introduce a new `avoidScientificNotation` number-display attribute and ensure
number-display settings are applied consistently across worker and viewer
rendering.

- Add `avoidScientificNotation` support to core number/math formatting behavior in the worker.
- Apply number-display parameters consistently through related formatted outputs (including line/function/point/vector/angle/piecewise/ODE displays), including `displayBlanks` handling where applicable.
- Wire number-display formatting through graph controls worker payloads and viewer parsing/model logic so display settings are respected end-to-end.
- Update generated schema output so inherited number-display attributes are available consistently.
- Add worker and viewer test coverage for the new/updated display behavior.
