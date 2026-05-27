# Repeated Review of a PR

After creating a PR, use this procedure to iteratively improve it via subagent reviews.

## Procedure

Run the **review cycle** below at least three times in sequence. Each cycle operates on the PR as left by the previous cycle (i.e. pull the latest branch state before spawning the next subagent).

### Review cycle

Spawn one subagent and give it the following instructions:

1. Review the PR according to `@./PR_REVIEW_GUIDELINES.md`.
2. Address all issues identified during the review.
3. Update the changeset and PR description if the changes warrant it.
4. Commit and push the results.
5. Report back a short summary of what was changed (or report "no changes" if nothing needed updating).

Run cycles sequentially — each new subagent must see the prior subagent's commits, so wait for one to finish before spawning the next.

## Stopping criterion

- **Cycles 1–3:** always run.
- **After cycle 3:** if cycle 3 produced *significant* changes, run cycle 4. Otherwise stop.
- **After cycle 4:** if cycle 4 produced *significant* changes, run cycle 5. Otherwise stop.
- **Maximum:** 5 cycles total.

A change counts as *significant* if it modifies behavior, refactors non-trivially, or alters more than minor wording in docs/comments. Pure typo fixes, formatting tweaks, or a "no changes" report do not count.

## Final report

After the last cycle, summarize for the user:

- How many cycles ran and why you stopped.
- The most important changes made across all cycles.
- A link to the PR.
