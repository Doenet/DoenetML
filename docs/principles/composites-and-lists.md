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
the samplers and every other choosing tag choose once, from the document's variant. **Changing a
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

### SEL: no variant is broken by a selection (Tier 1; D39)
Every potential variant, not only the ones today's algorithm makes, has selections that satisfy
what the author wrote. If the DoenetML can't guarantee that, every variant has an error saying
so (DIAG-7). Checking today's variants is a regression aid, never the guarantee.

- **SEL-1: what decides a selection comes from the DoenetML and the variant alone.** Its
  parameters (`numToSelect`, ranges, `step`, `exclude`, `withReplacement`, `coprime`, excluded
  combinations, weights, `selectForVariants`, the options) may reference other selections and
  fixed content (`exclude="$a"` keeps two numbers apart). A reference that reaches anything the
  reader can change is an error at load: an input (even its prefill), an answer, a draggable
  component or a value one depends on (`a` in `<point>($a, 2)</point>`), a target of
  `bindValueTo`, `updateValue` or another action, and anything reading these.
- **SEL-2: a selection never fails by chance.** If a valid selection exists, the select finds
  one, drawing among valid selections rather than retrying with a limit. Which values a variant
  gets may change for this.
- **SEL-3: feasibility is proven at load, over every value the parameters can take.** From the
  parameters' ranges, not by trying variants. `to="$a" numToSelect="3"` is fine when `a` ranges
  over 5..10, and an error in every variant when `a` can be 1, naming the value.
- **SEL-4: a parameter is in an analysable form:** a literal, a reference with a known range (a
  selection, a literal `<number>`), and `+ − ×`, integer division, `min`, `max`, `abs` of these.
  A `<number>` or `<integer>` whose content is in these forms counts too, so
  `<number name="m">$a + 2</number>` and `numToSelect="$m"` is fine; an error there names the
  `<number>` and the part that isn't analysable. Anything else is an error.
- **SEL-5: selections depending on each other form an order**, with no cycle (`e0005`), and
  ranges flow forward through it.
- **SEL-6: every option, case and iteration template is checked, picked or not:** its errors and
  its warnings, each at its line.

Outside the guarantee: valid values that make later content degenerate (a random 0 in a
denominator), which authors exclude; constraints on derived values such as `$b^2 - 4$a$c > 0`, a
wanted future extension; saved variants from another version of the DoenetML; and continuous
samplers.

**Known violations** (D39 is not implemented):
- a parameter may come from an input, or from a value a reader can change;
- whether an iteration made later is seeded by its position, so its choice doesn't depend on the
  order iterations were made (SEL-3), is not tested;
- a failure a value decides is a missing selection with an info in some variants (#2468): `to="$a"`
  with a random `a`, `e0032` at info level;
- `coprime` draws that find nothing (`i0057`) and the fluke codes `e0052`/`e0053` fail by chance;
- a cycle through a name every option of a one-pick `<select>` declares stops the variant that
  picks it (#2473);
- warnings in unpicked options and cases are not reported;
- a `copyWithState` of a sampler doesn't keep its draws through a reload (#2477, COMP-8).

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

A known limitation: kept state can go stale after an outside change, for example an answer still
marked "just submitted" (#2325).

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
- autocomplete follows the rule since #2469 (closing #2455), and leaves out a name some branch
  lacks or declares with another tag. Left: `$rep[n].` doesn't list the branch names of a
  container in the repeat, and `$v[1].head.` of a plain vector offers properties (#2479);
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
| Content attributes (`for`, `to`, `numToSelect`, `condition`) | ignored, with warning w0168 | `to` on a repeat applies; **`condition` on a conditionalContent is ignored** (#2217, **[probe]**); `valueName` misreads (#2211) |
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
