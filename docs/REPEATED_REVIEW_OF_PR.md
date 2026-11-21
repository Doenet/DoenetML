# Repeated Review of a PR

After creating a PR, use this procedure to iteratively improve it through a series of
subagent reviews. Each cycle spawns one subagent, which reviews the PR as the previous
cycle left it.

## Before the first cycle

Put these in every subagent's brief, not just the first:

- **The working directory, as an absolute path**, and an instruction to verify it before
  starting. More than one checkout of this repository may exist on the machine, and a
  review agent that starts in the wrong one will commit to the wrong one.
- **What to review.** If the PR is part of a stack, its GitHub diff includes every PR
  beneath it. Point the reviewer at `git diff <parent-branch>...HEAD`, name the branches it
  must not touch, and say plainly that a finding in a lower PR is to be **reported, not
  fixed**.
- **What is already settled** — decisions taken, refactors deliberately deferred, traps
  already hit. Without this each cycle re-derives the same conclusions and re-proposes the
  same declined changes.

## The review cycle

Give the subagent these instructions:

1. Verify the previous cycle's changes (skip on the first cycle). Take its ledger entry as
   a set of claims, not as settled fact, and check the ones it recorded as *assumed* or
   *read* rather than *ran*. Confirming a change was unnecessary, or wrong, is as useful an
   outcome as a new finding — say so and revert it.
2. Review the PR according to `docs/PR_REVIEW_GUIDELINES.md`, through this cycle's lens.
3. Address the issues identified during the review — but **confirm a finding before
   changing code for it**. If the guidelines' test says you established it by *assuming*,
   either settle it by running something or report it without acting on it. A wrong
   correctness fix is worse here than a wrong report, because it is committed, pushed, and
   inherited by every later cycle as a decision already taken.
4. Verify the changeset still describes the user-visible behavior in the diff; update if not.
5. Verify the PR description still describes everything in the diff; update if not. Don't
   skip this — nothing else in the pipeline checks it.
6. Commit and push the results.
7. Append to the ledger, and report back a short summary of what was changed (or "no
   changes" if nothing needed updating).

Run cycles **sequentially** — each new subagent must see the prior subagent's commits, so
wait for one to finish before spawning the next, and pull the latest branch state in
between.

## Lenses

Repeating one prompt has steep diminishing returns; asking a different question does not.
Give each cycle a lens of its own. The first three lenses are different questions, not
three attempts at the same one, and each covers a class of defect the others do not:

| Cycle | Lens |
| --- | --- |
| 1 | **Correctness and edge cases.** Does it do what it claims, on empty, `NaN`, boundary and degenerate input? |
| 2 | **Behavior delta.** What changed that is not visible in the diff — base classes, shared utilities, attribute types? What regressed? |
| 3 | **Claims against code, both directions.** Every statement in the changeset, PR description, reference pages, comments and commit message, traced to the code that makes it true — *and* every statement elsewhere in the repository that this change made false. Plus test and documentation coverage. |
| 4+ | The reviewer's own judgment, informed by the ledger. |

A lens is a starting point, not a restriction: a cycle that notices a bug outside its lens
should still fix it.

The second direction of cycle 3's lens is the one that gets skipped, because it is the one
the diff does not show. A change that adds a case to something makes every sentence that
enumerated the old cases wrong, and those sentences are in files the diff never touches: a
module header listing what the folder holds, a sibling's comment saying "the only type
that…", an attribute description that named every case but the new one, a changeset still
pending from the previous PR in the series. Reviewers from outside the loop find these
immediately, because they are reading the code rather than the diff.

What finds them cheaply is a grep for the phrases that quantify — "the only", "every
other", "always", "never", "both", "neither", a count of things — across the component and
its neighbors, with each hit checked against the code as it now is. That takes minutes and
does not depend on guessing which file to open.

## The ledger

Each cycle appends a short entry recording what it verified and how, what it found, and
what it deliberately did not do and why. The next cycle reads the ledger first, so settled
ground is not re-derived and deferred items are reconsidered rather than forgotten.

Keep two kinds of entry apart, because the next cycle must treat them differently:

- **Decisions** — a refactor declined as out of scope, an approach chosen, a trap already
  hit. These are closed. Do not re-litigate them.
- **Findings and the changes made for them**, each recorded with how it was established:
  **ran it**, **read the code**, or **assumed**. These are open. They are the previous
  agent's conclusions about code it was editing at the time, and the next cycle is the only
  independent reader they will get.

A ledger that blurs the two suppresses the loop's own check: fresh eyes on the last cycle's
work are what a sequential loop has instead of a separate verification stage, and an entry
written as "fixed, verified" spends that for nothing.

## When to stop

- Run at least **three** cycles — one for each lens. The minimum is three because there
  are three lenses, not because three passes are better than two: stopping at two skips the
  claims-against-code pass entirely, which is the one that catches a false statement
  repeated across the changeset, the PR description and the reference pages. A quiet cycle
  under one lens says nothing about what the next lens would find.
- From the fourth cycle on, stop when a cycle finds **no correctness issue** — no bug, no
  inaccurate claim, no missing coverage for behavior that is in the diff. Documentation
  polish, wording changes and typo fixes do not by themselves justify another cycle.
- The orchestrator judges this against the ledger. Do not leave it to the agent that made
  the changes to decide whether its own changes were significant.
- A cycle that reports "no changes" is a real result and is how this loop is meant to end.
  A cycle that produces a finding in order to look productive costs the next cycle the time
  to disprove it, so the brief should say so.

When the loop ends on a cycle that *made* changes — at the cap, or because the user
called it — those changes are the only ones no other cycle has seen. Run one more agent
that reviews and reports without committing, rather than treating the last cycle's own
account of its work as verification.

That pass reports rather than commits so that the loop terminates. When its report
produces a fix — which is the usual outcome if it found anything — the fix is itself
unreviewed, and running another pass over it only moves the problem along. Two ways out,
and the choice belongs to whoever is running the loop: run one more report-only pass and
stop there whatever it says, or land the fix and say plainly in the PR that it stands on
its author's evidence alone, naming that evidence. What is not a way out is letting the
question go unasked.

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
