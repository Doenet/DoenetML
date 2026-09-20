---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

A reader's saved state is the work they did, not a copy of the document around it.

Every essential value an ordinary definition computed was recorded alongside the reader's own writes, and the reader's first interaction anywhere flushed that whole document-wide record into the saved state. So working one exercise on a page persisted state for every other exercise: the function's expression over again, entries whose value was `null`, and the placeholder from each `<choice><math>?</math></choice>` — none of it the reader's, and all of it recomputed identically on a fresh load of the same document under the same variant.

Measured on one *Active Calculus* exercise, after a single drag of a constrained point: **1322 bytes across 21 entries becomes 160 bytes across 2** — the two being the point's position, which is the only thing in there the reader chose. With five independent exercises on a page and only the first worked, the saved state is now the same size as it is for one exercise; before, it grew with every exercise present.

The values are still recorded internally, because a partial write to an array merges into whatever entry is already there and the definition path is what puts that base in place. What changed is what leaves the worker.

One thing a definition computes is still saved: the draws of `<sampleRandomNumbers>`, `<samplePrimeNumbers>` and `<sampleMultivariateRandomNumber>`. Their `variantDeterminesSeed` is false by default, so they sample from a generator seeded by the clock and no rebuild reproduces them — the saved state is the only place those numbers exist. Dropping them would have changed the numbers under a reader who reloaded, turning the question they were part-way through answering into a different one. `<selectRandomNumbers>`, which draws from the variant's own generator, still costs nothing.

Also fixed, in the same code: when a composite deleted one of its replacements during the same update that wrote to it — `<sort>` does this on every reorder — merging the update's changes threw on the missing component. Because the throw was caught upstream, it silently took the rest of the update with it, including scheduling the save at all. A reader typing into a `<sort>` could see their change on screen and have it never be persisted.

Closes #1940.
