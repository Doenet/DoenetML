# Properties, values and attributes

This document covers what `$x.prop` produces, what a reference becomes when it is read for its
value, how attribute values are read and written, and what a reference shows when it has nothing
to read.

Paths: `T/` is `packages/doenetml-worker-javascript/src/test/` and `W/` is
`packages/doenetml-worker-javascript/src/`. Tiers are defined in the [README](README.md).

---

## 1. Properties

### VAL-1: `$x.prop` is a new value, not the component (Tier 1)
`$x` stands for x itself. `$x.prop` is a new component that holds x's `prop`.
- **Its type** is the one the prop declares (`createComponentOfType`). An array prop
  (`$P.xs`) becomes one list.
- **What it takes from x:** x's number formatting.
- **What it does not take:** x's `hide`, label or style.

| Written in a `<p>`, with `t` hidden | Shows |
|---|---|
| `$t` | nothing: it is t, and t is hidden |
| `$t.value` | the value |

Evidence:
- `T/copying/drawn_value_references.test.ts:183` "a reference is shown as its referent is:
  hidden with it, in its style and typesetting";
- `T/graphical/labels.test.ts:1159` "props do not shadow label" (#260): `$line.point1` has no
  label;
- `T/copying/extend_references.test.ts:299-374` `check_copy_props` ("hide attribute is not
  copied").

Exception, principled: the implicit prop of a same-type referent (`$n` for a number) is
treated as the referent itself (`copiesReferent`, `W/utils/valueReference.ts:225`).

Which attributes a property carries is declared per state variable by two separate mechanisms:
- `attributesToShadow`;
- `addAttributeComponentsShadowingStateVariables`, in about 40 component files.

A third mechanism, `propagateToProps`, was used only by `modifyIndirectly`, and was removed with
it in #2339.

The author-visible rule, "a value keeps its number formatting and nothing else", should be the
data-driven default. See D20.

### VAL-2: a property reference is two-way (Tier 1)
A value written to `$x.prop` (typed into an input bound to it, or dragged) is written back to x
through the prop's inverse.
- **[probe]** `<mathInput bindValueTo="$c.diameter"/>` set to 10 sets the radius to 5.
- `<mathInput bindValueTo="$P.x"/>` moves P.

What stops the write:
- x being `fixed`;
- `fixLocation`, for location props;
- an index past the end;
- a formula that cannot be run backward (see [interaction-and-state.md](interaction-and-state.md),
  INT-3).

Evidence:
- `T/copying/value_references.test.ts`:
  - `:75` "follows the referent, and a write through it lands on the referent";
  - `:961`, `:1819`;
  - `:226`, `:1121`, `:1848`, `:509` (each kind of refusal).
- `T/copying/extend_references.test.ts:511`.

---

## 2. References read as values

### VAL-3: a reference where a value is read acts as that value written there (Tier 1)
A reference inside `<math>`, `<number>`, `<text>`, `<boolean>`, an operator or an attribute acts
as the referent's current value written there, converted to the type the parent wants. In a
`<p>` it shows the value.

| Written | Means |
|---|---|
| `<text>$n</text>` | `"5"` |
| `<math>$n</math>` | n as math |
| `<number>$q</number>` of a non-numeric math | `NaN` |
| `<boolean>$P = (1,2)</boolean>` | compares the coordinates |

Evidence:
- `T/copying/value_references.test.ts`: `:149` "stands in as the type its parent accepts",
  `:815`, `:1721`;
- `T/copying/drawn_value_references.test.ts:88`, `:136`.

Code:
- `W/utils/valueReference.ts:97` `planValueReference`;
- `W/utils/dast/valueReferences.ts:81`;
- `W/components/abstract/Copy.js:2646`.

A text read as math is parsed in its own notation when that is known (`isLatex` written, or a
`.latex` property), and otherwise, as proposed in D34, in the reader's: today `<math format="latex">`
does not reach a `<text>` (#2408).

Whether a reference becomes a value reference or a full copy is decided by hard-coded lists:
- only number, math, text and boolean values become value references;
- `<graph>`, inputs, `slider`, `matrixInput` and `fractionInput` keep copies;
- points always copy.

The visible consequences are:
- **`<collect>`** finds `$n` written in a `<p>` but not `$n` written inside a `<math>`
  (`T/copying/value_references.test.ts:987`; #2140 changed this).
- **A reference to an input is its value only when the input is named directly.** `$repeat[1]`
  gives a `mathInput`, while `$repeat[1].mi` gives a math
  (`T/copying/extend_references.test.ts:6172`, `:6209`).

The rule authors should be given is:

> A reference is its value where its parent reads or draws a value, and the referent itself
> where its parent takes components (graph, inputs, collect).

The `<collect>` case does not fit that rule yet (D11).

### VAL-4: number formatting follows a reference that is the whole content, not one used as an operand (Tier 2)
These show the referent's `displayDigits` and related settings, unless they set their own:
- `<number>$n</number>`, `<math>$n</math>` and `<text>$n</text>`;
- `$n` in a `<p>`;
- `<math>$Q.x</math>`.

`$n+1` and `($n,1)` use the enclosing component's settings:
- **[probe]** with `n` at `displayDigits="5"`, `<math>$n</math>` shows `5.1235` and
  `<math>($n,1)</math>` shows `(5.12, 1)`.

Evidence:
- `T/copying/value_references.test.ts`:
  - `:119` "display settings follow a direct reference, not an operand, and yield to the
    parent's own";
  - `:900`, `:2448`.
- `T/tagSpecific/math.test.ts:4637`.
- #563 for lists: `numberlist`, `mathlist`, `pointlist`, `vectorlist`, `intervallist`.

Code: `W/utils/numberDisplay.js:250`, the "a sole child passes its formatting up" rule.

Whether formatting should pass through arithmetic was left open in #2127 (D19).

### VAL-5: a reference with nothing to read is missing, never a value (Tier 2; the exact display is Tier 3)
A reference can name nothing: an index past the end, `$P.z` on a 2D point, or `selectedIndex`
before a choice is made. Such a reference is *missing*. These rules are worth keeping as
guarantees:
- **(Tier 1, answers depend on it)** A missing value never equals another missing value or a
  blank input. Two missing values give no credit.
- **(Tier 2)** Math and boolean operators leave it out of their operands.
- **(Tier 2)** It behaves the same in a repeat and a group as at the document level.

Evidence: `T/copying/value_references.test.ts`, the "references with nothing to read" describe:
- `:2133`, `:2275`, `:2358`, `:2513`, `:2556`, `:2671`;
- and the responses section at `:2764`.

What it *looks like* depends on the parent and on the spelling (**[probe]**):

| Where | Shows |
|---|---|
| `<p>[$l[5]]</p>` | `[]` |
| `<p>[<number extend="$l[5]"/>]</p>` | `[NaN]` |
| `<math>` | `＿` |
| `<number>` | `NaN` |
| `<text>` | `""` |
| `<p>[$P.xs[3]]</p>` | `[]` |
| `<p>[$pl.xs[3]]</p>` | `[＿, ＿]` |
| `<sum>$l[5] 3</sum>` | `3` |

How a missing reference is reported follows NAME-2 since #2410 (B17): `$n.value[1]` now shows
nothing, where it showed `5`. A list component's entries still differ: `$pl[2].coords[1]` shows
the whole coordinates (B18, #2413). A property with no value, such as `$c.maxNumber` with no
limit, shows `NaN` (#2416, D10).

That table is an accident of which internal form was built. A rewrite should choose one
representation: "the empty value of the type it presents as, drawn as nothing". See D10.
Tests that lock the current table:
- `drawn_value_references.test.ts:234`;
- `extend_references.test.ts:4790-4830`, `:7507-7616`;
- `expressionAttributes.test.ts:400`.

### VAL-10: `hide` and `fixed` do not pass through value positions (Tier 2)
These are hidden with their referent:
- `$t` in a `<p>`;
- `<number extend="$n"/>`;
- named extends.

Every value position ignores `hide`. This covers a reference used *inside* `<math>`, `<text>`
or an operator, and a hidden child written there directly: hiding part of an expression is
meaningless. Only drawn content, such as a `<p>`, leaves hidden items out. A `fixed` parent does not fix the referent it reads. The
statement to give is: "`hide` applies to what is drawn; a value inside an expression is not
drawn on its own".

Evidence:
- `T/copying/value_references.test.ts:268` "a hidden referent does not hide the reference", and
  `:226`;
- **[probe]**, with `n` a hidden number 5:

  | Written | Shows |
  |---|---|
  | `<text>[$n]</text>` | `[5]` |
  | `<math>$n+1</math>` | `5 + 1` |
  | `<math><number hide>5</number>+1</math>` | `5 + 1` |
  | `<math><group><number hide>5</number><number>2</number></group></math>` | `5 * 2` |
  | `<sum><number hide>5</number><number>2</number></sum>` | `7` |
  | `<text><text hide>a</text>b</text>` | `ab` |
  | `<p><text hide>a</text>b</p>` | `b`: drawn content leaves the hidden item out |

- For a list with a hidden entry, `<math>$l</math>` and `<text>$l</text>` include it (D29).

---

## 3. Attribute values

An attribute's value is written in one of three forms. Each form has a different rule, and
authors can learn all three.

### VAL-6: plain text is parsed as the attribute's type (Tier 1); a reader's write over it is kept (Tier 2)
| Written | Value |
|---|---|
| `displayDigits="2+2"` | 4 |
| `displayDigits=" 4 "` | 4 |
| `displayDigits="4.6"` | 5 |
| `displayDigits="bad"` | NaN, so no rounding |
| `simplify` with no value | `full` |
| an invalid enum value | the default |
| `hide="TRUE"` | hidden |

A value the reader writes over a literal is kept, and restored on reload. Examples are
toggling `hide` and dragging an `anchor`.

Evidence:
- `T/copying/attribute_values.test.ts`: `:324` "a literal attribute is read as its type", `:372`,
  `:434`, `:627`, `:855`;
- `T/utils/attributes.test.ts`.

Code: `W/utils/literalAttribute.ts:343`, `:449` (#2224).

### VAL-7: an attribute that is exactly one reference *is* that reference, in both directions (Tier 1 to read, Tier 2 to write)
`hide="$b"` is b's value. A write to the attribute, for example toggling `$p.hide` from a bound
input, is written to `b` (**[probe]**).

Evidence:
- `T/copying/attribute_values.test.ts:926` "an attribute that is one reference follows its
  referent and writes to it";
- `:1013` (where diagnostics point).

Code: `W/utils/literalAttribute.ts:533` (#2226).

Gap: writes are tested only for `hide` and `xMin`.

### VAL-8: an attribute written as an expression is recomputed from its references (Tier 1 to read, Tier 2 to write)
Examples: `hide="$a > 2"`, `condition="$x = 3"`, `<point>($a, 2$a)</point>`.

- **A math expression takes a write by the same rule as a `<math>`** (INT-3): when it is
  linear in exactly one changeable reference, the write lands on that reference.
  - **[probe]** With `a` = 3, each of these takes a write from a `<mathInput>` bound to the
    attribute, and changes `a`:
    - `<graph xMin="$a+1"/>`: −10 sets `a` = −11;
    - `<circle radius="2$a"/>`: 10 sets `a` = 5;
    - `<point x="2$a+1"/>`: 11 sets `a` = 5.
  - Dragging a point whose coordinates are an expression writes back through its references,
    and through any constant text: in `($i, 0)`, the `0` becomes the new y.
  - A write fails only where the component has no way to take it. A curve's `parMin` and
    `parMax`, and a line's `slope`, have no inverse at all. Dragging a line written as
    `equation="y=2x+$b"` does not change `b`. That holds whether or not the equation is held as
    an expression slot, so it is a limitation of the line, not of math expressions.
- **A boolean expression takes no write.** `hide="$b or false"` under a bound input silently
  does nothing (**[probe]**). It follows the same rule as a `<boolean>`, which takes a write
  only when it has no children, a single text child, or a single boolean child such as `$b`
  (`W/components/Boolean.js`, the `value` inverse). Anything else refuses the write: several
  children, `not $b`, `$b or false`, or a comparison. D15 proposes stating this as the rule. The
  silence should be reported (D15).

Evidence: `T/tagSpecific/expressionAttributes.test.ts`, `:126`, `:143`, `:424`, `:455`, `:490`,
`:515`.

Tier 3: the file loads every document twice, as expression attributes and as attribute
components, and asserts which components "hold" expressions. That only proves two internal
representations agree.
- Keep the expected texts and drag results.
- Drop the both-ways harness and the `held`/`numHeld` lists.
- Drop the direct unit tests at `:608-669`.

The eligibility list `EXPRESSION_ATTRIBUTES` (`W/utils/dast/expressionAttributes.ts:49`) was
chosen by fixture measurements, and is not a principle.

### VAL-11: a write lands on whoever supplied the value (Tier 2)
- A write to a reference's attribute lands on the source when the reference inherited the
  attribute.
- It lands on the reference when the reference wrote the attribute itself.

Examples:
- `T/copying/context_attributes.test.ts:268`: a write to `$r.fixed` reaches `m`.
- `T/copying/attribute_values.test.ts:887`: a write to `$B.fixLocation`, where B has its own
  `fixLocation="false"`, stays on B.

This is principled, but hard to explain. The `fixed` case is a problem (D7).

---

## 4. List entries

### VAL-9: a list entry stands for the component it came from (Tier 1 for value and label, Tier 2 for targets)
`$pl[2]` is an entry of a `<pointList>`, `<collect>`, `<sort>` or `<shuffle>`. It stands for the
point it came from:
- it has that point's label, `fixed`, `draggable`, display settings and `hide`;
- it can be the target of a trigger, a legend label, a `<ref>` or a `<callAction>`;
- clicking it also counts as clicking the list.

A *prop* point such as `$line.point1` has no label. That is consistent with VAL-1: an entry was
a component, while a prop is a value.

Evidence:
- `T/tagSpecific/listentrytargets.test.ts:97`, `:176`, `:222`, `:275`, `:527`, `:572`, `:589`;
- `listcomponentpointlists.test.ts` and `listcomponentcollections.test.ts` (#2187, #2193, #2195);
- **[probe]** `<point extend="$pl[1]">` and `<point copy="$pl[1]">` both carry the authored label.

`hide` holds for every list since #2368 (D29):
- a hidden entry is not drawn, and `$l[k].hide` is true;
- `$l[k]` and `$l` placed elsewhere keep it hidden;
- it still counts for indices and values.

`styleNumber` does not hold yet. Collect and sort let the list's override each source's, and
authored lists and `<pointList>` ignore a child's (#2374).

Follow-up, not part of D29: a write through `$l[k].hide` does nothing in any family today
(`<booleanInput bindValueTo="$l[k].hide"/>`), while `$n.hide` is writable (**[probe]**). An entry
stands for its source, so the write should go to the source's `hide`, as a write to its value
does.

Known rough edges:
- an action naming both a child and its entry (`$A $pl[1]`) fires twice;
- lists that are not authored (`<sequence>`, samplers, operators) take no entry click actions
  (#2203, "Not covered").

---

## 5. Tests that pin incidental behavior (Tier 3)

- **Census and structure assertions.**
  - `T/copying/value_references.test.ts` has 46 census and 39 `valueRefs(core)` assertions, plus
    `referentInfo` and `presentedComponentType` checks (`:38`, `:1289`, `:1549`, `:2036`, `:2784`,
    `:2846`, `:3416`).
  - `T/copying/attribute_values.test.ts:926` (`componentType === "_ref"`, `isDrawn`), `:1107`
    "what each attribute construct creates", and `:608`.
  - These files are already `describe.skipIf(rust)`. Keep the value assertions and drop the
    structure.
- **`T/tagSpecific/expressionAttributes.test.ts`:** the both-ways harness and the `held` lists
  (VAL-8).
- **`T/utils/valueFunctions.test.ts`:** unit tests of internal functions. Their semantics are
  covered by VAL-2 and INT-3.
- **Exact diagnostic texts.** `value_references.test.ts:1379` (`Could not find prop xs[$i] …`), and
  `circularReferences.test.ts` asserting that a message names no `<_copy>`.
- **`value_references.test.ts:2723`, `:3061`:** a function's global extremum treated as missing.
  This is an artifact of how `Function.js` stores empty arrays.
- **`value_references.test.ts:1724-1760`:** the exact `byType` counts of a point.
- **`compositeCommas.test.tsx:403`:** where implicit multiplication lands around a list in
  math.

## 6. Coverage gaps

- **Deep prop chains:** about 20 assertions are commented out
  (`extend_references.test.ts:4703`). Decide whether they are supported (D19).
- **Display settings:** carried by about 40 hand declarations, but tested only for point,
  polygon vertex, mathInput, number, list entries and `$P.xs`. A grid like
  `context_attributes.test.ts` would make the coverage uniform.
- **Drawn versus not drawn:** tested for `<p>`, `<label>`, `<cell>`, section and document only,
  not `<li>`, `<title>`, `<caption>` or `<em>`.
- **Writes through attributes:** only `hide` and `xMin` are tested.
- **Chains of references:** only two levels are tested (`value_references.test.ts:1162`,
  `attribute_values.test.ts:72`).
