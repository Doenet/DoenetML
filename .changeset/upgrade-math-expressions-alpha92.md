---
"@doenet/doenetml": patch
---

Upgrade `math-expressions` to `2.0.0-alpha92`.

This fixes a bug where `simplify` did not fully simplify an nth root: given positivity assumptions, `nthroot(a^7*b^6*c^28, 5)` failed to pull the `a` and `b` factors out of the fifth root (only `c^5` was extracted). It now simplifies to `a*b*c^5 * nthroot(a^2*b*c^3, 5)`.
