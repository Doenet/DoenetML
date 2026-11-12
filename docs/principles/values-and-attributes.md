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

### VAL-5: a reference to one thing that isn't there is missing, and shows as a blank (Tier 1; D37)
A reference can name nothing: no referent, an index past the end, `$P.z` on a 2D point, or
`selectedIndex` before a choice is made. Such a reference is *missing*. Any component can be
missing, and a tag whose source is missing is missing too (REF-0).
- **(Tier 1)** A reference to one thing (a name, an index, a property, an iteration or a pick)
  gives that thing, or a missing value. A reference to a collection (a list, a repeat, a collect,
  a group, a `<conditionalContent>` with no case active) gives its members, possibly none. That
  is the only way a reference shows nothing.
- **(Tier 1)** Missing shows as `＿` inline, and is not drawn in a graph: a missing point can't
  be dragged. `$ans.submittedResponse` is `＿` until a submission.
- **(Tier 1, answers depend on it)** A missing value never equals anything: another missing
  value, a blank input, or a value. Two missing values give no credit.
- **(Tier 2)** In an operator a missing operand is a blank, as `<math>$a + 1</math>` gives
  `＿ + 1`. `<sum>$l[5] 3</sum>` is missing. A missing number shows `＿`, and `NaN` is kept for a
  computation that has no value.
- **(Tier 2)** `hide` still hides it: a hidden referent stays hidden (VAL-10), and
  `<math extend="$nothing" hide/>` shows nothing.
- **(Tier 2)** It behaves the same in a repeat and a group as at the document level.
- **(Tier 2)** A reference to a component in error is missing too: `$m` of an `m` shown as an
  error is `＿`, with no diagnostic of its own (DIAG-5, #2449).

Evidence: `T/copying/value_references.test.ts`, the "references with nothing to read" describe:
- `:2133`, `:2275`, `:2358`, `:2513`, `:2556`, `:2671`;
- and the responses section at `:2764`.

**Done by #2458** (closing #2456). How the rules land:
- **Operators:** `<sum>$l[5] 3</sum>` and `<sum>$nothing 3</sum>` are `＿ + 3`; a numeric operator
  becomes symbolic. `<count>` counts a missing operand. A boolean operator took it as not true;
  under the type rule below (decided November 2026), an operator whose result is a number or a
  boolean is missing instead.
- **`<text>` and `<label>`** read a missing child as `＿`: `<text>x $tl[5] y</text>` is `x ＿ y`.
  A `<text>` reads its children's values and ignores their `hide`, so a hidden missing child is a
  blank in it too. A `<label>` honours its children's `hide`, as a `<p>` does.
- **Answers:** a missing component, or a reference to one, is recorded as one blank math and
  counted as one response, wherever it is.
- **Collections:** `$r`, `$r.y`, a list, and an array property (`$ci.selectedValues`,
  `$f.minima`) give their members, possibly none. A bare `$g` shows what the group holds, but a
  property after a group of several names nothing (COLL-3, D41).

**Known violations and open questions:**
- **A component whose content holds a missing child is missing (decided, D40; #2461).** A
  component whose value is made from its children (`<number>`, `<integer>`, `<boolean>`,
  `<function>`, the shapes, an award's condition) is missing when a child it reads is missing:
  `<number>$nothing</number>` is `＿`, not `NaN`, and an award whose condition is missing gives
  no credit. Two exceptions: in a `<math>` and a `<text>` the blank takes part
  (`<math>$a + 1</math>` is `＿ + 1`, `<text>x $nothing y</text>` is `x ＿ y`), and a container
  shows the blank inline. In a list a missing entry is a blank entry:
  `<mathList>$l[5] 2</mathList>` is `＿, 2`.

  **Done by #2514** for components that aren't lists. `<number>`, `<integer>`, `<boolean>` (and
  `<when>`, `<matchesPattern>`, `<hasSameFactoring>`), `<function>` and the shapes set
  `missingWhenContentMissing` (`BaseComponent`; `contentMissing` and `valueMissing` in
  `W/utils/missing.ts`). Such a component is missing when it has a missing child and nothing else
  but blank text, labels and descriptions. `<math>` gets `contentMissing` only, so a `<number>`
  or `<function>` of such a math is missing. Operators and `<piecewiseFunction>` opt out, and an
  expression is unchanged: `<number>$nothing + 1</number>` is still `NaN` (#2460).
  - It can be missing for a while: `<number>$l[$i]</number>` comes back once `i` names an entry,
    and the renderer switches to the blank and back (`canBecomeMissing`, `drawnMissing`).
  - What is made from it follows it (D37): a tag of another type around it, a property tag of it
    (`<number extend="$n.value"/>`), and its adapter. An unlinked `copy` made while it is missing
    is missing for good, and a reload keeps that (`madeFrom.madeMissing`).

  **Done by #2524 for lists** (closing the list part of #2461): in an authored list, a child
  reference that names nothing, one past the end of a list, or `$nothing` is a blank entry
  (`entriesMissing` in `AuthoredValueList`), and so is a child that is itself missing.
  - A reference to a blank entry is missing (`<number>$a[1]</number>`, `$a = $a`), also through a
    run-time path (`$r[1].a[1]`); a tag of one is missing while it is; an unlinked copy made
    while it is blank is missing for good, also after a reload, and one made before keeps the
    value it was made with.
  - A blank point or vector is missing, drawn as a blank, not `(0, 0)`. It takes no write and no
    action.
  - A shape made from a missing point is missing (`missingWhenEntriesMissing`: a polyline's,
    polygon's and their kin's `vertices`, a curve's and circle's `through`, a line's `through`,
    a line segment's `endpoints`, an angle's `through`), and so are a `<function>` through one
    and a `<bestFitLine>` fit to one (before, the blank was skipped).
  - A property a list computes from each entry (`$pl.y`, `$pl.xs`) is `＿` for a blank entry.
  - A list tag over an index that names nothing holds one blank entry, even where a valid index
    would name a row (`<vectorList extend="$c.controlVectors[$m]"/>`), except with
    `removeEmptyArrayEntries`.
  - A `<collect>`, `<sort>` or `<shuffle>` of a list keeps its blank entries.

  **Known violations:**
  - an entry of `_repeatValueList` isn't made missing; a `<number>$l[$i]</number>` repeat stays a
    composite, which shows `＿`, so authors see the same;
  - list operators count a blank entry: for `<numberList>1 $nothing 3</numberList>`, `<sum>` and
    `<mean>` give `NaN`, `<count>` gives `3`, and a math `<sum>` gives `1 + ＿ + 3` (#2460);
  - a numeric function at a blank is `1 + ＿`, not missing (`<evaluate input="$nothing"/>`,
    `$$f($nothing)`, `input="$ans.submittedResponse"` before a submission), and `$$f(2)` of a
    missing `<function>` is a number (#2460);
  - `$ml.matrixSize` of a blank entry is `1, 1`, and `$nl.text` shows a blank entry as `NaN`
    (#2460);
  - a `<sort>` drops a child reference that names nothing (`<sort>$l[5] 3 1</sort>` is `1, 3`), and
    `<ray through="(1,2) $nothing"/>` isn't missing (#2525);
  - a tag of a reference past the end isn't missing: `<point>$pl[$i]</point>` is `(＿, 0)` (#2525);
  - `<mathInput>$nothing</mathInput>` and `<isNumber>` are unchanged;
  - a `<math>` whose child is missing for a while can still be `NaN`: with `n` =
    `<number>$l[$i]</number>` while `i` names nothing, `<math><math extend="$n"/></math>` and
    `<math><number>$nothing</number></math>` are `NaN`, though `<math>$n</math>` is `＿`. The
    child's `valueMissing` is true but its `value` isn't the blank (#2516);
  - `valueMissing`'s `markStale` fires on every change of the content it reads, so a parent
    re-checks its rendered children on each keystroke. Nothing is re-sent and no cost was
    measured (#2516).
- **`null` is never shown, and a `NaN` from a missing input is missing (decided, D40; #2460).**
  `null` or `undefined` never reaches what an author sees. Where `null` means "no value", the
  value is missing (`＿`); #2483's opt-in for `maxNumber` becomes the rule for every such
  attribute. A `NaN` caused by a missing or blank input is missing too: `<median>` of a blank and
  `<clampNumber>` of nothing are `＿`. Only a computation on present inputs that has no value
  stays `NaN`.

  **The type of the result decides, so a function is not a separate case.** A blank takes part
  in a math, which can hold it, and makes missing a number, which can't:
  - `<math>$nothing + 1</math>` is `＿ + 1`, and so is a symbolic function evaluated at a blank
    (`f(＿)`, `1 + ＿` for `f` = `1+u`);
  - `<number>$nothing + 1</number>` is `＿`, and so is a numeric function evaluated at a blank,
    whether by `<evaluate>`, `$$f($nothing)` or an input not yet submitted;
  - the same holds for a list operator over a blank entry: a math `<sum>` gives `1 + ＿ + 3`, a
    number `<sum>` or `<mean>` gives `＿`;
  - **a boolean can't hold a blank either,** so a boolean computed from a missing operand is
    missing: `not ＿`, `＿ and true`, `＿ or false`, and a boolean function at a blank, all
    `＿`, whatever the other operand. This replaces the earlier rule that a boolean operator takes
    a missing operand as not true. A comparison is not a computation on the value: `＿ = 1` is
    false, because a blank never equals anything (D37). A missing condition gives no credit
    (D40).

  **Known violation** (#2460): each number case gives `NaN`, a numeric function at a blank gives
  `1 + ＿`, and a boolean operator takes a missing operand as not true (`not ＿` is true).
- **`<angle/>` with no measure is blank (decided, D40; #2324).** An angle whose measure nothing
  gives or determines (bare, one or two `through` points, one line) has a blank measure and draws
  nothing, not a right angle. 0.7 documents are not converted. **Known violation:** today it is
  π/2.
- a bare reference to a name in a branch that isn't active is a blank whatever it names, so
  `<indexOf target="$cc.shown">` of a `<numberList>` in that case has one blank target.
- a bare text child of `<considerAsResponses>` beside a component throws (as before #2458).

Before #2458, what it looked like depended on the parent and on the spelling (**[probe]**):

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

How a missing reference is reported follows NAME-2 since #2410, #2431 and #2432:
`$n.value[1]`, `$ms[1]` and `$pl[2].coords[1]` name nothing; since #2458 they are missing and
show `＿`. An index into a scalar entry of a
list still gives `＿` (B34, #2438). A property with no value, such as `$c.maxNumber` with no
limit, is missing (`＿`) since #2483 (closing #2416), through an opt-in `nullIsMissing` that only
`maxNumber` uses; other attributes whose `null` means unset wait on #2460. **Fixed by #2514
(closing #2487):** a tag of a property entry with no value is missing while it has none
(`<number extend="$P.z"/>` of a point in the plane, `$f.minimumValue1`, `$ci.selectedValue`
before a choice, `$ans.submittedResponse` before a submission, a spreadsheet cell it doesn't
have). A reference naming one thing that makes nothing is `＿` in a `<text>`, `<math>` or
`<boolean>` (`<text>$c.maxNumber</text>`, `$r[3]`), as is a property no member of a collection
has (`$terms.maths`, `$cc.notThere`), in a `<p>` too. A whole array (`$f.minima`) is still a
list, possibly empty.

**A property the source doesn't have** is a mistake in what the author wrote, so it is warning
`doenet-w0104` (DIAG-2), bare or on a tag, and the reference is missing (D37). Since #2447 it is
an error on a tag, which D37 reversed (#2458). Examples: `$n.nonexistent`,
`$$f.x(2)`, and `$cc.notThere`. It is decided in this order:
1. **A name first.** `.notThere` is a property only if no component of the document has that
   name (#2447's `pathStartsWithProperty`).
2. **Then the type's properties, not the value.** It is a mistake only if the referent's type has
   no property of that name (`__prop_name_not_found` in `W/components/abstract/Copy.js`). A
   property the type has, but with no value now, stays missing with no warning: `$P.z` of a 2D
   point, `$c.maxNumber` with no limit (above).
3. **For a collection, everything its items can be** (COLL-2; a wrapper of several takes no
   property, COLL-3). `$cc.value` is fine when every case holds one math.
   **It warns, decided at load, if any component the composite can hold lacks the property**,
   and each component that lacks it contributes a blank `＿` (decided, D40; #2452). A property
   none has is `w0104`, as before. **Known violation:** #2451 decides from what the composite
   holds now, and warns only when none has the property; a component that lacks it is skipped.

Decided with D22 (#2434 item 1). **Done by #2451** (closing #2450), including after names
(`$x.nonexistent`) and after an index (`$s[1].nonexistent`, `$r[1].nonexistent`). On a tag it
is, since #2458 (D37), the same warning as the bare form, and the tag is missing.

For example, nothing is named `x`, so `$cc1.x` of a case holding a math, a text and a number
warns (the text and number have no `x`) and shows the math's `x` beside two blanks.

Before #2458 that table held, a bare reference to one thing that isn't there showed nothing
(`a $l[5] b` was `a  b`), and `<sum>` left a missing operand out.

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

### VAL-12: a list written as text is split by one rule: commas if there is one, spaces otherwise (Tier 1; #2494)
Every list written as text (a value list, an attribute created as one such as `vertices` or
`exclude`, `<select>` options, `<repeat for>`, the operands of a math or boolean operator, a
grid, variant names) is split the same way:
- **the separator:** if the written text has a comma outside brackets, commas separate the
  entries and the spaces around each are trimmed. Otherwise spaces separate them, a run of
  spaces counting as one. `<mathList>x + 1, y</mathList>` is two entries,
  `<mathList>x y z</mathList>` three, and `<mathList>x y, z</mathList>` is `x y` (a product) and
  `z`;
- **brackets** `( [ {` and `) ] }` keep their contents together, any closer closing any opener:
  `(1, 2], [3, 4)` is two intervals. If they don't balance, they are ignored for the whole list,
  with **`doenet-i0058`**: a warning, since #2495, except in a list of texts (`type="text"`, a
  `<textList>`), where it is an info because such text is valid and often meant
  (`a) apple, b) banana`; DIAG-1, DIAG-2);
- **empty entries:** with commas, every comma separates two entries, so `a,,b` has a blank (`＿`)
  in the middle. Spaces never make one;
- **only written text counts.** A comma in a reference's or component's value never chooses
  commas, and in an operator each reference is an operand of its own (`<sum>$a$b$c</sum>` adds
  three).

**Kept as is (D40; #2168):** whether a space separates a reference from text beside it changes
the entries (`2$a` is one entry, `2 $a` two). The editor hints at it: `doenet-i0059`, a Hint in
the language server for an entry of a space-separated list tag where a reference meets text or
another reference outside brackets (#2522). It isn't given for `<sort>` or a `for` attribute,
which join the same way.

**The one exception:** `removeStrings` on a `<mathInput>` keeps spaces only, since a comma is
its common entry (thousands separators).

The rule is `splitListItems` in `packages/parser/src/list-separation.ts`, shared by the parser
and the worker. A list records how it split its text (`_listSplitting`), so it splits it again
the same way. Evidence: `T/tagSpecific/listSeparation.test.ts`,
`packages/parser/test/list-separation.test.ts`.

Before #2494, lists split on spaces outside parentheses only, so text with a comma usually gave
something broken (`(a, ＿)`, `NaN`).

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

`hide` holds for every list since #2368. VAL-9a gives the full rule.

`styleNumber` holds since #2426 (closing #2374): an entry has its source's own style, and the
list's fills in where the source sets none.

Follow-up, not part of D29: a write through `$l[k].hide` does nothing in any family today
(`<booleanInput bindValueTo="$l[k].hide"/>`), while `$n.hide` is writable (**[probe]**). An entry
stands for its source, so the write should go to the source's `hide`, as a write to its value
does.

Known rough edges:
- an action naming both a child and its entry (`$A $pl[1]`) fires twice;
- lists that are not authored (`<sequence>`, samplers, operators) take no entry click actions
  (#2203, "Not covered").

### VAL-9a: a hidden entry is not drawn but still counts; a list's own attributes act as a container's (Tier 1 for what is drawn, Tier 2 for `.hide`/`.hidden`)
The rules, for every list (D29, done by #2367, #2368, #2388, #2391):
1. **An entry carries its source's own `hide`.** `$l[k].hide` is the source's attribute, and false
   for a generated entry, such as a sequence's. A list's own `hide` never becomes its entries'
   `hide`, including for `<collect hide>`.
2. **`$l[k].hidden`** is true when the entry's `hide` is true, or when anything holding it is
   hidden: the list, or a hidden list or group between the entry and the list.
3. **A hidden entry is not drawn,** so it is not in the displayed text of what holds it, such as
   a `<p>`. It still counts for indices (`$l[k]` keeps its meaning), and wherever the list is read
   as a value: `<math>$l</math>` and `<text>$l</text>` include it (VAL-10).
4. **A reference follows the entry's own `hide`, not `.hidden`.**
   - `$l[k]` placed elsewhere is hidden when its source has a `hide` of its own, unless the
     reference sets `hide` itself.
   - It is shown when only something holding it is hidden: the list, or a hidden inner list or
     group between the entry and the list (#2390). This is how `$n` of a number inside a hidden
     section is shown (CTX-8).
   - `$l` placed elsewhere keeps an entry hidden when that entry's source is hidden. Whether `$l`
     of a hidden list is hidden is D9.
5. **Properties are values and include hidden entries.** `$l.text`, `$l.maths`, the number of
   entries and indices all include them, and `$l.text[k]` is `$l[k].text`. A property has no
   `hide` (VAL-1).
6. **A copy hides the same entries as its source** (CPY-1).
7. **A list's own attributes act on its entries as a container's do** (CTX-5). They fill in what an
   entry's source does not set, and never override or clear it.
   - `hide="false"` on a list does not reveal entries whose sources are hidden.
   - The entry's own `styleNumber` and display settings win, and the list's apply where the
     source sets none.
   - To override many entries, write an extend of each: D31.
8. **A parent that ignores its own hiding counts a child exactly when the child would be drawn if
   the parent were shown.** This covers a `<choice>`'s text, the child an `<li>` leads with, and a
   `<chart>`'s series. Everything between the child and the parent counts toward it, including
   the list whose entry it is.

Evidence: `T/tagSpecific/listEntryHide.test.ts`. It is the sweep:
- 19 list forms with a hidden first entry;
- 22 contents where a choice's text must equal what a `<p>` draws;
- the rows of #2390, including a `<sort>` and a `<shuffle>` over a hidden inner list.

Rule 7 for `styleNumber` is done by #2426 (`T/tagSpecific/listEntryStyle.test.ts`). A source
"sets a style" when its `styleNumber` is not a default. For a list form, a style the source has
from where it sits (`<graph styleNumber="4">`) counts as set. A composite `<collect>` decides
when it makes each replacement, so a source that switches between setting a style and not
setting one is not followed (#2426, Tier 3).

Known violations:
- fixed by #2483 (closing #2480): an entry's properties are read through a composite sort or
  shuffle, also when the entry is a list entry. A composite sort or shuffle leaves out an entry hidden by a container since #2474
  (closing #2394); one inside `<group hide>` or `<conditionalContent hide>` counts all its
  entries as hidden, so `$s` placed elsewhere draws nothing, as the list forms do;
- **a write through `$l[k].hide`** does nothing (above).

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
