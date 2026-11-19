# Composites and lists

A *composite* (`group`, `repeat`, `repeatForSequence`, `select`, `selectFromSequence`, `shuffle`,
`sort`, `collect`, `conditionalContent`, `module`, `setup`) produces content that stands where the
composite was written. A *value list* (`mathList`, `numberList`, `pointList`, `sequence`, …) holds
an array and presents it as one item per entry.

Main uses two mechanisms that authors should not be able to tell apart:
- **real composites**, which splice replacements into their parent
  (`W/core/CompositeExpander.ts:892`);
- **list components** (`W/components/abstract/ValueListComponent.js`). The `listForms.ts` and
  `repeatLists.ts` passes turn `collect`, `sort`, `shuffle` and single-value repeat templates
  into these whenever the result looks the same.

The cells core keeps neither mechanism. It stamps templates per scope, rebuilds on a count
change (ADR 0004), and splits choices by timing (ADR 0009).

**"Composite" is an implementation term, not an author concept.** The tags grouped here do
different jobs:
- grouping: `group`, `module`, `setup`;
- repeating: `repeat`, `repeatForSequence`;
- choosing: `select`, `conditionalContent`, `shuffle`;
- gathering: `collect`, `sort`.

That they all "replace themselves with their content" is how the current core works. Authors
should not have to think about it. The principles below are stated so that each can be taught
as part of its own tag ("a repeat shows its content once per item, where the repeat is
written"), without the category. D24 proposes how to present them.

Paths: `T/` is `packages/doenetml-worker-javascript/src/test/` and `W/` is
`packages/doenetml-worker-javascript/src/`. Tiers are defined in the [README](README.md).

---

## 1. Transparency and lists

### COMP-1: a composite disappears; its content sits where it was written (Tier 1)
This holds inside typed containers too. `<setup>` contributes nothing.

| Written | Result |
|---|---|
| `<math>1 + <group>2 3</group></math>` | `1 + 2 * 3` |
| `<numberList><group><number>1</number><number>2</number></group> 5</numberList>` | `[1, 2, 5]` |
| `<math>1+<setup><number name="n">5</number></setup>2</math>` | `1 + 2` |

Evidence: `T/tagSpecific/compositesInTypedContainers.test.ts`. Its header states the
principle, and it has one test per composite:
- `:41`, `:50`, group in math and in numberList;
- `:59`, `:68`, repeat and repeatForSequence in math;
- `:77`, select in math; `:86`, module in math;
- `:95`, shuffle in numberList; `:109`, sort in numberList;
- `:118`, collect in math;
- `:130`, `:139`, setup.

Gaps:
- Only `<math>` and `<numberList>` are tested as containers, not `<mathList>`, `<textList>`,
  `<pointList>`, `<text>` or `<boolean>`.
- `conditionalContent` and `sequence` are not in the file.

The one deliberate exception is COMP-2: commas.

### COMP-2: a list-like composite separates its items with commas (Tier 1 for the defaults and `asList`, Tier 2 for nesting and whitespace)
The items of `repeat`, `repeatForSequence`, `select`, `collect`, `sort`, `shuffle`, `sequence` and
the value lists are separated by commas. That applies in text, on screen, and inside `<math>`.
- `asList="false"` turns it off.
- `<group>` and `<module>` are not lists unless `asList`.
- `conditionalContent` has no `asList` at all.

So a composite is not literal paste:

| Written | Result |
|---|---|
| `<math><repeat for="2 3" valueName="v">$v</repeat></math>` | `2, 3` |
| the same with a `<group>` | `2 * 3` |

(**[probe]**)

Sub-rules (Tier 2), from `T/baseComponent/compositeCommas.test.tsx`, whose header lists them:
- **The innermost composite decides** (`:102`).
- **An inner composite is one item of the outer list** (`:122`).
- **Each repeat iteration is one item.** A two-component template gives `ab, ab` (`:139`).
- **One item that cannot sit in a list turns commas off** (`:175`).
- **Empty composites and hidden items are skipped** (`:211`, `:228`).
- **Whitespace becomes the comma** (`:241-300`).
- **References keep the commas** (`:301-382`).
- **Inside `<math>`, a list next to a non-delimiter is wrapped in parentheses** (`:403`).

Code: `compositeLists.ts` in `@doenet/utils`, used by four consumers: the renderer, `text.ts`,
`parseMath.ts`, and the prototype FlatDast.

Small inconsistencies:
- `<group>` defaults to `asList="false"` while every other multi-item composite defaults to
  true (D19).
- Lists used to treat a hidden child three different ways. Since #2368 every list leaves it out
  of what is drawn, and still counts it as a value (D29).

The rule worth stating is: "`hide` affects display, never the values a list holds" (D29).

### COMP-3: a list is read, shown and indexed as its entries (Tier 1)
Any parent reads a `<mathList>`, `<numberList>` or `<sequence>`, or a collect, sort or shuffle of
values, as one child per entry. `$l[2]` is the second entry. A write to an entry goes to its
source: a `<mathInput bindValueTo="$s[1]">` on `<sort>5 3 1</sort>` changes the 1, and the result
re-sorts.

Evidence:
- `T/tagSpecific/listcomponentvaluelists.test.ts:36`, `:113`, `:152`, `:253`, `:843`;
- `listcomponents.test.ts:71`;
- `listcomponentcollections.test.ts:93`, `:374`, `:569`, `:674`;
- `sort.test.ts:966-1006`.

### COMP-4: whether a composite or a list component is built is invisible (Tier 2)
Building a repeat, collect, sort or shuffle as a list component must not change anything an
author can observe:
- values, text and commas;
- drags and saved state;
- variants, and the random draws that come after it.

Evidence: `repeatValueLists.test.ts:57-95` (`compare`, which loads each document both ways),
`repeatPointLists.test.ts`, `fixedFalseDrags.test.ts`, and `repeatTemplateLists.test.ts:276`,
`:311`, `:362`.

This invariant exists only because main has two mechanisms. A core that stamps templates needs
neither the dual implementation nor the guard list of about 40 forms that must stay composites
(`repeatValueLists.test.ts:836-920`). Keep the observable expectations and drop the "which form
was built" assertions.

### COLL-1: one thing or many things (Tier 1; D41)
> **What an index, a name or a property after a tag reaches depends on what the tag is to you,
> not on how it is built.**
> - **One thing** (a point, a vector, a matrix, a math holding a tuple) has its own properties.
>   An index reaches an entry of its value.
> - **Many things** (a list, a sequence, a collect, a sort or shuffle, a repeat, a select, a
>   conditional, the random choosers): an index picks an item, and a name or a property reaches
>   into every item.
>   - **A name always works:** for a `<repeat name="r">` with a `<point name="P">`
>     written inside it, `$r.P` is the `P` from every item, as `$r[2].P` is the `P` from item 2.
>   - **A property works when each item is one component:** every list entry, and a repeat,
>     select or conditional where what you write inside the repeat, in each option or in each
>     case is one component. `$r.x` is every item's `x`.
>   - **When what you write for an item holds several components,** a property can't tell which
>     you mean: name it and write `$r.P.x`.
> - **A `<group>`** holding one component stands for it. Holding several, name the one you mean.

How this is built from smaller rules is Tier 2: an item of a repeat, select or conditional is a
*wrapper* (an iteration, a pick or a shown case), as a `<group>` is, and a property after a
collection applies to each item and then through the wrapper (COLL-2 with COLL-3). Authors don't
need the word.

The kinds, precisely (Tier 2):
- **One thing:** a point, vector, coords, a math holding a tuple or vector, a matrix, a math or
  matrix input, and `<solveEquations>`. A set would be one thing with no index.
- **Many things:** the lists (`<mathList>` … `<intervalList>`), `<sequence>`, the random
  selectors and samplers, the list operators, `<collect>`, `<sort>`, `<shuffle>`, `<repeat>`,
  `<repeatForSequence>`, `<select>`, `<conditionalContent>` (0 or 1 items: the shown case) and
  `<functionIterates>`.
- **Wrappers:** `<group>`, an iteration, a pick and a shown case. A wrapper is not indexable
  itself (COLL-3).

Whether a tag is built as a composite or a list component never changes which kind it is
(COMP-4).

### COLL-2: a collection is indexed by item, and a property or name applies to each item (Tier 2; D41)
- **Index:** an item (NAME-2).
- **Property:** each item's (`$pl.x` of a `<pointList>` whose points have x 1 and 3 is `1, 3`).
  An item that lacks it gives a blank, with a warning decided at load (#2452).
- **Name:** each item's component of that name: `$r.P` is every iteration's `P`, and `$s.P.x` each
  pick's `P`'s x. The name must be declared in every option or case, with one type (COMP-11);
  what is written inside a repeat declares it in every iteration.
- **Options or cases that differ** (some holding one component, some several): a property or an
  index after the select or conditional works only for some branches, so the author gets a
  warning at load naming the branches that hold several (#2520 item 1).
- **Own properties, a fixed set:** `numItems` (entries, iterations, picks; 0 or 1 for a
  conditional), and the settings every component has (`hide`, `fixed`, `disabled`). They win
  over the items' properties of the same name; an item that is itself a collection is reached by
  index (`$c[1].numItems`). A collection's attributes are not properties, so adding one never
  shadows the items' properties.

**Done by #2565** (closing #2523 and #2271):
- `numItems` is on every collection, in both builds (`W/utils/numItems.ts`), and wins over an
  item's property of that name.
- A name after a collection is each item's: `$rmix.P`, `$rmix.P.x`, `$s.P.x`, `$c.P` of a collect
  holding `P` more than once. After a select of several it follows the every-option rule at load.
- An item lacking a property gives a blank with `w0192` at load, for repeats too (`$rmix.x` over
  a point and a text is `1, ＿, 2`).
- A collection's settings are its own (`$s.fixed`, `$r.fixed`).
- A collection's attributes are not properties (`attributesAreProperties = false`): `$c.maxNumber`
  of a collect is each item's. A collect, sort or shuffle built as a list no longer inherits that
  list's aliases (`$cp.numPoints` of a `<collect componentType="point">` names nothing).
- A tag of a property after a collection of several is `e0064`, like a tag of the collection
  (`<point extend="$s.x"/>` was `(0, 0)`).

**Kept by #2565, for a decision (D41):**
- the older count names on authored lists (`numComponents`, `numPoints`, …);
- attributes that a reference page documents as properties: an authored list's `maxNumber`,
  `unordered` and `mergeMathLists`; `<tally>`'s `categories`; a sampler's distribution (`mean`,
  `variance`, …).

**Known violations** (#2569):
- a name each item lacks shows nothing, with no warning (`$r.P` with `P` only in a nested
  repeat, `$r.P.nope`);
- `$c.P` of a collect holding `P` once names that one alone, and when the collect's count
  follows an input it latches onto one item live (a reload gives every item);
- `<collect fixed|disabled|hide>` passes these to the collected copies, so they aren't the
  collect's own;
- a collection's own property spelled in another case, through a wrapper (`$g.numitems`), isn't
  the collection's;
- a name after a collect differs between the builds (COMP-4).

### COLL-3: a wrapper stands for its one component; with several, it is only a container (Tier 2; D41)
A wrapper is a `<group>`, or an item a repeat, select or conditional makes: an iteration, a pick
or a shown case. Authors see a `<group>` (COLL-1's last bullet); the others they meet only as
"what you write for an item".
- **One component:** a tag, an index or a property after the wrapper applies to that component
  (`<math extend="$g"/>`, `$g[2]`, `$g.x`). "One component" ignores blank text, comments and a
  `<setup>`, and is decided at load (NAME-2).
- **Several:** reach a component by name (`$g.P`). An index or a property after the wrapper names
  nothing, with a warning that says to name the component.
- **None:** the wrapper is missing (D37).
- **Its own settings** are its own either way: `$g.hide` is the group's.

**Done by #2547** (`W/utils/wrappers.ts`): a property after a wrapper of several names nothing,
with **`doenet-w0193`**, which names a child that has the property (`$g.A.x`), or suggests
`name="P"`, or writing a lone reference as a tag with a name. Its level follows DIAG-2: a `<group>`
the author wrote is a warning; when every option or case holds several, it is `w0191` at load. A
wrapper's own settings are its own: `$g.fixed` of a group of several is the group's (it was each
child's run together).

**Done by #2565** (#2548 items 1–5 and 7):
- `<group name="g">$r</group>` then `$g.x` is `$r.x`, with commas;
- a repeat whose template holds several gives `w0193` at load, also with 0 iterations;
- an `<option>` holding only a reference counts as what it names;
- a property some iterations lack through a `<conditionalContent>` gives a blank with `w0192`;
- `$r[1].x` at 0 iterations gives `w0181` live as after a reload.

**Known violation** (#2569, from #2548 item 6): a reference whose one item goes away keeps its
value in a `<text>`, a `<math>`, an attribute or `bindValueTo`, where a `<p>` and a reload show
nothing.

### COLL-4: `<sort>` and `<shuffle>` take one type, decided at load (Tier 2; D41)
- A child that is a list or a collection is flattened into its items, so several lists sort
  together.
- A wrapper is not flattened. A `<shuffle>` of wrappers shuffles them as units; a `<sort>` of
  wrappers with several components is an error, having nothing to compare. A wrapper with one
  component stands for it.
- Items of more than one type (a number and a text; a math and a group of several) are an error
  at load. Integer, number and math count as one type (D44).
- **What a type is** (D46): a **value** (`<math>`, `<number>`, `<text>`, `<boolean>`, an input)
  has its value's type; an **object** (`<point>`, `<line>`, `<atom>`, `<answer>`, …) has its tag,
  with the tags built on it; **content** (`<p>`, sections, `<feedback>`, `<graph>`, `<image>`,
  `<table>`, `<m>`, `<label>`, and a wrapper of several) is one type. A `<sort>` of objects or
  content needs `sortByProp`; without it, it is an error at load.

**Done by #2565** (`W/utils/dast/reorderedItemsAtLoad.ts`), for `<sortIndices>` too:
- items of more than one type are **`e0076`**, and a `<sort>` of a wrapper of several is
  **`e0077`**, which suggests a `<collect>` or the name to sort by (`<sort>$r.n</sort>`). The sort
  or shuffle shows one `_error`;
- a `<shuffle>` moves a wrapper of several whole (`5 6, 1 2, 3 4`). This changes the variants of
  documents that shuffle groups (accepted, D17);
- blanks are kept and placed last (`<sort>$nothing 3 1</sort>` is `1, 3, ＿`; VAL-5);
- text beside components is read as their type, where it reads as that type
  (`<sort><math>d</math> a <math>b</math></sort>` is `a, b, d`).

**D46's kinds done by #2599** (closing #2570; `W/utils/componentKinds.ts`, `kindOfComponentType`):
- each author tag declares its kind (`static isValue`, `static isContent`; everything else is an
  object), and a test lists every author tag with its kind, so a new one must be placed;
- **an input stands for what it holds**: a `<mathInput>` is a math, a `<textInput>` a text, a
  `<booleanInput>` a boolean. A sort, shuffle and the list operators (`<argMin>`, `<tally>`, …)
  compare an input by its value, where they used to drop it;
- an object's type is the first author tag in its class chain that is still an object: a
  `<triangle>` or `<rectangle>` is a `<polyline>`, a `<circle>` a `<curve>`. A `<matrix>`,
  `<interval>`, `<subsetOfReals>` and `<periodicSet>` are objects, though built on `<math>`;
- a `<sort>` or `<sortIndices>` of content, or of objects other than points and vectors, without
  `sortByProp` is **`doenet-e0080`**, which suggests `sortByProp="text"` for content;
- `e0076` for an `<m>` beside a math (or a `<label>` beside a text) says to wrap it in
  `<math>` (or `<text>`), and an `<m>` whose LaTeX isn't math gives **`doenet-w0196`** when it is
  read as math.

**Known violations** (#2568, #2581): a `<slider>` and a `<choiceInput>` get their value type only
as the document runs, so they are left out of the one-type check at load, and a `<choiceInput>`
(text values) beside a `<number>` sorts as text (`10` before `9`); TYPE (D45) types them at load.
A `<math>` whose own content doesn't parse (`<math>(((</math>`) is a blank with no diagnostic.

**Known violations** (#2569):
- **fixed by #2599:** `<sort><p>b</p><p>a</p></sort>` showed nothing, silently; it is `e0080`;
- not checked at load: a `copy` with another `type`, a wrapper of several the DoenetML doesn't
  reveal, and items whose type isn't known at load (a `valueName`, until D44 and D45);
- text beside a reference isn't read as its type: `<sort>$A (0,1)</sort>` with `A` a point is
  `e0076`, where a written `<point>` works (TYPE-1 types `$A` at load);
- `e0077`'s suggested `<collect>` names one tag, so for a group of a `<number>` and a `<math>`
  it collects only some;
- `<sort sortByProp="atomicNumber">$g</sort>` of a `<group asList>` of atoms is now `e0077`.
  The fix is `<collect componentType="atom" from="$g"/>`; D46 proposes a `<list>` tag.

### COLL-5: a repeat's `for` holds one type, decided at load (Tier 2; D44)
- **Items:** as in COLL-4. Literal text is cut by VAL-12, a list or collection is flattened, a
  wrapper with one component stands for it, and a wrapper with several is one item:
  `for="$g"` of a group of several is one iteration.
- **One type,** found from the DoenetML by REF-5's typing of parts. A mix is an error at load.
  Integer, number and math count as one type, and `$v` is the widest present. A wrapper of
  several is content (D46), so it may share a `for` with `<p>`s.
- **`type`** types the literals and, when written, every item.
- So `$v` has one type in every iteration, and the template is checked at load.
- **A name after `$v`** when the items are wrappers follows COLL-2 and COMP-11: `$v.P` resolves
  when every item declares `P` with one type, decided at load. If an item lacks it, it names
  nothing in every iteration (`w0183`); two types are an error. A repeat's iterations satisfy
  this by construction, so a repeat over another repeat goes over records.

**Done by #2600** (closing #2567):
- a `for` of more than one type is **`doenet-e0081`** at load, at the `for`, shown in place of
  the iterations; the types are D46's kinds (`kindOfComponentType`), read by the same
  `itemReader` as `<sort>` and `<shuffle>`;
- a wrapper of several in `for` is one item, so a repeat over another repeat's iterations goes
  over records: `$d.P is labelled $d.L.` works (it was six blanks). `$d` follows the wrapper as
  what it holds changes;
- `type`, when written, applies to every item: `for="2 $t"` with `t` a `<text>`, and
  `<repeat type="text" for="$n">`, are `e0081`;
- `$v` is typed for the checks at load: `<point extend="$v"/>` over texts is `e0065`, and a
  `<sort>` of `$v` beside a `<text>` in a repeat over maths is `e0076`;
- a name after `$v` follows the every-item rule: an item lacking it is `w0183` and a blank in
  every iteration, two tags are `w0184`, each naming the item ("item 2 of the `for`") where its
  place is fixed;
- a `<group>` written as an `extend` or `copy` of another, with children of its own, holds the
  other's children and its own (REF-4), also in a `<sort>` or `<shuffle>`.

**Known violations** (#2569): `$r[2].d.P` (a name after the value, from outside the iteration)
names nothing, and its `w0193` suggests `$r[2].d.P.P`, which names nothing either; a property
after a repeat in error (`$rmix.x`) adds `w0104` (DIAG-5); the `item` wording of `w0183` and
`w0184` is English only; a `<slider>` or `<choiceInput>` in `for` is left out of the check until
TYPE types them (#2568).

---

## 2. Repeats

### COMP-5: a repeat writes its template once per item; `valueName` and `indexName` are per iteration (Tier 1)
In iteration k, `$v` is item k and `$i` is k. A reference inside the template keeps the referent
it had where it was written.

That holds for references inside the items a repeat goes over, too. If an item contains a
reference with the same name as the repeat's `valueName`, the reference keeps its original
meaning; the repeat does not take it over:

```xml
<mathList name="m">11 22 33 44</mathList>
<repeatForSequence from="2" to="3" valueName="i" name="rounded">
  <round>$m[$i]</round>
</repeatForSequence>

<p name="p"><repeat for="$rounded" valueName="i">$i</repeat></p>
```

`p` shows `22, 33`. Each item is a copy of `<round>$m[$i]</round>`, whose `$i` still means
`rounded`'s index, 2 then 3. Read as the outer repeat's `i`, it would mean the item it sits
inside, which is circular; before #1838 that took the whole document down. The same holds for
an `$i` inside an item's attribute, such as `<updateValue target="$m[$i]">`: a copy changes the
entry its original changes.

A `valueName` that equals the `indexName` is warning `doenet-w0189`, decided at load (#2529,
closing #2175).

Evidence:
- `T/tagSpecific/repeatIterationValues.test.ts:29`, `:64`, `:137`, `:169`, `:188`, `:263`, `:277`;
- `repeat.test.ts:17-230`, `:2420`, `:2444`, `:2481`;
- `repeatForSequence.test.ts:19-150`, `:2716-2860`.

### COMP-6: `$r[k]` is iteration k, and `$r[k].x` is the `x` inside it (Tier 1)
The index can be dynamic (`$r[$n]`), and repeats can nest (`$a[2].b[3].c`).

Evidence: `repeatForSequence.test.ts:156`, `:2800`; `repeatValueLists.test.ts:395`.

Positional double indexing, `$a[2][1][3]`, reaches the j-th component of an iteration. That
exposes the internal iteration group. It is Tier 3. It is why `$r[1][2]` does not reach into a
nested repeat today. D27 decides that an index selects only instances (entries, iterations,
picks), and that an iteration holding one repeat passes the next index through to it.

### COMP-7: a shorter repeat hides iterations; a longer one brings them back as they were (Tier 1)
When a repeat shrinks, the extra iterations are withheld, not destroyed. When it grows again they
return with the reader's inputs, answers and drags. A select inside a dynamic repeat does not
resample when the repeat goes to zero and back.

Evidence:
- `repeatIterationValues.test.ts:325` (answers through a shrink, a regrow and a reload);
- `repeatTemplateLists.test.ts:362`, `repeatValueLists.test.ts:770`,
  `repeatPointLists.test.ts:396`;
- `select.test.ts:643`, `selectfromsequence.test.ts:753`;
- **[probe]**.

The cells core does the same (ADR 0004).

**Iteration state when items change, rather than the count, is not uniform** (D12, **[probe]**):

| Change | What happens to reader state |
|---|---|
| A list item changes value | stays at its position |
| A sequence's `from` changes | stays at its position |
| A `<sort>` reorders | stays at its position |
| `<repeatForSequence exclude=…>` changes its `exclude` | **every iteration is rebuilt, and state is lost** (`RepeatForSequence.js:511-535`, #2319) |
| A `<repeat>` over components whose identity changes | rebuilt, and state is lost (`Repeat.js:466-519`) |

The simple rule is "reader state belongs to iteration k", which the cells core gives for free.
No test pins the loss, so adopting the rule breaks nothing.

---

## 3. Choices

### COMP-8: a selection is made once, from the variant, and is never made again (Tier 1)
`<select>`, `<selectFromSequence>`, `<selectPrimeNumbers>`, `<selectRandomNumbers>`, `<shuffle>`,
`<pretzel>` and a `<choiceInput shuffleOrder>` choose once, from the document's variant. **Changing a
selection after it has been made is prohibited, for any reason:**
- **not when what it was made from changes.** `numToSelect`, a range, `exclude`, weights and the
  options are read once, when the selection is made, and fixed with it. A later change to them
  is ignored;
- **not on a reload.** The selection, and what it was made with, come back as they were. Where a
  value decided it, the selection is saved like the reader's own work (#2468);
- **not when a requested variant no longer fits.** Choices a requested or saved variant gives are
  taken as given, even if the current DoenetML would not choose them (only possible while the
  DoenetML is edited; doenet.org does not let assigned content change);
- **not to recover from a failure.** A selection that can't be made is reported (DIAG-7, D39),
  never repaired by choosing again or differently. Code that cannot proceed with a selection
  must report the problem, not re-draw.

Choosing again is what a new select does: a `copy` is a new select, written again, which
chooses for itself (D33). An `extend` and a `copyWithState` show the same selection.
- **References agree.** Copies and extends show the same picks, however deeply the choice is
  nested in what was copied (CPY-8; #2344 fixed the nested-group case, #2342).
- **Content stays live.** The *content* of a chosen option still updates.

**Samplers are not selections.** `<sampleRandomNumbers>`, `<samplePrimeNumbers>` and
`<sampleMultivariateRandomNumber>` draw from the variant too, but they are meant to draw again:
when what they read changes, and when they are resampled (`resample()`). So a sampler may read
what a reader changes, and redrawing when a parameter changes is correct. A reload still brings
back the draws it had (SAVE-4), also for a `copyWithState` and for draws made at load (#2549). Because a sampler can draw again,
a selection may not read one (SEL-1).

Evidence:
- `T/tagSpecific/select.test.ts:432` (copies do not resample), `:544` ("does not change
  dynamically"), `:643`;
- `selectfromsequence.test.ts:567`, `:667`, `:753`;
- `shuffle.test.ts:47`.

Code: `Select.js:263` (`selectedIndices` is immutable and stored), and `:693` (no replacement
changes). Since #2468 the attributes that decide a selection are `immutable` state variables
(`StateVariableDefinitionFactory`), `numToSelect` is the count the selection was made with
(the attribute feeds `specifiedNumToSelect`), and a selection a value decided is saved with it
(`definitionEssentialValuesReproducible`, `keptSelection`).

Differences in the cells core:
- Picks are derived from the seed rather than stored. Tier 3.
- **A non-literal `numToSelect` is banned there (ADR 0009). That is a flaw in the cells core, to
  be fixed eventually, not an accepted change to DoenetML.**
  - A reference in `numToSelect` is allowed when SEL-1 allows it: to another random choice or to
    fixed content, never to anything the reader can change. It is read once, when the choice is
    made.
  - These tests stay binding, in each of `select.test.ts`, `selectfromsequence.test.ts`,
    `selectprimenumbers.test.ts` and `selectsamplerandomnumbers.test.ts`:
    - "numToSelect from selectFromSequence": `numToSelect` taken from another random choice;
    - in all but `selectsamplerandomnumbers.test.ts`, the "…initially unresolved" tests (for
      example `select.test.ts:283`): `numToSelect` read through a chain of references.
  - "select doesn't change dynamically" (`numToSelect="$numToSelect"` from an input) changes:
    under SEL-1 a parameter from an input is an error at load (D39).
  - PR #2281's rewrite of the select test to use a literal does not replace them.
- Stable `stateId`s on shuffle and sort keep saved state on the right item. The *property* is
  Tier 2. The id format asserted in `shuffle.test.ts:791`, `sort.test.ts:1008` and
  `collect.test.ts:3710` is Tier 3.

### SEL: what a random choice chooses from is the author's, and every choice can be made (Tier 1; D39)
> **The reader can decide whether a random choice appears, but never what it chooses from.** What
> a choice chooses from comes from what the author wrote, never from what the reader enters or
> does. **Every choice that can appear can be made as written.** If DoenetML can't show that, the
> document has an error, the same in every variant.

A "random choice" here is a selection (COMP-8). A sampler is not one: it is meant to draw again
when what it reads changes, so it may read what the reader changes, and no choice may read it.

That is the whole author-facing rule. Revealing a case or adding iterations can make a new
choice appear; nothing a reader does changes what an existing or future choice draws from. The
guarantee covers every potential variant, not only the ones today's algorithm makes, so checking
today's variants is a regression aid, never the guarantee (DIAG-7).

The Tier 2 rules below say how it is checked. They can grow (more operators, more analysable
sources) without changing the statement above.

- **SEL-1: what a choice chooses from comes from the DoenetML, the variant and the choice's
  position (Tier 2).** Its parameters (`numToSelect`, ranges, `step`, `exclude`,
  `withReplacement`, `coprime`, excluded combinations, weights, `selectForVariants`, the options)
  may reference:
  - other selections and fixed content (`exclude="$a"` keeps two numbers apart);
  - the iteration it is in: a repeat's `indexName`, always;
  - a repeat's `valueName`, when what the repeat iterates over is itself one of these (a
    `<repeatForSequence>` whose `from` and `step` are, or a `<repeat for>` of a literal list or a
    selection).

  A parameter that reaches anything that can change is an error at load (`e0070`), even where
  its effect could be worked out:
  - what a reader can change: an input (even its prefill), an answer, a slider, a draggable
    component or a value one depends on (`a` in `<point>($a, 2)</point>`), a target of
    `bindValueTo`, `updateValue` or another action;
  - a sampler, whatever its own parameters read, since it can be resampled;
  - anything reading these, including a `valueName` of a sequence whose `from` reads an input.

  "Can change by a reader" is DIAG-2's definition, whose write index
  (`buildReaderWritableIndex`, #2495) the check reuses.

  **Done by #2511** (`W/utils/dast/choiceParametersAtLoad.ts`, `CHOICE_PARAMETERS`). The
  selection in error becomes an `_error` that selects nothing, reported at load wherever it is
  (DIAG-7), and isn't counted as a variant. An extend or copy of it is the same error, reported
  once. `selectForVariants` takes no reference (`w0106`), and `<shuffle>`, `<pretzel>` and
  `shuffleOrder` take only literals, so none of them needs the check. Where the check can't tell,
  it allows: a false error is worse than a missed one.
- **SEL-2: whether a choice exists may depend on the reader (Tier 2).** A choice in a case whose
  condition reads an input, or in an iteration of `<repeatForSequence to="$n">` with `n` from an
  input, is made when the reader causes it. The count or condition is not a parameter of the
  choice.
- **SEL-3: a choice made later is the one its position gives (Tier 2).** Iteration *k*'s choice
  depends only on the variant and *k*, not on when or in what order the iteration was made: a
  reader going 1 → 5 sees the same iteration 5 as one going 1 → 3 → 5, and as a reload. Shrinking
  and growing a repeat brings an iteration's choice back; it is never made again (COMP-8, SAVE-4).
  This is D17's seeding by stable key, applied to template instances. Tested by #2511
  (`T/diagnostics/selectionParameters.test.ts`); iteration seeds already follow position. A
  sampler reading the `valueName` draws again when its iteration is removed and made again,
  since its parameter changed, as a sampler should.
- **SEL-4: a choice never fails by chance (Tier 2).** If a valid choice exists, the select finds
  one, drawing among valid choices rather than retrying with a limit. Which values a variant gets
  may change for this. **Done by #2511** (`W/utils/validCombinations.ts`): the existing rejection
  draws run first, so a variant that succeeded before keeps its values, and only when they find
  nothing is the selection drawn exactly among the valid combinations. A `coprime` request with
  no coprime combination is `e0045` at load. `e0052`, `e0053` and `i0057` are retired.
- **SEL-5: feasibility is proven at load, over every value the parameters can take (Tier 2).**
  From the parameters' ranges, not by trying variants. `to="$a" numToSelect="3"` is fine when `a`
  ranges over 5..10, and an error in every variant when `a` can be 1, naming the value. An
  iteration index ranges over every iteration that can exist: 1..10 for `to="10"`, and 1, 2, 3, …
  with no end when the count comes from an input. So `to="$i"` with one value drawn is fine in
  every iteration, and `numToSelect="3"` with `to="$i"` is an error, since iterations 1 and 2
  can't draw 3.

  **Done by #2555** (`W/utils/dast/choiceFeasibilityAtLoad.ts`) for `<select>`,
  `<selectFromSequence>` and `<selectPrimeNumbers>`:
  - **The error.** A selection that can't always select is `e0073` in every variant. It names
    the value that fails ("when `$a` = 1, it has 1 value to select 3 from"), or says the
    selection can't be shown to always select and gives the ranges. The selection becomes an
    `_error`, as SEL-1's does.
  - **Shared code.** The check and the run time share it. Each parameter is compiled at load
    into arithmetic over references (`_selectionParameter`). The run time evaluates it with what
    the references hold; the check evaluates it with each value they can take. Both use one
    failure test (`W/utils/selectionFailure.ts`).
  - **How it searches.** Ranges are bounded first. Only what the bounds don't prove is
    enumerated, up to 20 000 combinations.

  With it, **a selection's failure is always an error**, wherever it happens:
  - #2468's info is removed: a failure a value decides was a missing selection;
  - a failure after load goes through DIAG-7's after-load path;
  - a `numToSelect` that isn't a number is `e0075`, not an empty selection, and one of 0 or below
    selects nothing;
  - a `<selectRandomNumbers>` can fail too (`e0075`, `e0036`);
  - a `discreteUniform` range that counted without end no longer freezes the document.

  It also changed how every sequence tag counts (`<sequence>`, `<selectFromSequence>`,
  `<repeatForSequence>`, `<animateFromSequence>`), so the check and the run time count alike:
  - a count that floating point leaves just below a whole number is that number:
    `from="1000" to="1000.3" step="0.1"` has 4 values;
  - a count rounded up ends at `to` exactly: 0.3, not 0.30000000000000004.
- **SEL-6: a parameter is in an analysable form (Tier 2).** A literal; a reference SEL-1 allows,
  with a known range (a selection, a literal `<number>`, an index); and `+ − ×`, integer
  division, `min`, `max`, `abs` of these. A `<number>`, `<integer>` or `<math>` whose content is
  in these forms counts too, so `<number name="m">$a + 2</number>` and `numToSelect="$m"` is
  fine; an error there names that component and the part that isn't analysable. Anything else is an error.
  The list of forms may grow.

  **Done by #2555** (`e0074`, at the parameter, naming the part, and the `<number>` it is in if
  any). The list grew:
  - `/`, `floor`, `ceil` and `round`;
  - a repeat's `valueName`, and a module attribute;
  - an entry of a literal list at an analysable index;
  - a part that reads nothing from the variant or an iteration, which is its value in any form
    (`$a + 2^3`).

  A boolean parameter (`withReplacement`, `coprime`) is a constant, or one reference to another
  selection. A parameter that can't keep a selection from being made, such as `selectWeight`,
  isn't held to this rule. `<math>` is read like `<number>` (D39, decided after #2555).
- **SEL-7: choices depending on each other form an order (Tier 2)**, with no cycle (`e0005`), and
  ranges flow forward through it. Done by #2555 for the check: a selection another reads is
  checked first, wherever it is written. **Done by #2597** (closing #2553) for the run time: a
  reference to what a composite written later holds (`$g.n` before `<group name="g">`) waits for
  that composite to expand, so a random choice reads its parameters once they are there,
  whatever order the document is written in.
- **SEL-8: every option, case and iteration template is checked, picked or not (Tier 2):** its
  errors and its warnings, each at its line.

Outside the guarantee: valid values that make later content degenerate (a random 0 in a
denominator), which authors exclude; constraints on derived values such as `$b^2 - 4$a$c > 0`, a
wanted future extension; saved variants from another version of the DoenetML; and samplers,
which aren't choices.

**Known violations** (#2508; SEL-1, SEL-3's test and SEL-4 done by #2511; SEL-5 to SEL-7 by
#2555, whose leftovers are #2563):
- **fixed by #2573 and #2576:** SEL-1 read a component whole where a parameter named a property
  of it. Now `$sec.sectionNumber` reads what decides the number, a graph's properties read its
  attributes (its axes are fixed by a literal `fixAxes` or `fixed`), and a component placed in a
  graph (a `<number>`, `<math>`, `<text>`, `<label>`, `<image>`, an input) counts as dragged only
  in its `anchor`. Such parameters are still `e0074` where SEL-6 applies. **Left** (#2578):
  - a placed component inside a `<group>` or `<repeat>` in a graph still counts as dragged, and a
    reference that reads a graph whole is an error through the graph's own dynamic children;
  - `fixAxes="$b"` counts as not fixed; `$ml[2].anchor` counts as changeable when any entry is
    placed; a `draggable="false"` component's `anchor` counts as changeable; what a point's label
    holds counts as dragged with the point;
  - a `$cc` copy of a `<conditionalContent>` holding a section, written before the section, isn't
    looked through, so a section number it changes is allowed (a missed error);
  - state a reader sets by an action (a hint opened) isn't checked at all, the other way;
- **fixed by #2573:** a property of a selection in error (`$s.value`), and of any component in
  error, reports nothing more (DIAG-5);
- `<selectFromSequence extend="$r"/>` of a sampler loads with `e0071` (REF-5) since #2542;
- `e0044`/`e0051` reject a selection once 70% of combinations are excluded, even when valid ones
  remain (SEL-4). Since #2555 this is an error rather than an info. So when the range comes from
  another selection, it is an error **only in the variants where it happens** (DIAG-7);
- **fixed by #2555:** a failure a value decided was a missing selection with an info in some
  variants (#2468). Every selection failure is now an error;
- left by #2555 (#2563). Each is an error in some variants only, or a false error:
  - **A `<selectRandomNumbers>`'s parameters aren't checked at load.** So `from="$a" to="2"`
    (`discreteUniform`, with `a` up to 3) is `e0036` only in the variants where `a` is 3.
  - **A selection whose parameters read nothing from the variant is left to fail when it is
    made.**
    - In a case not shown, the failure is an error after load.
    - In a `<select>` option, it is an error **only in the variants that pick the option**
      **[probe]**. `<select><option><selectFromSequence from="1" to="2"
      numToSelect="3"/></option><option>ok</option></select>` is `e0036` in variants 2 and 3,
      and clean in variant 1.
    - Its parameters are constants, and the check already has the failure test, so this can be
      decided at load (SEL-8).
  - **A `copy` of a selection with parameters of its own isn't checked** **[probe]**.
    `<selectFromSequence copy="$c" numToSelect="3"/>`, with `c` ranging up to `$b`, chooses
    again (D33). It fails in the variants where `b` < 3.
  - **The `variantOptions` kind of `e0073` gives false errors** **[probe]**. It is meant for an
    option copied by an index, beside options that name variants. It also fires for a literal
    index (`$g[1]`), and when the options naming variants are in another `<select>`. The
    DoenetML decides both, so neither should be an error.
  - **Under an index with no end, an error can name a pair of values that can't occur.** With
    `a` from `$i` to `$i+1.5`, a selection that can always be made gets "when `$a` = 3, `$i` =
    1".
  - **`discreteUniform` counts its range differently from a sequence.** A
    `<selectRandomNumbers type="discreteUniform">` has no floating-point tolerance, so
    `from="1000" to="1000.3" step="0.1"` gives 3 values where a sequence gives 4. Every range
    should count the same way.
  - **A constant `<math simplify>` read by a compiled math parameter is held as a number.** So it
    shows as a decimal: `0.833…` where it showed `5/6`.
- SEL-8 since #2547: reference and conversion warnings (`w0104`, `w0187`, `e0004`) are reported at
  load in a case not shown, an iteration not made and an option not picked, and an authored
  warning is a warning there, not an info. **Left** (#2506): a warning a component decides is
  reported only once its content is made;
- **fixed by #2549** (closing #2477): a `copyWithState` of a sampler carries its draws, and draws
  made as the document loads are saved even with no update before a reload. **Fixed by #2597**
  (closing #2553): a sampler whose parameters come from a composite written after it draws once,
  its `copyWithState` shows those draws, and both are kept through a reload; a `copyWithState` of
  a `<selectRandomNumbers>` or `<selectFromSequence>` whose range comes from a group written
  later selects from that range (it was a false `e0075` or `e0036`);

### COMP-9: `conditionalContent` shows the first case whose condition is true, else the `<else>` (Tier 1)
The single-case form `<conditionalContent condition="…">` shows its children or nothing.

Evidence: `T/tagSpecific/conditionalcontent.test.ts:66-227`, `:416`, `:670`, `:1064`, `:1139`,
`:1441`, `:1603`, `:1651`.

### COMP-10: what a reader entered in a case stays with that case, through switches and reloads (Tier 1)
This was merged on 2026-10-24 (#2318) and matches ADR 0009. A case's random content is reseeded
the same way each time (**[probe]**).

Evidence: `T/tagSpecific/conditionalcontent_case_state.test.ts:105`, `:117`, `:215`, `:247`,
`:277-342`, `:509`.

The mechanism is not a principle. It deletes the case, stashes its saved state and re-applies it,
and the *format* of the stashed keys is asserted at `:385-478`. One test, `:188`, pins an
evaluation-order artifact: a copy is still a `mathInput` after its source switched to a
`textInput` case. A core in which every branch is built cannot reproduce that, and should not.
Both are Tier 3.

Kept state no longer goes stale after an outside change: since #2549 a value restored when a case
is shown again is compared again, not trusted (SAVE-1).

### COMP-11: a name inside a choice is visible when every branch declares it, with the same type (Tier 1; D13, D22)
- **A name inside a `<conditionalContent>` is visible outside it**, as a `<group>`'s is. A plain
  `$x` from outside finds the `x` in the active case, and `$cc.x` still works.
- **It resolves only if every case declares it, with the same type.**
  - "Every case" means each `<case>` written, and the `<else>` if there is one. With no
    `<else>`, `x` in every case is enough: while no case is active, `$x` names nothing.
  - If a case or the `<else>` has no `x`, `$x` and `$cc.x` name nothing: a blank (VAL-5), with
    **warning** `w0183` at the reference, bare or on a tag.
  - If two of them declare `x` with different types, it is an **error** at the reference, bare
    or on a tag, decided at load (`w0184` bare, `e0066` on a scalar tag; DIAG-7). A type error is
    the same in both forms (REF-1). It is not a deprecation: the reference doesn't work.
  - So a reference's type, and whether a parent accepts it as a child, never change with the
    active case.
- **Two cases declaring `x` don't make it ambiguous**, since only one can be active. An `x`
  beside the `<conditionalContent>` does (`doenet-w0105`).
- **On a tag**, `<math extend="$x"/>` is decided by REF-0: a mix of types is an error. A missing
  `x` gives the same warning as the bare form, and the tag is missing. An `x` that can be absent
  because there's no `<else>` gives a missing tag with an info while no case is active (D37).
- **A `<select>` with one pick** (`numToSelect` written as `1`, or left out) works the same way,
  with every option in place of every case. **With several picks**, names stay private, as in a
  repeat: `$s[2].x`, under the same every-option, same-type rule (D27).

**Done by #2451** (closing #2450 and #2454). Before it, names inside cases were private: a plain
`$x` gave `w0104`, and `$cc.x` followed the active case whatever the others held, so
`<math>$cc.x+1</math>` could become `h i + 1`. Now:
- **Diagnostics:** a branch with no `x` is **`doenet-w0183`** ("the `<else>` of `cc` has no `x`.
  Give it one, or use a name every case has"). Two tags are **`doenet-w0184`** ("`x` is a
  `<math>` in one case of `cc` and a `<text>` in another"). Both name the reference, which names
  nothing.
- **Since #2458 (D37):** `w0183` is a warning, bare or on a tag, and the reference is missing
  (`＿`). A mix of types is an **error in both forms**: a bare reference the branches declare
  with different types (`w0184`) is an error shown in its place at load, as `<math extend="$x"/>`
  is `e0066`. That makes a type error the same bare or as a tag (REF-1) and decided at load
  (DIAG-7). Decided: mixed types stay an error in both forms.
- **Indexed forms follow the same rule:** `$s[1].x` of a one-pick select, `$s[2].x` of a
  multi-pick one, and `$cc[1].x`.
- **Names after the name are held to it too.** `$h.x`, of a `<group name="h">` in every case,
  resolves only if each branch's `h` declares `x` with one tag.
- **A property after a name of mixed types** is `w0184` as well: `$x.value` with a math `x` in
  one case and a text `x` in another. On a tag, #2447's rule can allow it: `<number
  extend="$x.value"/>` of an `<integer>` and a `<number>` `x`.
- **On a tag** (D37 reverses the first, fourth and fifth items: they become the bare form's
  warning or an info, and a missing tag):
  - a missing `x` is `w0183` at error level;
  - a mix of types is `e0066`;
  - an `x` that can be absent because there's no `<else>` is `e0064`;
  - a composite tag (`<group extend="$x"/>`, `<sort>`, `<shuffle>`) with a mix of types is
    `w0184` at error level, since it would hold whatever the case has. `<sort>` and `<shuffle>`
    were `e0065`;
  - a literal index past what a selector picks, `<math extend="$s[2].x"/>`, is `w0181` at error
    level, as #2447 made it for `$s[2]`.
- **What counts as one pick:** `numToSelect` written as `1` or left out. `numToSelect="01"` picks
  one but keeps its names private. A copy of a select counts only when it writes
  `numToSelect="1"`.
- **An error decided at load stays** through every replacement change of a linked copy (#2454).
  Before, a case that became inactive again replaced it with a blank tag (`NaN`).
- **Integer cases:** `<number extend="$cc.x"/>` of an `<integer>` case now shows the integer's
  value. It used to be `NaN` after the case changed (`verifyReplacementsMatchSpecifiedType`).

**Known violations and gaps:**
- a container reached by a name after an index into a repeat (`$r[1].s.x`) isn't checked at load;
- autocomplete follows the rule since #2469 (closing #2455) and #2522 (closing #2479): it leaves
  out a name some branch lacks or declares with another tag, lists the branch names after
  `$rep[n].`, and offers nothing after an index on what takes none (`$v[1].head.` of a `<vector>` `v`). Left:
  `$ml[1].a` of a `<mathList>`, `$sh[1].a` of a `<shuffle>` and `$vl[1].v.head.` of a
  `<vectorList>` offer a name after an index into a list, though
  `[n]` picks the entry and the runtime gives `＿`;
- `<group extend="$cc.x"/>` going empty after the case changes (B40) was fixed by #2471;
- root names, and so HTML ids, of components in the branches are unchanged: one in an unnamed
  container has none.

Evidence: `T/copying/branch_names.test.ts`; `resolve.test.rs` and `build_resolver.test.rs` in the
Rust resolver.

ADR 0009's rule, accepted as modified above (D13), was:

> A name is visible outside a choice only if every branch declares it, with the same type.

ADR 0009 also bans several forms that main's tests use (D13):
- `extend` of a `select`, `conditionalContent` or `case`. D32 decides a principle in its place (#2409):
  an extend can be bare, named or restyled, but cannot change what a tag makes. Extending a
  `case` stays banned;
- references into a branch from outside, other than interface names;
- positional references into options (`$s[2][1]`), which D27 generalizes;
- a branch-dependent type fed to a typed parent;
- a non-literal `numToSelect`. **Not accepted:** that is a flaw in the cells core, and main's
  tests of it stay binding (COMP-8).

---

## 4. Other composites

- **COMP-12: `<group>` (Tier 1).**
  - A group is its children.
  - `rendered="false"` withholds them, and they return unchanged.
  - Tier 3: that the children are not created until first rendered (`group.test.ts:800`).
- **COMP-13: `<module>` (Tier 1).**
  - A module is a group whose `<moduleAttributes>` are parameters.
  - A **copy** can override them: `<module copy="$m" item="banana"/>`.
  - An **extend** cannot. It shows the same content, linked to the source, and a module
    attribute written on it is an error, `doenet-e0060` (D32, #2409; `module.test.ts:1474`,
    `:1571`). Like a group's extend, it can add children, `hide` or a name.
  - References in a supplied attribute resolve where the copy is written (NAME-4).
  - **`<module copy="$m" …/>` is the pattern for a module defined in `<setup>`** (D33): each use
    is written again, with its own random values. `<module copyWithState="$m"/>` repeats the
    source's draws and reader state (CPY-8); an attribute on it that changes a nested choice
    gives a warning, and the source's choices win.
  - **Known violation:** through 0.7, `copy` repeats the source's draws, so every `<module copy>`
    of one module shows the same values, and an attribute that changes a nested choice shows
    nothing (**[probe]**, `numToSelect="$k"`).
  - Evidence: `module.test.ts:68`, `:539`, `:1606-1910`.
- **COMP-14: `<setup>` (Tier 1).**
  - Its content exists and can be referenced, but is never shown.
  - Evidence: `compositesInTypedContainers.test.ts:130`, `:139`.
- **COMP-15: `<solution>` (Tier 1).**
  - Its content is not sent to the viewer until revealed.
  - Evidence: `solution.test.ts:221`, `:655`, `:692`.
  - Tier 3: that the content is not *created* first (`:50`).

## 5. `extend` and `copy` of composites

| | `extend` | `copy` |
|---|---|---|
| Content | the same as the source (REF-7) | the source's DoenetML pasted (CPY-1) |
| Content attributes (`for`, `to`, `numToSelect`, `condition`) | ignored, with warning w0168 | `to` on a repeat applies; `condition` on a conditionalContent applies to the case its sugar made, and `valueName`/`indexName` apply (#2542) |
| Children written inside | dropped, with warning w0169, except group and module, which append | **added to every iteration** of a repeat (#2212) |
| `hide` on the source | an `extend` of a hidden list or collect is hidden | a bare `$x` of a hidden list, group, repeat, select or conditionalContent is **shown**; of a hidden collect, hidden (D9) |

Each "but" in that table is an inconsistency. [decisions.md](decisions.md) D4 proposes a single
rule:

> A copy is the source's DoenetML pasted, then the attributes written on the copy override it.
> Children written inside are appended after the source's content.

D9 proposes that a reference to a hidden component is always hidden.

Evidence:
- `T/diagnostics/warningsInfos.test.ts:1144-1406`;
- `repeatIterationValues.test.ts:234`;
- `repeat.test.ts:623`;
- `repeatForSequence.test.ts:1491`, `:1523`;
- `select.test.ts:432`, `:2493`;
- `conditionalcontent.test.ts:1213`;
- `listcomponentcollections.test.ts:816`.

## 6. Tier 3 candidates

- **What was built.** Census and type checks: `repeatIterationValues.test.ts:387-468`, the
  `_repeatValueList` assertions and the guard list in `repeatValueLists.test.ts:836-920`,
  `repeatPointLists.test.ts:874`, `listcomponentcollections.test.ts:1263`, `:1283`.
- **Reuse and rebuild heuristics.**
  - `sort.test.ts:1096-1750` checks whether replacements are reused or rebuilt on a reorder,
    including a "more than half moved means rebuild" rule at `:1168`.
  - `compositeCommas.test.tsx:152` pins the exact range array.
- **Saved-state key formats:** `conditionalcontent_case_state.test.ts:385-478`, and the stateId
  prefixes in `shuffle`, `sort` and `collect`.
- **Evaluation order:** `conditionalcontent_case_state.test.ts:188`.
- **Lazy creation:** `group.test.ts:800`, `solution.test.ts:50`.
- **Forms that D13 and D22 ban** (names some branch lacks, or of different types), and the
  tests that assert a plain `$x` from outside finds nothing. #2281's
  `conditionalContentSelectInterfaceNames.test.ts` rewrites several of them:
  - `conditionalcontent.test.ts:272`, `:416`, `:670`, `:865`, `:1030`, `:1064`, `:1139`, `:1213`,
    `:1306`;
  - `select.test.ts:357`, `:432`, `:2897`.

  The tests of a non-literal `numToSelect` (`select.test.ts:283`, `:544`) are not in this list:
  they stay binding (COMP-8).

  PR #2281 already rewrites these in `conditionalContentSelectInterfaceNames.test.ts`.
- **Tests that state their own behavior is undesired:** `select.test.ts:2493`, `:2545`, `:2636`,
  which encode #246.
- **Regression pins for a loop bug:** `repeatForSequence.test.ts:2936`, `:3003` (#2319). They hold
  trivially under "state by index".
- **Known differences between the list and composite forms:** `repeatValueLists.test.ts:177`,
  `repeatPointLists.test.ts:271` (#2229, #2255).
- **Crash regressions** (`conditionalcontent.test.ts:1651`, `:1721`, `repeat.test.ts:2522-2609`):
  keep them only as "loads without error" smoke tests.

## 7. Coverage gaps

- Typed containers beyond `<math>` and `<numberList>`, and commas in math for repeat, select,
  collect and sequence.
- Iteration state when items change identity or `exclude` changes.
- A select or shuffle inside a case, and nested choices: a case inside a case, or a case inside a
  repeat inside a case.
- Attributes on a copy of a composite (`condition`, `valueName`).
- The extend warnings for collect, sort, shuffle, selectFromSequence and conditionalContent.
- The meaning of `fixed="false"` on a repeat is not documented on the reference pages (#2229).
