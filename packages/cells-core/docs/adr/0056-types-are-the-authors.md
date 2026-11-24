# Types are the author's: a tag makes that tag, and a value converts only as the principles allow

Status: proposed 2026-11-24. Aligns the core with the DoenetML principles
on types (Doenet/DoenetML `docs/principles/`, branch
`claude/wizardly-cray-9tas6j` at `e88b27e`): TYPE and TYPE-1 to TYPE-5
(D45), REF-5 (D26, D36, D64, D69), VAL-3, the type mixes of D47, D58 and
D68, values with entries (D27, "Values with entries"; COLL-1) and DIAG-3.
Builds on ADR 0032 (plans are typed ports), ADR 0043 (an operator is
numeric or symbolic by its operands' types), ADR 0046 (missing is a value
of its own) and ADR 0041 (every list is a sequence).

## Context

The principles separate two things this core runs together:

- **The author's type**: what a component *is*, decided from the DoenetML
  before anyone reads the document (TYPE). A tag you write makes that tag
  (D36): `<math>` is always a math, whatever it holds. A conversion
  between types happens only where the principles allow it (REF-5's
  table), and a value of one type where another is wanted is either
  converted (VAL-3) or a *type mix*: a blank in its place and a warning at
  load (D47, D68, D58).
- **The core's representation**: which cells hold the value and whether
  each is a number, a string id or an engine handle (`PortType`,
  ADR 0032).

Here the representation decides the type. Probes of the core at `6a6c5a5`
(each a document loaded with `testing::test_utils::load`):

| Written | Principles | This core |
|---|---|---|
| `<math>(1,2)</math>` | a math holding a tuple | a `<point>` (`settled_type`); `(1,2,3)` a `<tuple>` |
| `<math>(x,1)</math>` | a math | a point at `(NaN, 1)`, silently |
| `<math extend="$m"/>` of that math | the math again | "cannot extend a `<point>` as a `<math>`" |
| `<math>$P</math>`, `<text>$P</text>`, `$m + (1,1)` | the tuple | "a reference inside math must name one cell" |
| `<boolean>$P = (1,2)</boolean>` | compares the coordinates | the document failed to load |
| `<number>$t</number>` of the text `hi` | `NaN` (VAL-3) | `5`: the string id read as a number |
| `<math>$b+1</math>`, `<number>$b</number>` | blank, `w0203` (D47) | `2`, `1` |
| `<boolean>$n</boolean>`, `<boolean>$t</boolean>` | blank, `w0203` (D47, D68) | `false`, silently |
| `<boolean>$b = 1</boolean>` | type mix, `w0203` | `true` |
| `$t > $n`, `$t = $n` | `w0204` / compares | refused |
| `<number convertBoolean>$b</number>` | `1` | refused: nothing reads `convertBoolean` |
| `<text extend="$n"/>`, `<number extend="$t"/>` | allowed (REF-5) | refused |
| `<point extend="$v"/>`, `<math extend="$P"/>`, `<point extend="$m"/>` | allowed (REF-5) | refused |
| `<number extend="$a"/>` of an angle, `<math extend="$l"/>` of a line | allowed (D69) | refused |
| `<mathInput extend="$m"/>` | `e0062`, an input is not its value | allowed |
| `$v[1]`, `$mi[1]`, `$mv[1]` of `⟨8,9⟩`, `$m.value[2]` | an entry (D27) | "cannot be indexed" |
| `$ms[1]` of a scalar | `w0100`, "has no entries" | `cells-not-indexable` |
| diagnostic for `<label extend="$t"/>` | names `<label>` (DIAG-3) | names `<group>` |

## Decision

### 1. A component's type is its tag's, decided at load

Outlining settles each element's **author type** from its tag (and a
parent's declaration, ADR 0055), never from what it holds. Every check
the principles state in types reads the author type: an extend's type
change, a branch interface (COMP-11), a list's entry type, an answer's
type, a diagnostic. How the value is held is the planner's choice, read
only by the build.

A `<math>` whose text is a numeric tuple keeps its entries in cells of
their own, as a point's coordinates are, but it is a `<math>`: its type
is `Math`, it has a math's props, and a reference, a renderer and a
diagnostic see a math. `ComponentType::Tuple`, and a `<math>` settled as
a `<point>`, go away.

### 2. Values with entries are one shape, read alike

A **value with entries** is a point, a vector, coords, a math holding a
tuple or vector, a matrix, and an input holding one (COLL-1's "one
thing"). Each exposes its entries the same way: an `entries` sequence
(ADR 0041) whose length is settled at load where the DoenetML settles
it (a point's two coordinates, a written numeric tuple) and read from the
value where it does not (a symbolic math, a `<mathInput>`), through an
engine instruction that takes entry `k` of an expression, missing past
the end.

From that one shape:

- **An index** `[k]` after any of them is entry `k`, `$x.value[k]` is the
  same, and an index after a scalar is warning `doenet-w0100` ("this
  value has no entries"), the same for every type.
- **Inside math**, a reference to a value with entries is a tuple leaf:
  a tuple of its entries' leaves. So `<math>$P</math>` is `(1, 2)`,
  `$m + (1,1)` adds entrywise in the engine, `$P = (1,2)` compares the
  coordinates, and `<text>$P</text>` shows `(1, 2)`.
- **A type change** between them (§3) maps entries to entries.

### 3. One conversion table (REF-5, D69)

`ComponentType::conversion(from, to)` is the one table, declared by the
types and read by outlining (an extend, a copy), the type pass and the
bridge. Its answers:

| From → to | Conversion |
|---|---|
| same type | none |
| number, math ↔ number, math | the value (today's `extends_as`) |
| number, math, boolean → text | the value shown, as `rendered_text` shows it |
| text → number, math | the text parsed: a number, or `NaN` / a blank that doesn't parse (VAL-3) |
| point, vector, coords ↔ each other | entries to entries |
| math → point, vector, coords | entries 1 and 2; missing with info `doenet-i0053` while the math is not a pair |
| point, vector, coords → math | a math holding the tuple of its entries |
| an input → its value type and what that converts to | the value's conversion (REF-1a, D69 decision 3) |
| angle → math, number, text | its measure (D69 decision 3); an angle from a math, number or text |
| a type with an adapter → the adapter's type | the adapter's prop (`<math extend="$l"/>` is the line's equation), and nothing further (D69) |
| boolean ↔ number, math; text → boolean | **`doenet-e0065`**, suggesting `<number convertBoolean>`, `$n != 0`, `$t = true` (D47, D68) |
| a value type → an input | **`doenet-e0062`**: "write `bindValueTo` to edit it, `prefill` to start from it" |
| a container with a `text` → another tag | **`doenet-e0063`**: "use `$p.text`" |
| any other pair | **`doenet-e0065`** |

A conversion that is run backward where it can be (`<point
extend="$v"/>` drags `v`, `<math extend="$n"/>` writes `n`) and one-way
where it can't (a text shown from a number is not written back).

### 4. A boolean is a port type of its own, so a mix is known at load

`PortType` gains `Bool`. A boolean's value, a comparison, `and`, `or`,
`not` and the tests are `Bool`; a number never becomes one and a `Bool`
never joins a `Num`. The type pass then decides every mix from the
DoenetML (TYPE-1), and each is a blank in its place (ADR 0046's missing
value) with a warning at load:

- a boolean where a number or a math is wanted (in a `<math>`, a
  `<number>`, an operator, a numeric attribute, a comparison with a
  number): **`doenet-w0203`**, suggesting `<number convertBoolean>`;
- a number, a math or a text where a boolean is wanted (a `<boolean>`'s
  or `<when>`'s content, a boolean attribute such as `hide`, a
  `<booleanInput bindValueTo>`), and a literal `1` or `0` written there:
  **`doenet-w0203`**, suggesting the comparison meant (`$n != 0`,
  `$t = true`);
- a text ordered against a number (`<`, `>`, `<=`, `>=`):
  **`doenet-w0204`**, which says it can never hold. `=` and `!=` between
  a text and a number compare the number's text with the text.

`<number convertBoolean>` reads a boolean, or a boolean expression, as
`1` or `0`, and is the one place that does. `credit` on an `<award>` or
`<choice>` is planned as one.

### 5. Diagnostics name what the author wrote

Every type diagnostic uses the principles' code where one exists
(`doenet-e0062`, `e0063`, `e0065`, `e0066`, `i0053`, `w0100`, `w0203`,
`w0204`), names the tags the author wrote, never a representation
(`<tuple>`, a `<label>` as `<group>`), and suggests the form that works
(DIAG-3).

The i18n registry on this branch (`packages/i18n/diagnostic-codes.lock.json`)
ends at `w0169`: these codes were added on Doenet's `main` after it
forked. Until the branch takes them, each situation has a `cells-` code of
its own, one per principle code, so the switch is a rename
(`cells-extend-type-mismatch` → `e0065`, `cells-type-mix` → `w0203`, …).

## Considered options

- **Keep the representation as the type and translate at the edges**
  (report `<point>` as `<math>` in diagnostics, allow point↔math
  extends). Rejected: every rule the principles state in types (REF-5,
  COMP-11, TYPE-2's entry types, D55's answer type) would need the same
  translation, and a `<math>(x,1)</math>` already showed that a type read
  off the text is wrong in a way a translation can't fix.
- **Decide a math's shape as it runs** (a tuple now, a scalar later).
  Rejected for written text, whose shape the DoenetML settles (TYPE-1);
  kept only where the value is a reader's (a `<mathInput>`) or a
  symbolic expression, through the entry instruction, which is a value
  that may be missing, never a change of type.
- **Booleans as `Num` with a flag on the prop.** Rejected: the mix is a
  property of the dataflow (a boolean's value aliased into a number, a
  comparison's result read by `+`), which the type pass already follows
  port to port; a flag on props would miss every path through an alias.

## Consequences

- A document the principles call valid that this core refused now loads
  (REF-5's pairs, `<math>$P</math>`, an index into a vector), and one
  that gave a silent wrong value gives the principles' blank and warning.
- Some documents that loaded now warn (`<math>$b+1</math>`) or are
  refused (`<mathInput extend="$m"/>`), as the principles decide.
- Tests that pin a `<math>` as a `<point>` (`$m.x` of `<math>(1,2)</math>`)
  change: a math holding a tuple has no `x`; `$m[1]` is its entry.
- The bridge sends a math holding a tuple as a math, which the prototype
  renderers already draw.

## Migration

1. **Done** (2026-11-24): no silent wrong value on the way.
   `<number>$t</number>` and `<boolean>$t</boolean>` of a text are refused
   in the type pass (`shows_as_number`) until §3's parse exists; a tuple
   with a free symbol is a math (`settled_type`); a reference in a
   condition's spelled operand is checked by the seal (`SymText::plans`),
   so `<boolean>$P = (1,2)</boolean>` is a located diagnostic, not a
   failed load. Tests in `tests/principles.rs`.
2. **Done** (2026-11-24), without `PortType::Bool`: every mix the tests
   reach is decided while planning, from what outlining settled of each
   reference's referent (`ref_value_kind`, which counts an input that
   reads as a boolean as one), and planned as the missing value with a
   warning where the reference is written (`Arenas::type_mix`,
   `Arenas::mix_ref`, ADR 0046's route for a reference that names
   nothing). `cells-type-mix` (`w0203`): a boolean reference in math text
   (`resolve_tokens`, unless `Arenas::booleans_in_math`, set for a
   condition and a `<number convertBoolean>`); a boolean child of a
   `<number>` (`plan_value_children`); a number, math or text alone in a
   `<boolean>`, and a literal number there (`boolean.rs`); in a condition,
   a lone operand that is not a boolean, a boolean compared with a value
   that is not, and a boolean inside arithmetic (`CondParser`); a text
   alone in a condition. `cells-type-mix-order` (`w0204`): a text ordered
   with `<` or `>`. `<number convertBoolean>` reads booleans as 1 or 0.
   Tests: `tests/principles.rs` (`d47_*`, `d58_*`); `tests/boolean.rs`,
   `tests/cycles.rs`, `tests/rebuild_cycles.rs` and `tests/text_input.rs`
   change to the principles (a literal `1` in a `<boolean>` is a mix; a
   count over a boolean writes `convertBoolean`).
   Left: a mix only the dataflow shows (an element child of an operator,
   `<sum><boolean>true</boolean> 3</sum>`, is still 4; a reference through
   an index or an interface name, which `ref_value_kind` can't type), for
   which §4's `PortType::Bool` in the seal is still the plan; a boolean
   attribute given a number (`hide="$n"`); `convertBoolean` over a
   condition (`$n > 2`); `credit` as a `<number convertBoolean>`; and `=`
   between a text and a number, still refused.
5. Open: an answer's type comes from its input (D55):
   `<answer><textInput/>…</answer>` is refused without `type="text"`.
3. Open: §3's table in `ComponentType::conversion`, replacing
   `extends_as` and `extend_reads`, with the text parse and show
   instructions, and §5's codes.
4. Open: §1 and §2: `<math>` is always `Math`, values with entries, the
   entry instruction, tuple leaves inside math, and indexes.
