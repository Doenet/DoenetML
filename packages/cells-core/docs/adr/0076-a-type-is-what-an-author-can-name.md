# A type is what an author can name: one typing stage, three relations, and refinements beneath

Status: proposed 2026-11-25. A draft for review: nothing in it is
implemented. Replaces the framing of ADR 0064 (its §3, one conversion
table, and §4, `PortType::Bool`, become instances of the relations here;
its §1, §2 and §5 stand). Builds on ADR 0027 (the compile runs in
stages), ADR 0032 (plans are typed ports), ADR 0041 (every list is a
sequence), ADR 0043 (an operator is numeric or symbolic by its operands'
types) and ADR 0046 (missing is a value of its own). Read against the
DoenetML principles on Doenet/DoenetML's branch
`claude/wizardly-cray-9tas6j`: TYPE and TYPE-1 to TYPE-5 (D45), REF-5
(D26, D36, D64, D69), COMP-11, COLL-4, D46, D47, D54, D55, D58, D68 and
D75.

## Context

The core has no type system. It has six partial ones, each answering
part of "what is this value":

| Notion | Where | What it knows |
|---|---|---|
| `ComponentType` | `components/mod.rs` | the tag, except where `settled_type` reads a type off a `<math>`'s text |
| `PortType` (`Num`, `Text`, `Math`) | `compile/ir/port.rs` | how a port's cell is held; `Num` is the bottom, so a boolean, an integer and a misread string id are all `Num` |
| `ValueType` | `program/mod.rs` | the same three, per cell |
| `ValueKind` | `compile/read/values.rs` | what a reference reads, asked while planning; `None` through an index, an iteration or an interface name |
| `EntryKind`, `TextKind`, `PropDef::text`, `expr_of`, `ResponseKind` | `components/decl.rs`, the definitions | one fact each, per feature |
| `reads_as`, `extends_as`, `extend_reads`, `input_from_value` | `components/mod.rs` | which type changes an extend may make, as matches on types |

The checks that read them run in three stages. Outlining checks an
extend's type change. Planning checks a type mix, from `ref_value_kind`.
The seal's type pass (`stages/seal/types.rs`) checks a reference's shape
over the dataflow. ADR 0064's migration fills each stage separately, and
its "Left" list is the cases no one stage sees enough of: a mix through
an index or an interface name, an element child of an operator, a
boolean attribute given a number.

The principles state every type rule in what an author writes: a tag, a
prop, a list. None is stated in cells. So the rules have one natural
home, and the representation is beneath it.

## Decision

### 1. A type is something an author can say

A **type** is what a component, a prop, an entry or a reference *is*, in
words an author would use: "a text", "a point", "a list of maths". It is
decided from the DoenetML alone, before any value exists, and is the
same in every variant and every state (TYPE, TYPE-4).

Anything finer the core knows about a value is a **refinement** (§9):

> A refinement may narrow within a type. It never contradicts a type and
> never replaces one.

`settled_type` making `<math>(1,2)</math>` a `<point>` is a refinement
replacing a type, which this forbids. A boolean held in a number cell is
a refinement within `boolean`, which it allows, as long as nothing reads
the cell to decide what the value is.

### 2. The types

- **A tag.** Every component type is a type, named by its tag. D46's
  three kinds are declared on it: a **value** (`math`, `number`,
  `integer`, `text`, `boolean`), an **object** (`point`, `line`,
  `function`, `answer`, an input) or **content** (`p`, `section`, `m`,
  `label`, a wrapper of several components). All content is one type.
- **A list of T**: any number of entries, each a T (`mathList`, a
  `<collect>` of points, a repeat's iterations).
- **A tuple**: a fixed number of entries with a type for each position.
  An answer with a `<mathInput>` and a `<textInput>` has responses that
  are "a math and a text" (TYPE-2). A tuple whose positions all agree is
  a list of that type and is typed as one.

Three things are not types:

- **Written text.** `1 2 3` has no type until the place it sits in reads
  it (§4): numbers in a `<numberList>`, maths in a `<repeat for>`,
  numbers or texts by detection in a `<sort>` (D45 decision 7).
- **Missing** (ADR 0046). Every type has the missing value. A reference
  that names nothing is a missing math (D52).
- **How many entries a math has**, whether it is a number now, whether a
  student can write it. These are refinements.

### 3. Three relations between types

Every rule that lets a value of one type be used as another is one of
three relations, declared by the types.

| Relation | Meaning | Examples | What happens |
|---|---|---|---|
| **is a** | usable wherever the other is wanted, unchanged | an integer is a number; a number is a math; a triangle is a polygon | nothing |
| **stands in as** | presents one prop of itself when a value is wanted | a `<mathInput>` as its math; a line as its equation; an `<ion>` as its name | the prop is read |
| **converts to** | a different value is made, which may be missing | a text to a number; a math to a point; a number to a text | a conversion, which declares whether it runs backward |

**is a** is transitive, and it is the only relation that is: a list of
T is a list of U when T is a U, so `<number>`s and `<math>`s in one list
are a list of maths.

**stands in as** has two forms (D69):

- A type that **is its value** (an input, an `<angle>`) stands in as its
  value's type and may then convert as that type does:
  `<number extend="$mi"/>`, `<point extend="$mi"/>`.
- A type that **has a value to show** (a line's equation, an ion's name,
  a label's text) stands in as that type and nothing further:
  `<text extend="$line"/>` is a mismatch.

A composite the DoenetML guarantees holds one component stands in as it
(§5).

**converts to** is REF-5's pairs: math, number and text among each
other, and text from a boolean; point, vector and coords among each
other; math from a point, vector or coords, and each of those from a
math; a list from the matching scalar. A boolean and a number, and a
text and a boolean, are not a pair (D47, D68).

**The longest chain** from a type to a wanted type is one *stands in
as*, then one *converts to*, each optional, with *is a* free at either
end. A conversion never follows a conversion. Two types no chain
connects are a **mismatch**.

### 4. A place wants a type

A **place** is anywhere a value arrives: an attribute, a position among
an element's children, an operand, a leaf of math text, an operand of a
condition, a tag written over an `extend`. Each place declares the type
it wants, in one of four forms:

- **a type**: a point's `x` wants a number, `hide` a boolean;
- **the same as another place**: an `<updateValue>`'s `newValue` wants
  its target's type (D54), an award's content its answer's, which the
  answer's input decides (D55);
- **one type across its items**: a `<sort>`, `<shuffle>` or `<tally>`
  wants every item to be one type (COLL-4), by *is a*;
- **named by a literal attribute**: `type="text"` (TYPE-5).

One judgment is applied at every place, `fit(have, want)`, with four
answers: the same (by *is a*), a stand-in, a conversion, or a mismatch.
What a mismatch does is the place's kind, not the pair's:

- **A tag that cannot be made** (`<boolean extend="$n"/>`) is an error:
  nothing can be put there (REF-5, `doenet-e0065`, `e0062`, `e0063`).
- **A value arriving where another type is wanted** (`<boolean>$n</boolean>`,
  `hide="$n"`, `<math>$b+1</math>`) is the missing value in its place,
  with a warning: the place is still made (D47, D75 decision 5,
  `doenet-w0203`, `w0204`).

### 5. A composite's type

A `<group>`, a `<select>`, a `<conditionalContent>` and a repeat's
iteration are typed from what is written in them.

- One the DoenetML guarantees holds exactly one component (a group of
  one, a select with `numToSelect` a literal 1 or absent, a conditional
  whose every case holds one) *stands in as* it.
- Where several branches may be shown, its type is the one type every
  branch **is a**, if there is one. A `<number>` case beside a `<math>`
  case is a math. A `<point>` case beside a `<vector>` case has no type,
  though each converts to the other, since the conversion would depend
  on the branch shown.
- A name after a composite (`$s.go`) is typed the same way, over every
  component of that name (COMP-11).
- One that may hold any number of components of one type is a list of
  it.

### 6. An index

- Into **a list of T**: a T, for any index, literal or computed. Past
  the end it is missing.
- Into **a tuple**: the type of that position, and the index must be a
  **written literal** (`$a.currentResponses[2]`). Any other index
  (`[$k]`, whatever `k` is) is an error at load. So the typing stage
  reads tags and literals and never a value.
- Into **a value with entries** (ADR 0064 §2): an entry, a math or a
  number as the type declares. How many it has is a refinement.
- Into **a scalar type** (`$n[1]` of a `<number>`): an error at load
  (D75, `doenet-w0100`'s case).

### 7. Declarations

A component definition (`component!`) declares, as data:

- its kind (value, object, content), what it *is a*, what it *stands in
  as* and in which form, and what it *converts to*, each conversion with
  its direction;
- each prop's type, or a function of the element's written attributes
  and children that gives it (D45 decision 2: a slider's `value` by its
  `type`, a choice input's `selectedValues` by its choices);
- for each attribute and each child position, the type it wants (§4).

These declarations are the one table. The typing stage reads it,
`cells-docgen` exports it, and the schema and the language server read
the export (D45 decision 2). `EntryKind`, `TextKind`, `PropDef::text`,
`ResponseKind`, `reads_as`, `extends_as`, `extend_reads` and
`input_from_value` are restated in it and removed.

### 8. One typing stage

A stage of the compile (ADR 0027), after outlining and before planning,
with its own table (ADR 0031). It reads what outlining settled and the
declarations, and no value.

It gives:

- every element's type, and every prop's;
- every reference's type, walked along its path element by element
  (a name, an index by §6, an interface name by §5, a prop by §7);
- for every place, its `fit`: the same, which prop stands in, which
  conversion, or a mismatch with its diagnostic.

Planning reads that table. A planner asks no type question: it is
handed a reference already resolved to "this prop, converted so", or
the missing value where the place was a mismatch. `ref_value_kind`,
`Arenas::type_mix`, the type cases of `plan_extend_prop` and the checks
in `seal/types.rs` that produce an author's diagnostic go away.

### 9. Refinements

What the core knows beneath a type:

| Refinement | Within | Decided by |
|---|---|---|
| representation (`PortType`): a number cell, a string id, an engine handle | every type | the seal's type pass (ADR 0032) |
| numeric or symbolic | math and what is a math | the dataflow (ADR 0043) |
| the entries a written value has | a value with entries | its text (`<math>(1,2,3)</math>` has three) |
| writable, and through which inverse | every type | ADR 0018, ADR 0026 |
| constant | every type | ADR 0028 |

Each type declares the representations it allows (a boolean: a number
cell holding 0 or 1; a math: a number cell or a handle; a text: a string
id). The seal's pass keeps its fixpoint and now only chooses among them.

A refinement may produce one kind of author diagnostic: **an error that
a reference can never give anything** (D75), where the DoenetML proves
it. `$ms[1]` of `<math name="ms">5</math>` and `$mt[4]` of
`<math name="mt">(1,2,3)</math>` are legal by type and are errors by
refinement. Where the DoenetML does not prove it (`$mi[4]` of a
`<mathInput>`), the reference loads and is missing until it isn't. A
refinement never makes legal what the types refuse.

A refinement that disagrees with a type (a text port typed for a
boolean prop) is a bug in the core: an internal error, with a test that
no document reaches it, never an author's diagnostic.

### 10. Diagnostics

Every type diagnostic comes from the typing stage, names the tags the
author wrote, and says which relation was missing and the form that
works (DIAG-3, ADR 0064 §5): "a number is not a boolean: write
`$n != 0`". The codes are the principles'.

## Departures from the principles

Three decisions here differ from the principles as written, and should
be carried back to them:

1. **A number is a math** (§3). REF-5 counts an `<integer>` case and a
   `<number>` case as one type "for a `<number>` … but not for an
   `<integer>` or a `<math>`"; here `<math extend="$cc"/>` of them is
   allowed, since both are maths.
2. **An index into a tuple is a literal** (§6). TYPE-2 types a changing
   index when every entry it can reach shares a type; here it is
   refused.
3. **Only *is a* joins branches** (§5). REF-5's "two types that could
   each become T" becomes "two types".

## Considered options

- **Finish ADR 0064 as written** (`PortType::Bool`, one
  `conversion(from, to)`). Rejected as the system, kept as the behavior:
  it reaches the principles' answers, with the rules still spread over
  three stages and the type still partly read off the representation.
- **Author types as elements of the seal's lattice.** One inference,
  which sees through every alias and index for free. Rejected: it runs
  after planning, so planners cannot read it, and a rule about tags has
  to be encoded on ports and translated back for a diagnostic.
- **The typing stage alone, with the representation computed from the
  type.** Rejected: numeric or symbolic is a fact of the dataflow (ADR
  0043), not of a tag.
- **Number and math as two types with a conversion.** Rejected: a list
  of numbers and maths needs a second "same kind" relation beside the
  table, which D46 already had to state.
- **Entry count in the type** (`Math[2]`). Rejected: every rule gains a
  known-length and an unknown-length case, and what it would catch is
  D75's error, which a refinement gives.
- **A tuple index decided by the source** (`[$k]` where `k` is
  `<number>2</number>`). Rejected: the typing stage would evaluate
  values. The core's *constant* (ADR 0028) is too wide for it besides: a
  select's pick is one, and would give a type that differs by variant.
- **Writability and missing-ness in the type.** Rejected by the rule of
  §1: neither is something an author says a value is.

## Consequences

- One stage is the source of every type diagnostic, and a document's
  type errors are a function of its tags and literals.
- Planners get smaller: the type cases in them are answers they are
  handed.
- A new component type must declare its kind, its relations and what
  each of its places wants, or it does not compile.
- The seal's type pass keeps its work and loses its author diagnostics.
- The reference path walk (`plan_ref`, the seal's `Walk`) has to be done
  once, over elements, before planning. This is the largest cost.

## Open

- Whether the path walk before planning can share its result with
  `plan_ref`, so a path is resolved once.
- How a place that wants "the same as another place" is ordered when
  the other place's type itself depends on a third (an award in an
  answer whose input is a composite).
- Whether `cells-docgen`'s export replaces `packages/static-assets`'
  schema generation or feeds it.

## Migration

Each step leaves the tests passing.

1. The declarations (§7) beside today's flags, with a test that they
   agree with `EntryKind`, `text`, `reads_as` and the rest for every
   type.
2. `fit` (§3, §4) as a function over the declarations, tested against
   REF-5's table and ADR 0064's probe table, called by nothing.
3. The typing stage, computing its table and compared against what
   outlining, planning and the seal decide today, reporting nothing.
4. The stage's diagnostics replace outlining's and planning's, one place
   kind at a time: a tag over an extend, a child, an attribute, a math
   leaf, a condition's operand.
5. Planners read the table; `ref_value_kind` and the old flags go.
6. Lists, tuples and composites (§2, §5, §6), with an answer's
   responses.
7. The seal's assertion (§9), and D75's errors from refinements.
8. ADR 0064's open steps (a `<math>` is always a math, values with
   entries) on top of it.
