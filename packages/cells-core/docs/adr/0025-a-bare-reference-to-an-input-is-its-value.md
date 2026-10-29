# A bare reference to an input is its value, and related types extend each other

Status: accepted 2026-10-29.

A bare reference to an input (`$mi` of a `<mathInput>`) is the value the
reader entered, as a component of the type the input's definition says it
*reads as* (`reads_as: Math`): a `<math>` whose `value` and `expr` alias the
input's, not a second input. The written-out form, `<mathInput
extend="$mi"/>`, and a reference through an iteration, `$r[1]`, are the
input. An `extend` across related types is the referent's value as the
element's type: a number and a math either way, an input and a value type
it reads as or one related to it, either way (`<math extend="$n"/>`,
`<mathInput extend="$n"/>`, `<text extend="$ti"/>`). Any other pair is
refused at load: "cannot extend a `<section>` as a `<math>`". And what a
repeat, a select or a collect produces is shown as a list, its items
separated by commas, unless it says `asList="false"`; a `<group>` is a
list only with `asList`.

We chose these because each is a Tier 1 author guarantee the core did
not hold (`docs/principles-alignment.md` §3.7 to §3.9). REF-1a: "a bare
reference to an input is the input's value"; the core made a second
input, and feedback written "you entered $mi" drew an input box. REF-5
and D26: related pairs give the value as the written type, any other
pair is an error; the core refused every pair, `<math extend="$n"/>`
included. COMP-2: repeated, picked or gathered items are separated by
commas; the bridge spliced them with nothing between.

## Considered options

- Deciding the implicit prop by the reference's position (a value where
  the parent reads a value, the component where it takes components), as
  D11 proposes for every reference. Deferred: this ADR takes D21's
  declared form, one field in the input's definition, which the docs and
  a future D11 rule can both read; the position rule can be laid over it.
- Re-planning the referent as the new type for a related-type extend
  (`<number extend="$m"/>` reading the math's text as a number).
  Rejected: an extend of a prop already aliases, and the value is what
  the pair means; a symbolic math as a number is NaN, as its `value` is.
- Commas in the core's component table, as text children. Rejected: a
  comma is presentation, decided by where the list is drawn (none in a
  graph, none around a block item), which only the renderer knows; the
  core's text (`rendered_text`) stays without them for now.

## Consequences

- `component!` takes `reads_as: T`; `ComponentType::reads_as` and
  `extends_as` are the two tables. The build's `place` makes a value
  component (`value_copy_into`) for a bare reference to such a type,
  aliasing the referent's props of the same names and recording the
  referent (ADR 0024); `elem_shape` turns a related-type extend into the
  extend of the referent's default prop, which `plan_extend_prop` now
  takes for text and boolean types too. The build's type check stays as
  the backstop for pairs the compile cannot see (past an interface name).
- A number and a text are not related here: there is no operator that
  formats a number as text yet. D26 lists the pair; it joins the table
  with the operator.
- The bridge's `_listItems` groups a repeat's or a select's children by
  scope (one iteration or pick is one item) and a collect's or group's
  one by one, skips empty items, and turns the commas off inside a graph
  or when an item is a block (`BLOCKS`). Commas inside a `<math>` and in
  the core's text are not done.
