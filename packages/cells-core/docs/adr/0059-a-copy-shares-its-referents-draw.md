# A copy shares its referent's draw

Status: proposed 2026-11-24.

A load-time draw (ADR 0009, ADR 0037) is a value the copy rules share
the way they share a given value. An element that extends another
draws what its referent drew, also when it writes attributes of its own
(`<shuffle extend="$s" asList="false"/>`, `<choiceInput extend="$ci"
inline="false"/>`, `<selectFromSequence extend="$s" hide/>`), unless it
writes something the draw depends on (`from`, `to`, `numToSelect`, a
shuffle's operands), in which case it draws its own.

## Context

A draw is a hidden port of the drawing element, `Leaf::Scope(
ScopeConst::Draw)`: a number in `[0, 1)` from the document seed, the
element's stable key and its scope (`seeded_stream`), which the
element's pick, samples or order are computed from (`VecOp::
SequencePick`, `Draws`, `Shuffle`). A bare copy aliases every public
prop of its referent, so it shows what the referent drew. A copy with
attributes of its own is planned by its type's planner from its record
merged under the referent's (ADR 0023), which makes a draw leaf of its
own, keyed by the copy: it drew anew. The current core's copies keep
their referent's selection (`selectfromsequence.test.ts` "copies don't
resample", `shuffle.test.ts` "asList", `choiceinput.test.ts`), and the
user decided (2026-11-24) that every load-time draw is shared by a copy
the way given values are, unless the copy overrides what the draw
depends on.

## Decision

1. **A planner declares its draw and what it depends on.**
   `ElemWiring::draw(DrawOn { attrs, children })` makes the draw port and
   records the attributes whose values decide what is drawn from it, and
   whether the children do. Every drawing type uses it:
   `<selectFromSequence>` (its sequence's parameters, `numToSelect`,
   `withReplacement`; not `sort` or `hide`), the random-number and prime
   samplers (every parameter and the count; not a prime select's `sort`),
   `<shuffle>` (its children, and `type`, which splits bare text into
   operands) and a `<choiceInput>`'s `choiceOrder` (its choices,
   `shuffleOrder` and `preserveLastChoice`). A type draws at most once.
2. **The copy rule shares it.** `plan_with_extend` (`compile/stages/
   plan/copies.rs`) pushes a `Share` of the draw, `GivenId::Draw`, for a
   copy that writes none of what its draw depends on, and linking
   (`link_given_leaves`) aliases the copy's draw port to the referent's,
   as it does for a given leaf, across templates by the extend's path.
   The copy's pick is then the same instruction over the same draw and
   the same parameters, which sharing (ADR 0033) may merge with the
   referent's. A copy that writes a parameter keeps its own draw, keyed by
   itself, as before.
3. **What a draw is stays as ADR 0037 has it.** The shared draw is a
   scope constant of the referent's scope, read through an alias, so the
   check's constancy and range of the copy's pick are the referent's; a
   copy of an iteration's draw from outside the repeat reads that
   iteration's. The draw port has a saved-state key (`_draw`, as a given
   leaf's hidden port has), which nothing saves, a draw being a constant.

## Considered options

- **Share the draw whatever the copy writes.** Rejected: a copy with
  `to="20"` reading its referent's draw would pick a number correlated
  with the referent's but not equal to it, neither the same selection nor
  an independent one.
- **Share only with a bare copy** (what there was). Rejected by the
  user's decision: a copy changing how the selection is shown is the same
  selection.
- **Key the draw by the referent's key** instead of aliasing it. Rejected:
  the copy may sit in another scope, whose levels the stream mixes in, and
  the alias says the same thing with the machinery given values use.
- **Declare the dependencies in `component!`** rather than in the
  planner. Not taken: the planner is where the draw is made, and the
  samplers share a planner whose callers know their attributes.

## Consequences

- `<selectFromSequence extend="$s" asList="false"/>`, `<shuffle
  extend="$sh" asList="false"/>` and `<choiceInput extend="$ci1"
  inline/>` show their referents' selections; `<selectFromSequence
  extend="$s" from="1"/>` draws anew.
- `tests/every_count.rs` holds the rule at eight seeds, for every drawing
  type, inside and across a repeat (`a_copy_draws_what_its_referent_drew`),
  and its construct `shared-draws` runs the sweep's invariants over the
  aliased draws.
- An extend of a bare copy that writes attributes of its own finds no
  draw on its referent's plan (a bare copy plans none) and draws its own,
  as it finds no given leaf to share; that is the extend-chain case, not
  this rule's.
