---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

A new `maxNumAttempts` flag lets the hosting page cap how many times each answer can be submitted, without editing the document. Pass it in `flags` (for example `flags={{ maxNumAttempts: 3 }}` on `DoenetViewer`, in the standalone build's config or the iframe wrapper's props), or as `data-doenet-max-num-attempts="3"` on the standalone container.

- An answer allows the smaller of the flag and the author's `maxNumAttempts`, so an author's stricter limit still holds and a larger flag never raises it.
- Inside a container with `sectionWideCheckWork`, the flag caps that container's check-work button.
- `numAttemptsLeft` and the "attempts remaining" note count down from whichever limit applies, and a reload keeps the submissions already used.
- The default, `null`, means no cap, so documents behave as before unless the host sets the flag.
