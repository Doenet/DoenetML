# DoenetML principles

These documents distill the behavior of DoenetML into **principles**: short, consistent rules
that let an author predict what a construction will do. They are written to guide a ground-up
rewrite of the core (such as the cells core in Doenet/DoenetML#2281). The ~5,000-test Vitest
suite is the parity oracle for any new core, but its tests are not equally important. A test that
locks in one of these principles is critical. A test that locks in an accident of the current
implementation is not, and should not force convoluted code into a new core.

The survey behind these documents read the tests, the worker code, the Rust resolver, and the
PR descriptions of the recent `extend`/`copy` work (#2213–#2263, #2318, #2322). Uncertain
behavior was checked by running small probe documents against `main` (2026-10-24, at
`c5eaefa`). Results from those probes are marked **[probe]**. File and line citations are to
that commit. Line numbers drift, so each citation also gives the test's name.

## The documents

| Document | What it covers |
|---|---|
| [references-extend-copy.md](references-extend-copy.md) | `$x`, `extend`, `copy`, and what happens when they nest. Name resolution and scope. **Start here.** |
| [values-and-attributes.md](values-and-attributes.md) | `$x.prop`, references read as values, attribute values, missing values, number formatting |
| [inherited-attributes.md](inherited-attributes.md) | `fixed`, `fixLocation`, `draggable`, `disabled`, `hide`, `styleNumber`, display settings, labels |
| [composites-and-lists.md](composites-and-lists.md) | `group`, `repeat`, `select`, `conditionalContent`, `collect`, `module`, value lists, commas |
| [interaction-and-state.md](interaction-and-state.md) | inverse updates and `bindValueTo`, saved state and reload, actions, answers, variants |
| [decisions.md](decisions.md) | the inconsistencies found, each with a proposed rule and the tests it would change, in priority order |
| [testing-principles.md](testing-principles.md) | how the suite is organized today, and how to tag, sweep and encode principles so they keep holding |

## Tiers

Every principle carries an id (`REF-2`, `CTX-4`, …) and a tier.

- **Tier 1: author guarantees.** These can be explained to an author in a sentence or two, and
  authors rely on them to predict behavior. Breaking one breaks documents. A new core must pass
  every Tier 1 test before it ships.
- **Tier 2: consistency invariants.** Authors would not be told these. They are what make the
  experience uniform: every graphical component treats `fixed` the same way, a reload restores
  what the reader saw, and a bare `$m` is indistinguishable from `<math extend="$m"/>`. A new core
  should hold them. A deviation needs a recorded decision.
- **Tier 3: incidental behavior.** Tests pin it, but it follows from an implementation choice, a
  special case or an accident of history. A rewrite may change it, especially when keeping it
  costs convoluted code. Each Tier 3 entry says why it is incidental.

Two more labels appear:

- **Inconsistency.** Current behavior does not follow a clean rule. Each one is listed in
  [decisions.md](decisions.md) with a proposed rule.
- **Changed.** A decision, for example in a cells-core ADR, deliberately replaces the current
  behavior. The old tests then count as expected failures, not parity gaps.

## The author model in one page (Tier 1)

If an author learns only these rules, they can predict nearly every construction. Everything
else in these documents either refines one of them or is an exception that should be
removed.

**Names**
1. `$x` means the nearest `x` around where it is written. `$a.b` is the `b` inside `a`, and
   `$r[2]` is the second item of `r`. If the nearest scope has two `x`s, the reference is
   ambiguous: it reports a warning and shows nothing. (NAME-1, NAME-2)
2. Names inside a copied or repeated piece are private to it. Reach them through the
   container's name: `$copy.h`, `$r[2].h`. (NAME-3)

**References and `extend`**

3. `$x` puts x itself there, again. It shows x's current state, and interacting with it
   changes x. `<T extend="$x"/>` is the same reference, written out so that you can change it.
   (REF-1, REF-2)
4. On an `extend`:
   - an attribute you write replaces x's;
   - an attribute you don't write comes from x;
   - children you write are added after x's;
   - a different tag `T` converts x's value, and the two stay linked.

   (REF-3 to REF-5)

**`copy`**

5. `copy="$x"` behaves as if x's DoenetML were pasted there, with the reader's current state
   carried over. After that the copy is on its own: changing x no longer changes it.
   References inside it stay live. Ones that pointed into x now point into the copy.
   (CPY-1 to CPY-3)
6. A copy of a reference pastes what the reference points to. A copy of a property
   (`copy="$P.x"`) has no DoenetML to paste, so it holds the value. (CPY-4, CPY-5)

**Values and attributes**

7. `$x.prop` is a new value. It is not the component, so it has no label, no `hide` and no
   style of its own. It is still two-way: typing into it changes x. (VAL-1, VAL-2)
8. A reference written where a value is read (`<math>$n+1</math>`, `xMin="$n"`) acts like
   the referent's current value written there. (VAL-3)
9. An attribute is read in one of three ways:
   - plain text is parsed as the attribute's type;
   - exactly one reference *is* that reference, in both directions;
   - an expression is recomputed from its references.

   (VAL-6 to VAL-8)

**Composites**

10. A composite (`group`, `repeat`, `select`, `conditionalContent`, `module`, …) disappears;
    its content sits where it was written. A list-like composite separates its items with
    commas. (COMP-1, COMP-2)
11. Selections are made once, from the variant, and never change. The same variant gives the
    same selections. (COMP-8, VAR-1)

**Inherited attributes**

12. `hide`, `fixed`, `fixLocation`, `disabled` and `styleNumber` written on a container apply to
    what is inside it. Something inside can opt out with its own attribute, except that nothing
    inside a hidden container can unhide itself. (CTX-1 to CTX-6)
13. What each one does:

    | Attribute | Effect |
    |---|---|
    | `fixed` | no interaction can change the component |
    | `fixLocation` | it cannot move |
    | `draggable="false"` | the reader cannot drag it |
    | `disabled` | an input or button takes no input and does not act |

    (CTX-1 to CTX-4)

**Interaction**

14. An input shows the value it is bound to. Typing into it changes that value if a formula
    can be run backward (`2$n+1`, `($a,$b)`). Otherwise it snaps back. (INT-1 to INT-3)
15. A reader's work survives a reload, and survives content being hidden and shown again.
    (SAVE-1, SAVE-4)

## A correction to the framing that started this

The principle "a construction behaves as if the referent's DoenetML were pasted here" belongs
to **`copy`**, not to `extend`. The survey confirms it for `copy` (#2240, #2259, #2231,
`copying/copy_of_extend.test.ts`).

An `extend` is *the same component, with your changes*. It does not re-paste the source.
References inside an extended subtree keep the meaning they have in the source, however many
`extend`s are chained (REF-6). A copy, by contrast, is pasted, so references to names outside
the copied part are looked up again where the copy lands (CPY-6). That difference is
author-visible ([decisions.md](decisions.md), D1).

The exception remembered from the recent PRs is **a copy of an extend** (#2259). `r` names a
linked reference, which has no DoenetML of its own, so `copy="$r"` pastes the DoenetML of what
`r` points to, with r's own attributes on top. That is principled. The leftover special case is
in the implementation: a per-class list (`attributesDefiningPrimaryValue`) decides which classes
re-paste their definition, and the rest freeze their value
([references-extend-copy.md](references-extend-copy.md), CPY-4).

## How to use these documents

- **For a rewrite.** Port the Tier 1 and Tier 2 principles first. Use the test lists under
  each principle as the acceptance set. Treat the Tier 3 lists as tests to rewrite against
  observable behavior, or to retire. Settle the [decisions](decisions.md) before porting the
  tests they touch.
- **For reviewers.** When a PR changes behavior, ask which principle id it touches. A change
  to a Tier 1 principle needs a maintainer decision and a changeset. A new special case
  should be recorded as an exception on its principle, or as an inconsistency.
- **For tests.** [testing-principles.md](testing-principles.md) proposes a `principles/` test
  layer with native Vitest tags (`{ tags: principle("REF-3") }`), schema-driven sweeps that
  test every component against the cross-cutting rules, and a black-box test API that any core
  can implement.

## Status

This is a first survey, not a ratified contract. The tier given to each principle is a
proposal. The decisions in [decisions.md](decisions.md) are open questions for the
maintainers, though each one carries a recommendation.
