# A sequence of letters or math, and a literal list, are counted when compiled

Status: proposed 2026-11-24. Builds on ADR 0037 (a load-time draw reads
constants), ADR 0041 (every list is a sequence; steps 1, 3 and 4), ADR
0053 (text in the tick; an element decides its entries' kind), ADR 0059
(a copy shares its referent's draw) and ADR 0063 (a list settled late,
once names resolve).

## Context

Four constructs the user approved (2026-11-24) were refused:

- `<select type="number">1 5 7</select>` (15 tests): `type` was refused
  as an attribute nothing reads.
- `<sequence type="letters|math">`, and so `<selectFromSequence>` of
  letters or math (14 tests): "only numbers".
- `<repeat for="1 2 3">` and `for="x y"` (14 tests): "`<repeat>` needs
  `for="$name"`".
- `<pointList extend="$l.points[$n]"/>` (4 tests; ADR 0073's open
  question, option (c)): an entry of a list is no list.

The current core counts a sequence of letters as numbers (`a` 1, `z` 26,
`aa` 27: `lettersToNumber`, `numberToLetters`), lower case unless `from`
(else `to`) is all upper case, and a math sequence symbolically
(`from + k step`, expanded and simplified), its count, when `length`
does not give it, the run evaluated to a number (`calculateSequenceParameters`).
The parser's normalizer already makes `<select type>`'s pieces options
holding an element of the type (`selectSugar`) and a `<repeat>`'s literal
`for` pieces elements of its type (`repeatSugar`), math by default.

## Decision

1. **A select reads `type`, which its options already say.** The
   normalized DAST of `<select type="number">1 5 7</select>` is a select
   of three `<option>`s, each holding a `<number>`: the choice machinery
   picks among them as it does for written options, and the select reads
   `type` (outlining, `add_choice`) so it is not refused. *Departure from
   the user's approach:* the user chose a load-time draw over a constant
   list of the given entries, like a sampler; that approach was premised
   on a select with no options, which the parser never hands the core,
   so no new draw was needed: the picks are the options', drawn as every
   select's are (ADR 0037), shared by copies (ADR 0059), `numToSelect`
   and `withReplacement` as before.

2. **A sequence's entries follow its `type`** (the user's approach, ADR
   0053's per-element entry kind). `<sequence>` and `<selectFromSequence>`
   declare entries of a number and, as `ComponentType::entries_by_type`
   says, an element of another `type` decides its own: strings for
   letters, expressions for math (`ElemWiring::with_entries`,
   `ListLen::Entries`, read through `ListShape`); `ref_value_kind` reads
   the referent's `type` for what an entry of it is. A `type` the
   attribute does not allow is numbers, as the current core falls back.

3. **Letters are numbers whose entry is their letters, interned when
   compiled** (decision 7 of the brief kept: no tick makes a string). A
   sequence of letters is counted as numbers from its literal parameters
   (`LetterRun`, `components/values/typed_sequence.rs`), as the current
   core counts them (the whole step `from`, `to` and `length` give, the
   run shortened to stay above `a`). Each entry is `SymKind::Letters` of
   its number and case, and the planner interns the letters of every
   number the entry can be, so the operator, a lookup by text, finds the
   id the compile made and adds no string. An exclude that is a reference
   to a text is read as its letters' number in the tick
   (`SymKind::LetterNumber`, which reads the strings and makes none).

4. **Math values are computed when compiled.** A math sequence's values
   are computed once by the symbolic engine at plan time from its
   parameters as written (`math_values`): `from`, the step (`(to -
   from)/(length - 1)` when it is not given), `from + k step` expanded
   and simplified, the count evaluated as the current core evaluates it
   (no simplification: `x` to `x` counts nothing), an exclude equal by
   the engine's equality left out. Each entry is the given expression,
   `Shown` so no request passes (a sequence is fixed).

5. **Layout.** A sequence of letters or math whose parameters are text
   with no reference is static (its count a fact of the source, ADR 0041
   decision 2), whatever the text (`from="3x"`, `to="(0.1+0.7)*10"`); a
   number sequence keeps its rule (literal numbers). A sequence of
   letters whose excludes follow a value is structural
   (`StructuralLetterSequence`, a variant of the structural sequence
   whose item is a `<text>`): the numbers counted as a structural
   sequence's are, each item the letters of its number. Its `from`, `to`,
   `step` and `length` must be literal: letters that follow a value could
   be any string, which a tick would have to make.

6. **A select from letters draws numbers; one from math draws places**
   (ADR 0037). `<selectFromSequence type="letters">` draws from the run's
   numbers, less its excludes, as one of numbers does (`VecOp::Draws`,
   `Dist::Sequence`: `numToSelect`, `withReplacement`, `sort` by number,
   as the current core sorts letters), each entry the letters of its
   draw. `type="math"` draws places 1 to the count of its values, each
   entry a `Choose` of the value at its place (a choose of groups past 63
   values); math is never sorted, as the current core leaves it. Both
   share the copy's draw (ADR 0059). The check holds the draw possible.

7. **A literal `for` is an anonymous static list** (the user's
   approach). `<repeat for="1 2 3">`: one iteration per piece, its count a
   constant; each piece a hidden port of the repeat planned where the
   repeat sits (a number, a math cell, a text interned, a boolean; a
   reference to a static sequence spliced, as a list's children are, ADR
   0041 decision 9; a reference among math pieces a math cell, so the
   pieces hold one kind); math pieces that are all plain numbers stay
   numbers (ADR 0043). The
   item `valueName` names is a value of the type (outlining settles it,
   `settle_repeat_items`): a `Choose` of the pieces by the iteration's
   position, each piece aliased into the item, so a text is read only as
   its own port.

8. **A point list of an entry is a count of 0 or 1** (the user's
   approach, ADR 0041 step 4). `<pointList extend="$l.points[$n]"/>`,
   the index no literal, is settled once names resolve (as ADR 0063
   settles a list over a math value, `ComponentType::over_entry`) as a
   repeat-like list, `PointListEntry`: its count, a structural cell, is 1
   while the index names an entry (the entry's first coordinate is a
   number) and 0 otherwise, so the document is rebuilt as the index moves
   in or out of range; its one item is the point, its coordinates the
   entry's, which a drag writes back. `$Ps[1]` exists only for a valid
   index, as in the current core.

## Not done

- A math sequence whose count follows a value (`exclude="$e"`): its
  count needs the engine's equality per value in the tick; refused.
- Letters whose `from`, `to`, `step` or `length` follow a value; refused.
- `excludeCombinations` and `coprime`, `validSequence`, the current
  core's infos for an invalid parameter (`sequence.test.ts` "warnings"),
  and a sequence of letters reaching below `a` (refused, where the
  current core shows other characters).
- `<mathList extend="$pl.vertex2[$n]"/>`, a math list of one entry, and
  a literal index (`$pg.vertices[3]`), which names a point prop.
- A `<repeat for>` of more than 63 pieces, and a group among them (a
  group is not a sequence a list splices).

## Consequences

Parity on the cells core, before → after: `select.test.ts` 13 → 20,
`selectfromsequence.test.ts` 17 → 21, `sequence.test.ts` 26 → 37,
`conditionalContentSelectInterfaceNames.test.ts` 9 → 11, `line.test.ts`
27 → 28, none lost. `repeat.test.ts` stays 1: its four literal-`for`
tests now build and fail on other gaps (a copy of a repeat, a `<module>`,
an extend of an index of another type, a group among the pieces).

Tests: `sequence.spec.rs`, `select_from_sequence.spec.rs`,
`structural_sequence.spec.rs`, `point_list_entry.spec.rs`,
`typed_sequence.rs`'s unit tests, `tests/typed_sequences.rs`,
`tests/repeat_literal.rs` and the bridge tests.
