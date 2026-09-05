# Repeated Review of a PR

After creating a PR, use this procedure to iteratively improve it through a series of
subagent reviews. Each cycle spawns one subagent, which reviews the PR as the previous
cycle left it.

## Before the first cycle

Put these in every subagent's brief, not just the first:

- **The working directory, as an absolute path**, and an instruction to verify it before
  starting. A review agent has previously wandered into a second checkout of the same
  repository and committed there.
- **What to review.** If the PR is part of a stack, its GitHub diff includes every PR
  beneath it. Point the reviewer at `git diff <parent-branch>...HEAD`, name the branches it
  must not touch, and say plainly that a finding in a lower PR is to be **reported, not
  fixed**.
- **What is already settled** — decisions taken, refactors deliberately deferred, traps
  already hit. Without this each cycle re-derives the same conclusions and re-proposes the
  same declined changes.

## The review cycle

Give the subagent these instructions:

1. Review the PR according to `docs/PR_REVIEW_GUIDELINES.md`, through this cycle's lens.
2. Address all issues identified during the review.
3. Verify the changeset still describes the user-visible behavior in the diff; update if not.
4. Verify the PR description still describes everything in the diff; update if not. Don't
   skip this — a stale PR description is the most common review-cycle oversight.
5. Commit and push the results.
6. Append to the ledger, and report back a short summary of what was changed (or "no
   changes" if nothing needed updating).

Run cycles **sequentially** — each new subagent must see the prior subagent's commits, so
wait for one to finish before spawning the next, and pull the latest branch state in
between.

## Lenses

Repeating one prompt has steep diminishing returns; asking a different question does not.
Give each cycle a lens of its own:

| Cycle | Lens |
| --- | --- |
| 1 | **Correctness and edge cases.** Does it do what it claims, on empty, `NaN`, boundary and degenerate input? |
| 2 | **Behavior delta.** What changed that is not visible in the diff — base classes, shared utilities, attribute types? What regressed? |
| 3 | **Claims against code.** Every statement in the changeset, PR description, reference pages, comments and commit message, traced to the code that makes it true. Plus test and documentation coverage. |
| 4+ | The reviewer's own judgment, informed by the ledger. |

A lens is a starting point, not a restriction: a cycle that notices a bug outside its lens
should still fix it.

## The ledger

Each cycle appends a short entry recording what it verified and how, what it found, and
what it deliberately did not do and why. The next cycle reads the ledger first, so settled
ground is not re-derived and deferred items are reconsidered rather than forgotten.

## When to stop

- Run at least **two** cycles.
- Stop when a cycle finds **no correctness issue** — no bug, no inaccurate claim, no
  missing coverage for behavior that is in the diff. Documentation polish, wording changes
  and typo fixes do not by themselves justify another cycle.
- The orchestrator judges this against the ledger. Do not leave it to the agent that made
  the changes to decide whether its own changes were significant.

**Five cycles is a soft cap, not a hard one.** If a fifth cycle is still turning up real
problems, do not simply keep going, and do not stop merely because a number was reached.
Put it to the user: report what the last two cycles found, say why the evidence suggests
more remain, and let them decide whether to continue. A PR still yielding defects at cycle
five may need something other than another cycle — it may need to be split, or its approach
reconsidered — and that is a judgment for a person to make.

## Final report

After the last cycle, summarize for the user:

- How many cycles ran and why they stopped.
- The most important changes made across all cycles.
- Anything reported but deliberately not fixed, and why.
- A link to the PR.
