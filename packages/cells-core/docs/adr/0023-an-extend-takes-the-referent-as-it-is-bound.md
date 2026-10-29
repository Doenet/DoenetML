# An extend takes what it inherits as the referent binds it

Status: accepted 2026-10-29.

An element that extends another and writes attributes or children of its
own is the referent with those changes: what it writes is planned where
the element sits, and what it takes from the referent is planned where
the referent sits, so a reference in an inherited attribute, in inherited
children or in an inherited constraint keeps the meaning it has at the
referent. An extend with changes of its own whose referent is not an
element of the same scope (reached by an index, from another repeat or
choice, or an element the compile made) is refused with a diagnostic; a
bare extend of it still aliases.

We chose this because an extend is the same component (REF-6 of the
principles, Tier 1: "every reference inside the extended subtree means
what it means in the source, through any number of chained extends"),
and the cells core had been re-planning the referent's attributes where
the extend sits, so that

```xml
<section name="A"><number name="n">1</number><point name="P" x="$n" y="0"/></section>
<section name="T"><number name="n">2</number><point name="Q" extend="$A.P" y="5"/></section>
```

gave `Q.x = 2` (`docs/principles-alignment.md` §3.2): the extend had
silently become a copy with the binding the principles single out as the
most surprising one in the language. Across a scope the same path had no
referent to take the rest from and planned the element from its own
attributes alone, so `<point extend="$r[2].P" y="5"/>` was `(0, 5)` with
no diagnostic.

## Considered options

- Aliasing every prop the extend does not override to the referent's
  slot, and planning only the overrides, which would let planners forget
  the referent altogether (`PlanCtx::base`, `shared_state`, `Given`).
  Not taken yet: a `Plan` type's planner decides the wiring from the
  attributes and children together, and the referent's children (a
  point's `(a, b)`, its constraint) must still shape an extend that
  overrides one attribute, which is what `base` provides. The prop-table
  types already inherit by alias (`plan_attrs`), so the two mechanisms
  meet at `Source::Inherit`; folding the `Plan` types into it is a later
  step, and this ADR makes the current one correct first.
- Planning the referent's attributes once, on the referent, and reading
  their sources back. Rejected for now: the referent's planner may have
  folded an attribute into a vector operator or a hidden slot, so there
  is not always a source per attribute to read.

## Consequences

- `PlanCtx` knows the referent's node, its scope and every node under it;
  each planning method picks the referent's scope for the referent's
  nodes (`scope_for`, `scope_for_attr`), and `plan_flag` does the same for
  an inherited `hide`. Planners change nothing: a planner that reads
  `ctx.base()`'s children and plans them gets the right scope.
- A point that extends another and writes one coordinate takes the
  other from the referent's `(a, b)` children, as REF-3 says ("an
  attribute you don't write comes from x"); it used to default it to 0.
- Refusing override-extends across a scope is an ADR 0021 choice: a wrong
  answer with no diagnostic becomes a reported gap. Supporting them
  means planning the referent's attributes in a template the extend is
  outside of, which the alias approach above would give for free.
