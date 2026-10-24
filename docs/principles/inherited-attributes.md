# Inherited attributes: `fixed`, `fixLocation`, `draggable`, `disabled`, `hide`, style, formatting, labels

These attributes are declared on every component (`BaseComponent.createAttributesObject`,
`W/components/abstract/BaseComponent.js:545-640`). Each one means something to authors, and each
reaches content inside a container. The survey found that five of them are inherited by four
different rules. Some of the differences are principled; others are not.

Paths: `T/` is `packages/doenetml-worker-javascript/src/test/` and `W/` is
`packages/doenetml-worker-javascript/src/`. Tiers are defined in the [README](README.md).

## How each attribute is computed today

| Attribute | Own attribute | From the container | Through a linked reference | Combination | Code |
|---|---|---|---|---|---|
| `hide` → `hidden` | yes | parent, source composite, adapter source | the source's own `hide`, not its container's | OR of all; a child's `hide="false"` **cannot** unhide | `BaseComponent.js:753-829` |
| `disabled` | decides | parent, source composite, adapter source | the source's own `disabled`, not its container's | own, else OR; `readOnly` forces true | `BaseComponent.js:860-978` |
| `fixed`, `fixLocation` | decides | parent, source composite (a `<group>` counts), adapter source, list-entry source | the source's **effective** value, including its container's | own, else OR; a `false` only stops that one input from fixing it | `W/utils/contextAttribute.js` |
| `styleNumber` | decides | the nearest enclosing setting | the source's own attribute | nearest wins | `W/core/StateVariableDefinitionFactory.ts:1291-1305`, `:1640-1690` |
| display settings (`displayDigits`, …) | decides | **none from a parent**: a sole *child* passes its settings *up* | yes, and along property references | first found | `W/utils/numberDisplay.js` |
| `draggable` | plain | none | yes | plain attribute | per component, e.g. `Point.js:67-74` |

---

## 1. What each attribute means

### CTX-1: `fixed`: no interaction can change it, but it still recomputes (Tier 1)
A fixed component refuses every write:
- a drag;
- typing into it;
- a write from an input bound to it with `bindValueTo`;
- an `<updateValue>` that targets it;
- since #2230, a click that would trigger an action on it.

Its value still follows what it depends on. `fixed` itself always stays writable.

Enforcement is central, in `W/core/EssentialValueWriter.ts:800-809` and at `:1195-1210` for
shadow sources.

Evidence:
- `T/baseComponent/baseComponentProperties.test.ts:121`, `:136`, `:151`;
- `T/tagSpecific/mathinput.test.ts:2565` "values revert if bind to fixed value", `:10840`;
- `polygon.test.ts:4489`, `linesegment.test.ts:1637`;
- `graph.test.ts:2281` "fixed graph implies fixAxes";
- `point.test.ts:434`, `:6188`;
- `T/copying/context_attributes.test.ts:402` (clicks).

Uniformity: well covered for point, vector, line, ray, polygon and polyline. Thin for circle and
curve. **None** for triangle, rectangle, parabola, angle or slider.

### CTX-2: `fixLocation`: it cannot move, by drag or by any other write (Tier 1; what counts as "location" is Tier 2)
Writes to state variables flagged `isLocation` are refused. Writes to anything else, such as a
label or a style, still go through.
- A circle's radius counts as a location (**[probe]**).
- A `<math>`'s value does not (#2209), and neither does an input's value.

Code: `W/core/EssentialValueWriter.ts:811-845`.

Evidence:
- `T/tagSpecific/point.test.ts:6188` "fix location versus fixed", `:6716`;
- `T/utils/in-graph.ts` (text, math, inputs and buttons in graphs).

Gap: `fixLocation` has no test at all for line, segment, ray, vector, polygon, polyline,
circle, curve, parabola or angle.

### CTX-3: `draggable="false"`: the reader cannot drag it; other writes still move it (Tier 1 for the first half, Tier 2 for the second)
**[probe]** A `<point draggable="false">` refuses a drag, but `<mathInput bindValueTo="$P"/>`
moves it.

The check is repeated in each graphical class, about 15 places (`Point.js:1039`, `:1158`,
`:1308`; `Circle.js:420`; `Line.js:1008`, …). The renderer treats `draggable="false"` like
`fixLocation`. The behavior is consistent, but the implementation should be one rule in the
writer: refuse a change to a location variable when the request comes from the reader dragging
this same component and it is not draggable. This is an implementation note (D19).

Sub-flags such as `verticesDraggable` and `endpointsDraggable` default to `draggable`.
`draggable` is *not* inherited from a graph.

### CTX-4: `disabled`: an input, button or answer takes no input and does not act (Tier 1)
`disabled` is checked in each interactive component's action handler, not in the core:
- inputs, `utils/input.js:241`, `:284`, `MathInput.js:1226`, `BooleanInput.js:280`,
  `ChoiceInput.js:1626`, `Slider.js:728`;
- `Answer.js:2658`;
- `UpdateValue.js:561`, `CallAction.js:224`, `TriggerSet.js:140-150`.

Since #2315 a disabled action also ignores triggers and does not pass a chain on. A disabled
input's *value* can still change from elsewhere.

Evidence:
- `T/baseComponent/baseComponentProperties.test.ts:714`;
- `T/tagSpecific/updatevalue.test.ts:3817`;
- `callAction.test.ts:2612`;
- `triggerset.test.ts:1765`, `:1858`, `:1912`;
- `choiceinput.test.ts:1470`.

Inconsistencies:
- `disabled` is accepted on every component but read by only about 20 classes. A
  `<point disabled>` and points inside `<graph disabled>` still drag (**[probe]**).
- A `fixed` input refuses typing but does not look disabled, so it silently reverts.

See D8 for both.

---

## 2. How they are inherited

### CTX-5: an attribute on a container applies to its content, and an item inside opts out with its own attribute (Tier 1)

| Attribute | Rule |
|---|---|
| `fixed`, `fixLocation`, `disabled` | Content inside a container that sets the attribute has it too, unless the item writes its own value. `<graph fixed><point fixed="false"/></graph>` has a draggable point. |
| `hide` | Content inside a hidden container is hidden, and **cannot** unhide itself: a visible thing inside an invisible box makes no sense. |
| `styleNumber` | The nearest enclosing setting wins. A `<group>` or `<repeat>` counts as a container. |

Evidence:
- `T/baseComponent/baseComponentProperties.test.ts:166` "can override fixed of parent", and
  `:781` "can override disabled of parent";
- `T/tagSpecific/group.test.ts:635`;
- `T/tagSpecific/styleOverride.test.ts:738-885`. That file includes "a group nested in a graph
  and a graph nested in a section style their points identically" and states that "authors
  shouldn't have to know which components are composites".
- **[probe]** `<section hide><text hide="false"/></section>` stays hidden.

A reader's write to `fixed` on an item that has no `fixed` of its own becomes that item's own
value, and from then on it beats the container.

### CTX-6: generated values are fixed by default (Tier 2)
These cannot be dragged or overwritten unless `fixed="false"` is set on the generator or an
ancestor:
- entries of `<sequence>`;
- the samplers;
- `<select>`;
- a repeat's `valueName` and `indexName`.

Authored lists are not fixed. A point at `($v, 0)` inside a repeat therefore drags only under
`fixed="false"`.

Evidence:
- `T/tagSpecific/fixedFalseDrags.test.ts:141`, `:301`, `:734` (#2229);
- `T/tagSpecific/repeat.test.ts:1381`.

---

## 3. Through references and copies

### CTX-7: a reference is fixed when its source is fixed or where it sits is fixed (Tier 1)
`$x`, an `extend`, `$x.prop` and `$l[i]` read the source's **effective** `fixed`. A point fixed
only by its graph makes every reference to it fixed, wherever the reference sits (#2193, #2230).
The same holds for `fixLocation`.

The reason is that writes through a reference land on the source and would be refused there
anyway. Reporting `fixed` truthfully on the reference means reading the source.

Evidence:
- `T/copying/context_attributes.test.ts`, the most systematic test in this area:
  - `:123`, every one of 23 reference forms × 5 containers × 3 source settings, for both
    attributes;
  - `:152`, `:182`, `:219`, `:385`, `:626`.
- `T/baseComponent/baseComponentProperties.test.ts:672`.

Three problems in this area are listed in D7:
- A linked reference with its own `fixed="false"` *reports* false but cannot be dragged.
- A write to a reference's `fixed` is forwarded to the source. A reader control on a copy can
  therefore unfix a point inside `<graph fixed>` (#2197, still reproduces).
- `<math extend="$m" fixed="false"/>` of a fixed `m` lets a bound input **change `m`**. This
  was **[probe]**d twice, and is a bug. For points and inputs the same write is refused.

### CTX-8: other attributes follow where the reference sits, not the source's container (Tier 2)
A reference takes its source's *own* `hide`, `disabled` and `styleNumber` attributes. It does
not take the hiding, disabling or style of the *container* the source sits in:
- an extend of a text inside a hidden section is shown;
- an extend of a point in `<graph styleNumber="5">`, placed in a plain graph, has style 1.

Evidence:
- `T/copying/extend_references.test.ts:1087`, `:1155`, `:1228`;
- `T/tagSpecific/listcomponentcollections.test.ts:434`;
- `T/tagSpecific/styleOverride.test.ts` "extending a graph re-resolves styleNumber against the
  new context";
- **[probe]**.

The split from CTX-7 is principled: `fixed` is about what can be written, while hiding and
style are about presentation, which follows where the reference is drawn. Nothing states this
rule today.

`disabled` is the exception that is not principled. It protects writes the way `fixed` does,
but follows CTX-8 instead of CTX-7. **[probe]** An enabled extend of an input disabled by its
`<section disabled>` writes through to the disabled input. See D8.

### CTX-9: an unlinked copy takes the attributes written on its source, not where the source sits (Tier 1)
`copy="$x"` takes exactly the attributes written on x, with references in them still live. It
takes nothing from x's container, and nothing from what readers wrote to x's attributes. That is
CPY-1 applied to attributes.

Evidence:
- `T/copying/context_attributes.test.ts:441`, `:525`, `:563`, `:594`;
- #2240.

Exceptions:
- `labelIsName` is never pasted (`labels.test.ts:355`).
- A reader's write to a *literal* attribute such as `hide` **is** carried into a later copy,
  while one to `fixed` is not. That contradicts the rule (D2).

---

## 4. Formatting and labels

### CTX-10: display settings travel with the value, not down from containers (Tier 1)
A value shown directly keeps its source's `displayDigits` and related settings. That covers
`$n`, `<number>$n</number>`, an extend and `$P.x`. An operand inside an expression takes the
enclosing component's settings, and an attribute written on the component wins. A parent never
passes its formatting down to its children. Details are in
[values-and-attributes.md](values-and-attributes.md), VAL-4.

### CTX-11: labels (Tier 1)
An object's label is the first of these that exists:
1. its `<label>` child;
2. a label written by the reader;
3. its name, if `labelIsName`;
4. for a list entry, the label of the component it came from;
5. for a reference, its source's label.

References and copies show their source's label unless they set their own. A property
reference has no label.

Code: `W/utils/label.ts:369-520`.

Tests: `T/graphical/labels.test.ts:295`, `:355`, `:610`, `:731`, `:1062-1074`.

### CTX-12: `disableAfterCorrect` (Tier 1)
After a correct submission, the answer and the inputs inside it stop accepting changes. An input
*outside* the answer that the answer grades stays enabled (**[probe]**).

Only two tests cover this, both on sugared answers (`T/tagSpecific/answer.test.ts:4634`, `:7875`).

---

## 5. A simpler model for a rewrite

Every row of the table at the top is an instance of one primitive: an inherited attribute,
described by four parameters.

| Parameter | Values |
|---|---|
| combine | OR, or nearest wins |
| own setting overrides | yes or no |
| follows a linked reference's source | the source's own attribute, or its effective value |
| writes go to | the component, or whoever supplied the value |

Proposed settings, once D7 and D8 are settled:

| Attribute | combine | own overrides | through a linked reference | protects writes |
|---|---|---|---|---|
| `hide` | OR | no | own attribute | no |
| `styleNumber` | nearest | yes | own attribute | no |
| `fixed`, `fixLocation` | OR | yes (on a linked reference it can only add) | effective value | yes |
| `disabled` | OR | yes | effective value, if D8(a) is chosen | yes, for reader input |

`W/utils/contextAttribute.js` alone is about 400 lines of special cases for two attributes, and
`disabled` and `hidden` each have their own definition of over 100 lines. One primitive with a
four-column table is much simpler. It is also easy to explain, because each column is something
an author can be told.

## 6. Tier 3 candidates

| Test | Why |
|---|---|
| `baseComponentProperties.test.ts:370` | Pins that an extend with `fixed="false"` reports false while it cannot be dragged (D7). The value propagation in it is Tier 2 |
| `baseComponentProperties.test.ts:1000` | Pins the mirroring of `disabledPreliminary`, which is an implementation path |
| `context_attributes.test.ts:268` | A write to a reference's `fixed` is forwarded to the source (D7, #2197) |
| `context_attributes.test.ts:312` | Writes are not mirrored into references made later. This is a consequence of the implementation |
| `labels.test.ts:355` | `labelIsName` is preserved on a copy, even when the copy sets `labelIsName="false"` (D19) |
| `fixedFalseDrags.test.ts:343`, `:506` | What happens to a written repeat value when the repeat shrinks, or its `from` or `step` changes. A policy choice |
| `fixedFalseDrags.test.ts:654` | Follows from the invertibility algorithm, not from `fixed` |
| `baseComponentProperties.test.ts:1179` | `permid` is documented as unused |

## 7. Coverage gaps

- `fixLocation` on every graphical component except point. Circle's radius counting as a
  location is not pinned.
- `fixed` on triangle, rectangle, parabola, angle and slider.
- That a non-draggable object still moves under indirect writes, for every graphical family.
- `disabled` on graphical objects, and an extend of an input disabled by its container.
- Inputs, buttons and sliders inside `<section fixed>`.
- A reference grid like `context_attributes.test.ts:123` for `hide`, `disabled` and
  `styleNumber`. One shared grid would make CTX-7 and CTX-8 explicit.
- Three levels of nesting, such as a copy of an extend of an extend inside a fixed group.
- `disableAfterCorrect` with an explicit input child, with a choiceInput, and with an input
  outside the answer.
