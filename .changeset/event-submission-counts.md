---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Recorded events now say how many attempts a submission used and has left, and carry a zoned timestamp, so a host that embeds DoenetML can count and cap attempts without editing documents.

- The `result` of a `"submitted"` event from an `<answer>`, a `<pretzel>`, or a section-wide check work now includes `numSubmissions` (including this submission), `maxNumAttempts` (`null` when unlimited) and `numAttemptsLeft` (after this submission, `null` when unlimited).
- Every event now includes `timestampIso`, an ISO 8601 UTC string such as `2026-11-07T22:21:06.123Z`. The existing `timestamp` field is unchanged.
- The event `version` is now `0.1.2` (was `0.1.1`).
