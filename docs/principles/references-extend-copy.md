# References, `extend` and `copy`

This is the central document. It covers how a name finds its referent, what a bare reference,
an `extend` and a `copy` each mean, and what happens when they are nested.

Paths: `T/` is `packages/doenetml-worker-javascript/src/test/`, `W/` is
`packages/doenetml-worker-javascript/src/`, and `RS/` is
`packages/doenetml-worker-rust/lib-doenetml-core/src/dast/ref_resolve/`. Tiers are defined in the
[README](README.md).

## The three forms in one picture

| Form | What it is | State | References inside the source |
|---|---|---|---|
| `$x` | x itself, shown again | shared with x | keep the meaning they have in x |
| `<T extend="$x" …/>` | x itself, with the changes written on it | shared with x | keep the meaning they have in x |
| `<T copy="$x" …/>` | x's DoenetML written again here: no reader state, its own random choices | its own, starting as written | keep the meaning they have in x (CPY-6) |
| `<T copyWithState="$x" …/>` | x's DoenetML pasted here, with the reader's current state and x's random choices | its own, starting from x's | keep the meaning they have in x (CPY-6) |

`copy` and `copyWithState` are D33's two forms. Through 0.7, `copy` meant what `copyWithState`
means now. Below, "a copy" means either form unless a principle names one.

Everything below refines this table.

---

## 1. Name resolution

### NAME-1: nearest match wins; a tie is an error, not a guess (Tier 1)
`$x` means the `x` in the nearest enclosing scope that contains one. If that scope contains two,
the reference is ambiguous: it reports `doenet-w0105` "Multiple referents" and is missing, shown
as a blank `＿` (VAL-5, D37, #2458).

```xml
<section><number name="n">10</number><p>$n</p></section>   <!-- 10 -->
<section><number name="n">20</number></section>
<p>$n</p>                                                  <!-- ambiguous -->
```

Sub-rules. All three are Tier 2: they rarely matter, but they keep the rule total.
- A reference can always name its own ancestor, even where the name is ambiguous elsewhere.
  For example, `$p.creditAchieved` inside `<problem name="p">` works with a second `p` in the
  section (`RS/resolve.test.rs` `resolve_to_parent_in_ambiguous_case`).
- An ancestor's name beats a descendant with the same name
  (`parent_name_supersedes_unique_descendant`).
- Children of `repeat`, `repeatForSequence` and the options of a select with several picks are
  invisible from outside. They are reached only through the container: `$r[2].x`, `$s[2].x`
  (`elements_with_children_invisible_to_their_grandparents`, `RS/resolve.rs:64`). The privacy
  is needed, because these make several instances of a name.
  - **Names in a `case` or `else`, or in the options of a one-pick select, are visible** when
    every branch declares them with the same type. If a branch lacks the name, the reference
    names nothing (a blank, VAL-5), with a warning. If the types differ, it is an error, bare or
    on a tag (COMP-11; D13, D22). Branches of one choice don't make a name ambiguous.
  - Done by #2451: `Ref::Branches` in the resolver merges the same name in sibling branches
    into one entry, and an `x` beside the container still makes it ambiguous.

Evidence:
- `packages/docs-nextra/content/concepts/references.mdx` ("Resolving to the nearest match",
  "When a reference is ambiguous");
- `T/copying/extend_references.test.ts:2908` "references to parent";
- `T/diagnostics/diagnosticCodes.test.ts` (w0104, w0105).

Code: Rust resolver, `RS/resolve.rs:170` and `search_parents` at `:462`.

### NAME-2: paths walk down through names, copies and indices (Tier 1)
- `$a.b` is the `b` inside `a`.
- `$a[2]` is the second item that `a` produces.
- `$a[2].b[3]` chains the two.
- Whatever part of the path does not match a name is read as a property.

An index is read live and rounded like an integer: `$l[$i]` follows `i`. An index of 0, a
negative index, or one past the end names nothing. Since #2410 (B17), an index below 1 on
something that exists gives `doenet-w0104` quoting the whole reference, literal or dynamic. Past
the end is silent while the length can change (#1499). An index that cannot apply, such as
`$n.value[1]`, and an index into a scalar (`$ms[1]`, `$n[1]`), give `doenet-w0100` and name
nothing (#2431). List entries (#2431) and function references (#2432) follow the same rule.
A reference that names nothing is missing, shown as `＿`, bare or as a tag (VAL-5, D37, #2458).

Evidence:
- `T/copying/extend_references.test.ts`: `:2401` "extending repetitively" (`$g12.Pa` four levels
  down), `:6408` "recursive extends", `:5773` "dot and array notation, recurse to subnames of
  composite replacements".
- `T/tagSpecific/repeatForSequence.test.ts:156`: nested repeats, `$a[2].b[3].c` and the
  positional `$a[2][1][3]`. Under D27 the positional form becomes `$a[2][3]`.
- `T/copying/value_references.test.ts`: `:286` "an index into a list resolves itself and
  re-resolves as the index changes", and `:333`, rounding 2.6→3, 1.5→2, 4.4→4, −1 → nothing.

Code: `RS/resolve.rs:310-330` (`unresolvedPath`); `W/core/dependencies/refResolutionDependencies.ts`
finishes the path after composites expand.

**What an index selects (D27, decided; #2420, #2421).**
- **Instances a tag produces:** entries of a list or array property, iterations of a repeat, and
  picks of a select, `selectFromSequence`, `shuffle`, `sort` or `collect`.
- **Entries of a value:** the coordinates of a point, vector or coords; the entries of a math
  whose value is a tuple or vector; and the rows (as 1×n matrices) and entries of a matrix. An
  input follows its value's type, and `$x.value[i]` is the same as `$x[i]`. A scalar has no
  entries. A `<spreadsheet>` is indexed through `.cells`.
- **Never a container's children.** `$g[2]` on a group, `$s[1][2]` into a picked option,
  `$cc[1][2]` into a case and `$r[1][2]` into an iteration with several components name nothing,
  with a warning and a blank, like any reference that names nothing (D37). The child is reached
  by name instead: `$s[1].x`. There is no deprecated form (D27 revised). The warning is
  `doenet-w0188`, which says how many components the holder has and suggests the name to write
  (`$g.b`, or "give it a name").
- **Pass-through: one component stands for its holder.** A `<group>` (written by the author, or
  an extend or copy of one) and an instance (a pick, a shown case, an iteration, or an extend or
  copy of one) whose whole content is one component pass the next index to it. That component
  decides what the index means: an entry of a list or of a value, an instance, or nothing with a
  warning (`w0100` for a scalar, `w0180` for a `<p>`). So with `<group name="g">$nl</group>`,
  `$g[2]` is the list's second entry; with `<option><math>(1,2,3)</math></option>`, `$s[1][2]` is
  `2`; nested repeats take one index per level (`$r[1][2]` is iteration 2 of the inner repeat in
  iteration 1).
  - "One component" ignores blank text, comments and a `<setup>`; other text counts. It is
    decided at load.
  - A composite inside passes the index to its own instances: with `<group>$cc</group>`, `$g[1]`
    is the shown case.
  - A group stands for its content for a tag and a property as well (`<math extend="$g"/>`,
    `$g.value`); a `<span>`, `<p>` or `<div>` does not (`e0065`, `w0104`).
  - A further index goes on into what the first reached: `$g[2][1]` of
    `<group name="g">$ml</group>` is `$ml[2][1]`.
  - A reference as the one component (`<group>$x</group>`) stands for what it makes: a list or a
    composite of instances takes the index among its instances; one component takes it; several
    name nothing (`w0188`, counting what it made, so `<group>$g</group>` of a group of four says
    4). A value reference passes the index to its value (`$g[2]` of `<group>$m</group>` is
    `$m[2]`).
  - D27 revised again (#2517). **Done by #2518.**

**Done by #2518** (closing #2517, #2166, #1942): the resolver decides it once, from the group's
children, for every group (`IndexKind::of_node` / `of_content` in `RS/index_resolutions.rs`): at
load for an authored group, and when made for a group the worker adds. A group that extends or
copies something waits (`Pending`) until its content is made. For a reference as the one
component, the worker says what it made (`referenceContentOf` in `W/utils/indexInstances.ts`)
and updates it as that changes. `w0179` is retired, never released. #2166's leak is gone: an
index after a group is never passed to several items as a property. #1942's documents no longer
trap the resolver.

Root names follow a pass-through only into a component that produces instances. A math or a
nested group keeps the name its place gives it (`g:1`), and an unnamed component in an iteration
keeps `r:1:2`. Some renderer ids changed: the iterations of a repeat that is a group's whole
content can be `g:1` (was `r:1`). The id is also the `rootName` an answer's `submitted` event
reports (Tier 3).

Known violations (#2520):
- options or cases that differ, some holding one component and some several, aren't warned of at
  load, so what `$s[1][2]` means depends on the branch shown;
- an index past the end of a `<conditionalContent>`'s shown cases is applied as a property to what
  the case holds (`$cc[2]` is `7, 9` for a case holding `(6,7)` and `(8,9)`), as #2166 was for a
  group;
- through a reference to a group holding a repeat, an index past the iterations is silent, not
  `w0181`; `$s[1][1]` of `<option>$g</option>` (`g` holding one scalar) is `w0100` at info level,
  where `<option>$m</option>` warns; an extend of an iteration holding `$cc.x` doesn't follow the
  case switching; `w0188`'s suggestion can name a `<setup>`.

Done by #2424 (instances) and #2431 (values). Diagnostics, each quoting what was written:
- **`doenet-w0188`:** an index after a group or instance that doesn't hold one component (#2518;
  it replaced the deprecation `w0179`, which gave the child);
- **`doenet-w0180`:** an index on something that takes none (`$sec[2]`);
- **`doenet-w0181`:** past the end of a repeat, select, `selectFromSequence`, shuffle, sort or
  collect that stays a composite ("the `<select>` made only 2 picks"). Past the end of a list is
  silent (#1499);
- **`doenet-w0182`:** `$ss[1]` of a spreadsheet, pointing to `.cells`.

Pass-through took its new meaning with no compatibility mode: `$a[2][1][3]` became `$a[2][3]`.
Root names follow it (`r:1:2`).

Evidence: `T/copying/indexSelectsInstances.test.ts`, `T/copying/index_into_value.test.ts`.

**Done by #2472** (closing #2438; B26, B27, B28, B34):
- an extend or copy of an iteration indexes as the iteration: `$g[2]` of
  `<group name="g" extend="$r[1]"/>` is `$r[1][2]`, unless the group adds children;
- an index past an array's dimensions names nothing with `w0100` (`$P[1][1]`, `$M[1][2][3]`,
  `$poly.vertices[1][2][1]`). A math value is indexed at every level, so `$m[1][2]` of
  `((1,2),(3,4))` is `2`;
- list entries are indexed the same way, and `$l.value[2]` is `$l[2]`. `$l.coords[1]` is `＿` with
  `w0100`, as `$P.coords[1]` is;
- an index never reaches the `<setup>` a repeat adds;
- an index into a scalar entry of a `<mathList>` is missing with `w0100`, and refuses a write;
- an index past the content of an iteration that holds something other than one list or repeat
  is the deprecated child index, `w0104` (it used to be silent). Since #2518 it is `w0188`, or
  passes through when the iteration holds one component.

**Done by #2518** (closing #2478): `$nl[2][1]` of a `<numberList>`, `<textList>` or
`<booleanList>` entry, an extra index on an array entry named directly (`$line.point1[2][1]`),
`$pl[2].xs[1][1]`, and an index into a selector's or sampler's pick give `w0100`.
`$pl[2].value[$one]` reads as `$pl[2].value[1]`. `<group extend="$r[1]"/>` of an iteration
missing at load follows it as it appears. Past the end, `$nl[4][1]` gives `w0100` (the entry type
decides), while `$ml[4][1]` stays silent. An alias of an array's first entry still selects among
the entries (`$P.x[2]`, `$P.x1[2]` is `x2`, `$ode.numericalSolution[2]`), as before.

Known violations:
- `w0181` is a warning even when the count comes from a value that can change, such as a repeat
  of `length="$n"`, which DIAG-2 makes an info (#2422).

Cost (Tier 3): `$m[i]` of a `<math>` is now a copy rather than a value reference, one more
component per reference (#2431).

Limits:
- **Deep property chains** (`$l.points[1].coords`, `$l.points[1].xs[1]`) are not supported
  today. About 20 assertions are commented out with `XXX: restore` at
  `T/copying/extend_references.test.ts:4703`. Whether they are a guarantee is an open question
  ([decisions.md](decisions.md), D19).

### NAME-3: names inside a copy or a repeat iteration are private (Tier 1)
A copy brings its content's names into existence only beneath the copy's own name. A bare `$h`
written next to `<section copy="$S" name="S2"/>` still means `S.h`, and makes nothing
ambiguous. Reach the copy's `h` as `$S2.h`.

- **[probe]** A bare `$h` next to one or two copies or extends of `S` resolves to `S.h` with no
  warning. Typing into `S2.h` does not change it.
- **Evidence:** the Rust test `add_nodes_does_not_make_previous_resolution_ambiguous`
  (`RS/build_resolver.test.rs:89`), and the docs example "References in a copy's attributes".
- **JavaScript test:** `T/copying/unlinked copy.test.ts` "names inside a copy are reached only
  through the copy's own name (NAME-3)", added by #2367. It checks that:
  - `$R.h` of an unnamed `<p copy>` inside `<section name="R">` names nothing;
  - `$R2.P2.h` and `$Q2.h` (a copy of a copy) resolve;
  - a bare `$h` beside the copies stays the original's.
- **Lists.** #2367 also brings copies of lists into line with this rule:
  - the source list's name no longer leaks into the copy (`$c.l` and `$c2.c1` name nothing);
  - `$c2.h` works for a copy of a copy;
  - `$c.h` works when written before the copy.

### NAME-4: a reference resolves where it is written, among what is written (Tier 1; D6, done by #2401)
A reference's first name resolves only to components written in the DoenetML. Content a copy,
extend, repeat iteration or external document makes is reached only through the name of the
component that made it. This holds wherever the reference is, with no rule specific to copies:
- **beside a copy:** a bare `$h` next to `<section copy="$S" name="S2"/>` means `S.h` (NAME-3);
- **in an attribute on a copy, extend or `<module copy>`:** the attribute resolves as any
  attribute does. It sees the children written inside the tag, but not the copied content. In
  `<section copy="$orig" hide="$h"><boolean name="h">true</boolean></section>`, `$h` is the inner
  `h`. `xmin="$xmin"` on `<module copy="$m">` resolves outside the copy, because the copied
  `<moduleAttributes>` are not written there. The module's *definition* is written, though: a
  `<module name="g">` at the document root puts its `<number name="xmin">` in the same scope as
  an outer `xmin`, so `$xmin` there is ambiguous (`w0105`), bare or in the copy's attribute.
  Write the copy where the intended `xmin` is nearer (#2470, closing #2403; D6 kept);
- **in a child added inside a copy:** it does not see the copied content. `$h` resolves as it
  would beside the copy, and `$S2.h` reaches the copied `h`.

Before #2401, attributes on a copy resolved from the copy's parent, skipping even the children
written inside the tag, and a child added inside a copy saw the copied content first.

**An attribute on a module's own definition** sees what is written inside the module.
`<module name="g" xmin="$a">` with a `<number name="a">` inside it finds that `a`. When the attribute
names the module's own attribute (`xmin="$xmin"`), it would depend on itself, and gives error
`doenet-e0055`. The module attribute keeps its own value, and the rest of the document renders.
Two forms are still a circular dependency that stops the document (D14): a self-reference
through another component (`xmin="$p"` with `<number name="p">$xmin</number>` inside), and
`xmin="$m4.xmin"` on `<module copy="$g" name="m4">`.

- **Docs:** `concepts/references.mdx` "References in a copy's attributes".
- **Tests:**
  - `T/copying/extend_references.test.ts`, "a reference resolves where it is written, among what
    is written" (#2401), and "references in a copy's attributes resolve where the copy is
    written";
  - `T/tagSpecific/module.test.ts`, "sees what is written inside the module", "refers to the
    module's own attribute", and the NAME-4 tests before them;
  - Rust: `copied_content_is_found_only_through_the_copy` (`RS/build_resolver.test.rs`).
- **Code:** the resolver records names that reach copied content (`copied_names`) and skips them
  in `search_parents`, so they are reached only by a path step through the copy's name.
  `ModuleAttributes.js` gives a module attribute's reference the `<moduleAttributes>` as its
  origin.

**Names in the arguments of a function reference that names nothing (decided, D40; #2489).** In
`$$f(<math name="m">x</math>)` where `f` names nothing, `m` is still made, as if written in a
`<setup>`: `$m` is `x`, and an outer `m` in the same scope makes it ambiguous (`w0105`), as a
`<setup>` name would. **Done by #2518** (closing #2489): `ref_expand.rs` puts the arguments in a
`<setup>`, and `compactify`'s redirect of their names is gone. Accepted consequences: that setup
takes a position among its parent's children, so a stateful sibling after it gets a new
`stateId` (saved state from before doesn't reload into it), and a choice in the arguments counts
toward the document's variants, as one in a written `<setup>` does.

### NAME-5: an attribute resolves as if it were written in a child of its component (Tier 2)
The search order is NAME-1's nearest scope, from a child and from an attribute alike:
1. the component's written descendants;
2. the component's own name, ahead of a same-named sibling;
3. outward.

In `<p hide="$h"><boolean name="h"/></p>`, `$h` is the inner `h`. In
`<point name="P" styleNumber="$P.x">(2, <number name="P">3</number>)</point>`, `$P` is the inner
number. Tested on ordinary elements and on copies by #2401.

### NAME-6: external content is sealed (Tier 1)
- Names inside content loaded with `copy="doenet:…"` are invisible to the document, and the
  document's names are invisible to it.
- You reach in by naming each document's root in turn: `$s.s1.s2.p3`. Each path part crosses
  at most one document boundary.

This is the one place where "pasted DoenetML" deliberately does not hold, and that is
principled: shared content is a sealed scope.

Evidence: `T/copying/external_references.test.ts`:
- `:97`, three source documents;
- `:159`, fails without the parent name;
- `:221`, local names supersede external ones;
- `:272`, external content cannot see local names;
- `:324`, `:364`, `:409`, extend and copy of external content.

### NAME-7: cycles terminate and are reported (Tier 1; how they are reported is Tier 3)
These are reported as circular dependencies, and loading never hangs:
- a component that extends itself or its ancestor;
- a self-referential attribute;
- mutually recursive texts.

Today there are two failure modes ([decisions.md](decisions.md), D14):
- Composite cycles report a diagnostic, and the rest of the document loads.
- State-variable cycles throw. The whole document fails to load, and
  `<p name="p" copy="$p"/>` reports an internal `<_copy>` (**[probe]**).

A copy of a component that references itself loads too (#2412, closing #2405, B15):
`<section copy="$S"/>` of `<section name="S"><p>[$S]</p></section>` reports `doenet-e0005` and
renders, and a copy of a point whose label holds `$P` shows its own coordinates.

A loop among composites that keep re-queuing each other is reported too (#2425, B21): the
composites on the loop get `doenet-e0005` at their positions and stop updating, and the rest
renders.

**Done by #2471** (closing #2439, #2453, #2430, #387): a reference cycle through what is
written is found at load, over every branch and option, the same in every variant. Each
reference on it is `doenet-e0005` where it is written, and the rest renders. An edge is a
reference to a whole component, an index into a `<math>`, a composite or branch to its children,
and a tag made from its children (math, text, number, boolean, label, `m`, the lists, inline
containers). A property, an attribute, an index into a composite, list or scalar, `<setup>`, and
a component's own `<label>` are not edges, so `$P` in a point's label stays allowed (#1384).
B29 (`<math name="m">(1, $m[2])</math>`), B32, B40, `<math name="z" extend="$z"/>` and two maths
reading each other are now `e0005` at load.

**Done by #2513** (closing #2473): the edges `W/utils/dast/referenceCycles.ts` adds, each an
`e0005` at load at every reference on the cycle, in every branch and variant:
- a property made from what is written (`<number name="n">$n.value</number>`), from the table
  `PROPERTIES_READ`. A property not made from it (`$x.hide`) is no edge;
- an input's starting value (`<mathInput name="mi" prefill="$mi.value"/>`, `bindValueTo`,
  `preselectChoice`, `initialValue`; `INPUTS`);
- an index into a composite or list of values reads what it is made from: its attributes
  (`<sequence name="a" from="1" length="$a[1]"/>`), a case's `condition` and an option's
  `selectWeight` (`MADE_FROM_ATTRIBUTES`), but not what is written in it, so
  `<group name="g">…$g[1]…</group>` stays valid;
- an index component, an index into a `<mathList>`/`<numberList>`, and an index into a tag
  written with `extend` (no longer an internal error);
- a name every branch declares (`branchReads`). A reference inside a branch reads only its own
  branch's names, so two cases reading each other's names stay valid;
- a tag whose content is its children (`<p>`, `<div>`, `<section>`, `<li>`, `<title>`;
  `CONTENT_FROM_CHILDREN`). A point's or input's `<label>` still isn't, so `$P` there stays
  allowed;
- a `copy` or `copyWithState` in what it is of becomes the `_error` at load.

A section whose title is on a cycle shows its default title. A v0.6 document holding one of these
cycles in a case not shown keeps its `<copy>` tags in the converter.

Known violations:
- not found at load, still reported or stopping the document when reached (#2515): a property or
  attribute not in the tables, an attribute of a tag that is neither a composite nor an input
  (`<math simplify="$m=1">`), `$$f($n)` through an `<evaluate>`; an index into a `<repeat>` in
  its own template, or an index followed by a name (`to="$r[1].v"`); a reference in a point's or
  input's `<label>`; `<textList name="l">a $l[1]</textList>`; `$a.currentResponse` inside answer
  `a`'s `<when>`; a cycle through both an input's `prefill` and an index into a list holding it;
  a `<case>`'s `condition` reading a name its own `<conditionalContent>` declares; and an index
  into a `<shuffle>` or `<sort>` in its own children;
- a loop where no composite can be singled out still stops the document (#2425).

Tests: `T/diagnostics/circularReferences.test.ts:27-67` (asserts `rejects.toThrow`), `:115-175`,
`:755`. A reference to a point inside its own label is allowed and means "my value" (#1384).

---

## 2. Bare references and `extend`

### REF-0: a tag you write makes that tag (Tier 1; D36, D37)
In a document without errors, `<T extend="$x" …>…</T>` always makes exactly one T, whatever x
holds. The same holds for `copy` and `copyWithState`. An author who writes `<math>` can rely on
a math: `$x + 1`, `$x.value` and an answer that checks `$x` all read one.

**The T can be missing** (D37, VAL-5). A tag whose source is missing is itself missing, whatever
it adds: its own children and attributes don't make it something else. A missing tag shows `＿`
inline and is not drawn in a graph. It is not `<T/>`: `<text/>` is still `""`, `<number/>` `NaN`,
`<boolean/>` `false`, `<point/>` (0, 0).

| Written | Shows while the source is missing |
|---|---|
| `<math extend="$nothing"/>`, `<math extend="$nothing">+1</math>` | `＿` |
| `<text extend="$nothing">hi</text>`, `<p extend="$nothing">hi</p>` | `＿` |
| `<mathInput extend="$nothing"/>` | `＿`, with no input box |
| `<point extend="$nothing"/>` in a graph | not drawn |
| `<p extend="$r[$i]">note</p>` while the index names nothing | `＿`, until it names an iteration |

A name on a missing tag reads it as missing. `hide` still hides it. A missing input has no box,
so the reader can't type into something a link will later replace.

**Type is decided at load; presence is not required.** Whether a T can be made from x is decided
from the DoenetML alone. It is an error only when the DoenetML can't guarantee *the type*: an
unrelated pair, mixed types, or a composite that can hold several components (REF-5). When x may
hold nothing, the tag is missing while it does:

| Cause | Diagnostic | While it lasts |
|---|---|---|
| no referent, an ambiguous name, a property the type doesn't have, a literal index that names nothing, a name D22's every-branch rule rejects | the same warning as the bare reference (`w0104`, `w0105`, `w0181`, `w0183`) | missing, for good |
| no case active, a `<conditionalContent>` with no `<else>`, a case or option holding nothing | info | missing while no case holds one |
| an index that names nothing because of its value | info `i0054` | missing until it names one |
| a value that does not convert (`<point extend="$mi"/>` while mi is not a tuple) | info `i0053` | missing until it converts |

So the bare form and the tag report the same diagnostics, at the same level (REF-1).

**Done by #2458** (closing #2456):
- a missing tag is a component of its type, with its own attributes (so `hide` hides it) and none
  of its children, holding `<T/>`'s value with `valueMissing` true. It is drawn by the shared
  `_blank` renderer. A composite or list tag whose source is missing (`<group extend="$nothing"/>`,
  `<numberList extend="$nothing"/>`) is a `_missing`, one blank;
- on a tag, `w0104`, `w0105`, `w0181` and `w0183` are warnings with the tag missing. The `noElse`
  reason of `e0064` is gone. A `<conditionalContent>` with no `<else>`, or a branch holding
  nothing, gives a missing tag with the new info **`doenet-i0055`** while no case is true;
- `i0053` and `i0054` say the tag is missing. A tag's `i0054` is left out where a warning or
  error at the tag, or in its `extend`/`copy` reference, already says why.

**Known violations and gaps:**
- **A bare reference's index info is postponed to the new core (#2281).** A bare `$r[$i]` that
  names nothing shows `＿` but reports as before D37: silent past the end, a `w0104` for a
  dynamic index below 1 that stays after the index changes, and `w0181` past what a composite
  made, which can go stale. Deciding its info again after every update made a 1000-iteration
  repeat with 2000 bare indexed references about 30 ms slower per update, so it was taken out.
  The tag form has its `i0054`;
- **fixed by #2524:** a list tag over an index that names nothing at run time holds one blank
  entry, and a list keeps a missing entry as a blank (`<mathList>$l[5] 2</mathList>` is `＿, 2`);
- **fixed by #2524** (closing #2244): a list extend through a path resolved only at run time
  (`<mathList extend="$r[1].ml"/>`) follows the list it names, and its `fixed`;
- a `<group>` tag of an index that names nothing (`<group extend="$r[$i]"/>`) shows nothing with
  `w0181`/`w0104`. It is not a scalar tag, so it is not made missing;
- a tag of an iteration has its `i0054` until the iteration is made, but not again once the
  repeat shrinks past it: the iteration is withheld, and the tag is missing with no info;
- a `<group>` holding a `<conditionalContent>` with no `<else>`, as a scalar tag, is missing
  without `i0055`, and so is a tag of a case or option written empty;
- **a deliberate exception:** a tag of an array entry that has no value yet but can be written
  (`<text extend="$ci.selectedValue"/>` before a choice, `<feedback extend="$award.feedback"/>`)
  is not missing, because it is linked to the entry so that a write reaches it. The bare
  `$ci.selectedValue` is `＿`;
- a missing `<label>` used as a point's or input's label shows `""`, and a bare reference to a
  missing `<label>` reads `""`, since it is a copy rather than a value reference;
- an entry of `_repeatValueList` (a repeat whose iteration is one `<number>`) does not carry
  missingness, so `$r[1].m.value` of a missing `m` reads `NaN`;
- `<group><group/><math/></group>`, one component beside a child that holds nothing, is not
  decided at load;
- B22 (a nested `<conditionalContent>` or `<select>`, or a component reached through a `_copy`)
  was fixed by #2484: the one component a composite holds is found through references.

History: #2447 (closing #2445) implemented D36, deciding at load and making a missing referent on
a tag an error. D37 kept the load-time type check and reversed the errors for missing (#2458).

### REF-1: `$x` is shorthand for the unadorned `extend` (Tier 1 for the meaning, Tier 2 for exact parity)
`$x` means `<T extend="$x"/>`, where T is the referent's own tag. Write the `extend` out only to
change the type, or to add a name, attributes or children.

The equivalence holds both ways, missing included (D37, #2458). With no referent, `$m` and
`<math extend="$m"/>` are both a blank, with the same warning. **Known violation:** an index that
names nothing has `i0054` on a tag but not bare (REF-0; postponed to the new core).

The two forms are built the same way, so they behave the same in every container. That
includes `fixed` containers, `<math>…+1</math>` and `<text>…!</text>`, and holds before and after
the source is hidden.

Evidence:
- `T/copying/extend_parity.test.ts:52` "are made and shown the same way": 7 references ×
  4 containers;
- #2233.

Code: `packages/doenetml-worker-rust/lib-doenetml-core/src/dast/ref_expand.rs:43-91` turns bare
into extend. `W/utils/dast/valueReferences.ts:780` `unadornedExtendType` plans both the same way.

Exceptions:
- An extend of a `case`, `else` or `option` is an error, bare `$c` included (D32, REF-7). Such a
  part means something only inside the tag that chooses it.
- An extend stops being bare-equivalent as soon as it has a name, an attribute, children or a
  different type.
- A name alone already changes the click identity (REF-9).

### REF-1a: a bare reference to an input is the input's value (Tier 1)
`$mi` is the math the reader entered, not a second input. `<mathInput extend="$mi"/>` gives a
second input tied to the first. So for these components, a bare reference and the unadorned
extend differ.

**[probe]** `<p>$mi $ti $bi $s</p>` (a mathInput, a textInput, a booleanInput and a slider)
holds four value references. `<p><mathInput extend="$mi"/></p>` holds a `mathInput`.

The mechanism is `variableForImplicitProp` on the referent's class
(`W/components/abstract/Copy.js:493-595`). An implicit prop is used unless `createComponentOfType`
names the referent's own type, which the written-out extend does.
- **Classes that read as a different type:** every input (`Input.js`, `MathInput`, `TextInput`,
  `BooleanInput`, `ChoiceInput`, `Slider`, `MatrixInput`, `FractionInput`, `CodeEditor`,
  `SubsetOfRealsInput`, `OrbitalDiagramInput`), `Answer` (`submittedResponses`), `Award`
  (`awarded`) and `Choice` (`submitted`).
- **Classes where it is only an optimization:** `Math`, `Text`, `Number`, `Boolean` and `Label`
  read their own `value`, which gives the same type.

Evidence: `T/copying/extend_references.test.ts:6040` "implicitProp from an input", `:6172`
"references of composites ignore implicitProp", and `:6209` (`$repeat[1]` gives an input, while
`$repeat[1].mi` gives a math).

The input case is a long-standing author idiom. The answer, award and choice cases are less
obvious, and none is documented as a rule (D21).

Tier 3: that both forms are built as a `_ref` value reference is an implementation choice
(the `_ref` assertions in `extend_parity.test.ts` and `extend_references.test.ts`).

### REF-2: a reference is linked in both directions (Tier 1)
`$x` and `<T extend="$x"/>` show x's current state. Typing into, dragging or `updateValue` on
the reference changes x.

Evidence:
- `T/copying/unlinked copy.test.ts:285` "copy no link, base test": `updateValue` on an extend
  doubles the source.
- `T/copying/extend_references.test.ts`:
  - `:3320` "add children with extend": dragging `g1a.P1` moves `P1`;
  - `:511` "extend props of extend still updatable".
- Per-component "all updatable with copies" tests, e.g. `T/tagSpecific/circle.test.ts:5099`.
- **[probe]** `<point name="pv" extend="$v"/>` of a vector: dragging `pv` changes `v`.

Code: shadowing in `W/core/StateVariableDefinitionFactory.ts:496-800`. Writes go to the shadow
source through `W/core/EssentialValueWriter.ts`.

### REF-3: an attribute written on an extend replaces the source's; the rest are inherited (Tier 1)
- The extend's `name` is never inherited.
- **A reference that names a `<label>` never takes its `for`** (#2529, decided). `$l`, `<label
  extend="$l"/>`, `<label copy="$l"/>`, `$g.l` and `$ti.label` show the label again without
  becoming a second label of the input it is `for`. Like `name`, `for` says what the label is,
  not what it shows. A `for` written on the reference itself applies. A label copied because it
  is inside what a reference names keeps its `for` (`$g` of a group holding it, `$r[1]`), so
  `$g` agrees with `<group extend="$g"/>` (REF-1). The list of attributes a reference never
  takes from what it names: `name`, `for` (of a label named directly) and `labelIsName`
  (CTX-9).
- Along a chain of extends, each link's own attribute wins.

**[probe]**
```xml
<math name="m" hide="$h" displayDigits="2">1.2345</math>
<math name="e"  extend="$m" displayDigits="4"/>   <!-- 1.235, hides with h -->
<math name="e2" extend="$m" hide="false"/>        <!-- shown even when h is true -->
```

Evidence:
- `T/copying/attribute_values.test.ts:33` "an attribute written on an extend beats the one it
  would take from the referent";
- `:72` "along a chain of extends … each link's own attribute wins";
- `T/copying/extend_references.test.ts:86` "extend overwrites properties".
- The same pattern is tested ad hoc in about 15 tag files:
  - `angle.test.ts:1381`, `graph.test.ts:2148`, `line.test.ts:5630`;
  - `circle.test.ts:5469`, `boolean.test.ts:1604`, `hint.test.ts:103`, `label.test.ts:1401`;
  - `functionTag.test.ts:645` and four more in that file;
  - `math.test.ts:2759`, `:3140`.

Code: `W/components/abstract/Copy.js:1697-1745`. Extends also use per-variable
`dontRecurseToShadowsIfHaveAttribute` lists.

- **REF-3a, alternative pairs (Tier 2).** When an attribute has an alternative spelling
  (`displayDigits`/`displayDecimals`, `variable`/`variables`, `derivVariable(s)`), writing either
  one on a reference replaces both of the source's.
  - Tests: `T/copying/unlinked copy.test.ts:2504`, which covers extend, copy, a copy of a prop and
    a copy of a list entry.
  - Implemented twice: `replacesOnReference` for copies and hand-written dependency lists for
    extends (#2241). One rule should have one mechanism.

### REF-4: children written inside an extend are appended after the source's (Tier 1 for ordinary components)
`<p name="pe" extend="$p">b</p>` of `<p name="p">a<text name="t">x</text></p>` shows "axb".
`$pe.t` resolves (**[probe]**).

Evidence: `T/copying/extend_references.test.ts`:
- `:3320` "add children with extend";
- `:3470`, `:3614`, `:3763` (groups, including several levels);
- `:4335` "recreated replacements include added children";
- `:4482` (with a prop and an index);
- `:3266` and `:6876` (children still appear when the referent is invalid).

Code: `W/components/abstract/Copy.js:1747-1758`, `addChildrenFromComposite` (`:4448`).

Exception: composites (REF-7).

Since #2483 the children written on a `copy` or `extend` are read with the type's sugar, as on a
tag written on its own: `<point copy="$P">(3,4)</point>` is at (3,4) (B13, #2395), as are a
`<vector>`, `<line>` or `<angle>` child; on `<sum>`, `<series>` and `<sortIndices>` the child is
appended to the source's terms; on an input it is what the input is bound to, as `bindValueTo`.
A child's sugar overrides an attribute written on the copy. `<row>` children on a `<matrix>` copy
or extend are appended to the source's rows, as this rule says. (`[[5,6],[7,8]]` is how a matrix's
text is shown, not how one is written; `<math>` reads it as a list of lists.)

**Done by #2542** (closing #2486): a child the component wouldn't use beside its source's is not
added, with `doenet-w0190` on a copy and `doenet-w0169` on an extend:
- a child group read once (a `<function>`'s formula, `<matchesPattern>`'s maths, an
  `<orbitalDiagram>`'s diagram): on a copy the written child replaces the source's (REF-4a); on an
  extend it is ignored, since an extend can't change what the tag makes (REF-7);
- a `<math>` beside a `<matrix>`'s rows or beside its source's `<math>`, and a `<curve>`'s functions
  beside `through`;
- on an extend of an input, any child but a label or a description.

A copy made from a value (`<point copy="$pl[1]">(7,8)</point>`) takes the written child.

**Known violations** (#2546): `<substitute copy="$s">x+2</substitute>` keeps the source's
child silently; a `<function>` whose formula is a reference (`<function name="f">$m</function>`)
doesn't recognize it as its formula, so a formula written on its copy isn't applied, and on an
extend is ignored with no warning; a `<math>` written on a copy of a `<matrix>` is ignored
(`w0190`), where under REF-4a (decided, below) it replaces the source's.

### REF-4a: of a child a component uses only one of, the last one written wins (Tier 1)
A component uses only one `<label>`, `<title>` or `<shortDescription>`. When more than one is
written, the last one is used. REF-4 appends added children after the source's, so a `<label>`
or `<title>` written inside an `extend` or `copy` replaces the source's. That is not an
exception to REF-4; it is the same rule an author meets when writing two labels directly.

**[probe]** These were checked by writing two labels directly, and by adding one in an
`extend` and in a `copy`:

| What | Components | Two written | Added in `extend` or `copy` |
|---|---|---|---|
| `<label>` | `point`, `vector`, `line`, `lineSegment`, `ray`, `circle`, `polygon`, `polyline`, `curve`, `function`, `piecewiseFunction`, `mathInput`, `textInput`, `booleanInput`, `choiceInput`, `slider`, `matrixInput`, `fractionInput`, `updateValue`, `callAction`, `triggerSet`, `answer` | the second | the added one |
| `<title>` | `section`, `hint` | the second | the added one |
| `<title>` | `<table>` | **the first** | **the source's** |
| `<caption>` | `<figure>` | **the first** | **the source's** |
| `<shortDescription>` | `graph`, `image` | the second | the added one |
| `<math>` | `matrix` (decided, #2546) | **today: joined into one 1×1 product**; wanted: the second, with a warning | **today: ignored, `w0190`**; wanted: the added one |

Code:
- `<label>`: one shared definition in `W/utils/label.ts:454`, which takes the last label child.
  The renderer's `labelChildInd` (`:239`) also uses the last.
- `<title>`: `SectioningComponent.js:509`, `Hint.js:109` and `Chart.js:1022` take the last.
- `<shortDescription>`: `Input.js:949` and `Video.js:169` take the last.
- The two exceptions: `Table.js:140`, `:165` and `Figure.js:155`, `:181` take index `[0]`. So
  does `Document.js:199`, though a document is not extended. On a table or figure, an `extend`
  cannot change the title or caption at all. This looks like an accident, and D25 proposes
  making them follow the rule.

`<legend>` is different on purpose: it takes one `<label>` per item.

**A `<matrix>` takes one `<math>` child** (decided, #2546). Today it joins its `<math>` children
into one expression, as a `<math>` joins its children: `<matrix><math>$A</math><math>$B</math></matrix>`
is a 1×1 matrix holding the unevaluated product `A B`, which is almost never meant. Under the
decision, a second `<math>` is a warning and the last one is used, and so a `<math>` written on a
copy of a matrix replaces the source's: `<matrix copy="$M"><math>$A - $B</math></matrix>` of
`<matrix name="M"><math>$A + $B</math></matrix>` is `A − B`. Plain text in a matrix is one `<math>`
child (`<matrix>1 2</matrix>` is the 1×1 matrix `1 * 2`), so it isn't affected. A `<math>` beside
`<row>`s or `<column>`s is still dropped, with a warning (#2542).

No test pins the "last one wins" rule, for any component, either written directly or through an
`extend`. The only related test is a point's label being overridden on an extend
(`extend_references.test.ts:86`). This rule should be one schema-driven sweep over every
component with a single-child group ([testing-principles.md](testing-principles.md) §2.3).

Not checked: whether an `<award>`'s `<when>` follows the rule. **[probe]**: an award that added a
`<when>` to one it was made from gave no credit for the added condition (#2531). Enforcing the rule
component by component leaves gaps like this one. In the cells core it should be one mechanism:
each component declares which child groups take one child, and one shared rule picks the last.
That is worth doing there, not retrofitting into the JavaScript core.

### REF-5: a different tag is allowed only between related types; any other pair is an error (Tier 2)
`<T extend="$x"/>` with T different from x's type asks for a T made from x. The same table decides
`copy` and `copyWithState` (D26). The allowed cases:
- **between value types:**
  - math, number, text and boolean, among each other. A boolean is `1` or `0` as a number or a
    math;
  - point, vector and coords, among each other;
  - math from a point, vector or coords, as the tuple of its coordinates;
  - a point, vector or coords from a math whose value is a tuple;
  - a value type from an input: `<math extend="$mi"/>` is mi's value, as `$mi` is (REF-1a);
  - a list from the matching scalar or list (#2231).
- **from a composite that always stands for one component (D36):** a composite, or an instance
  of one, counts as its component when the DoenetML guarantees it always holds exactly one, of
  one type. This is NAME-2's pass-through applied to type changes. From the DoenetML:
  - in a `<conditionalContent>`, each case and the `<else>`, if there is one, holds at most one
    component, all of the same type. No `<else>`, no case active, or a case holding nothing gives
    a missing T with an info (REF-0, D37);
  - a `<select>` or other selector has `numToSelect` written as `1`, or left out. A reference
    is an error, even if its value is 1;
  - a `<group>`, `<sort>` or `<shuffle>` holds at most one component;
  - a part's type is its tag:
    - a bare `$y` is y's tag, and a nested composite is looked through;
    - a bare string is a text (#2433);
    - a case, `<else>` or option written with `copy` is what it copies;
    - an index into a list is the list's entry type. An index into a select, repeat or
      `<repeatForSequence>` is one pick or iteration. An index into a `<collect>` with a written
      `componentType` is one component of that type;
    - a name inside a composite (`$s.go`) is each component of that name in its written
      descendants, including in what a copy among them copies. `<math name="go">` in one option
      and `<number name="go">` in another are two types;
    - a property, and a repeat's `valueName`, is an error, **`doenet-e0067`**, until properties
      declare their type (D20).
  - a type that already is the tag written counts as that tag: an `<integer>` case and a
    `<number>` else are one type for a `<number>` or a `<numberList>`, but not for an
    `<integer>` or a `<math>`.

  Authors write `<math extend="$s"/>` for a one-pick select, `<text extend="$cc"/>` of text cases,
  `<math extend="$g"/>`, and `<number extend="$s"/>` of a one-value
  `selectFromSequence`. An iteration, `<math extend="$r[1]"/>`, is an index (REF-0).
- **a list from a composite whose components all have one type that matches its entry type**,
  at any count, none included: `<mathList extend="$g"/>`, `<numberList extend="$c"/>` of a
  `<collect>`, a `<conditionalContent>` with no `<else>`, a select with `numToSelect="$n"`.

Not allowed, each an error whose message gives the clearer form (DIAG-3):
- **an input from a value type.** An input is not the same thing as its value. "To edit `$m1`,
  write `<mathInput bindValueTo="$m1"/>`; to start from its value, `prefill="$m1"`."
- **a container** (`<p>`, `<section>`, `<div>`) as another tag: "use `$p.text`".
- **a composite the DoenetML does not guarantee stands for one component**, as a scalar tag:
  - a case or option of another type, or two types that could each become T ("wrap it:
    `<math>$cc</math>`");
  - `numToSelect` that is not a literal 1, a `<repeat>`, `<collect>`, `<sequence>` or
    `<intersection>` ("use `$x[1]`").
  `<point extend="$i"/>` of an intersection is `<point extend="$i[1]"/>`.
  A literal index past what a selector picks (`$s[2]` of a one-pick select) is warning
  `doenet-w0181`, and the tag is missing (D37, #2458; #2447 had made it an error on a scalar tag).
- **a list from components of more than one type** ("wrap it: `<mathList>$g</mathList>`").
- **any other pair.**

What the composite holds is decided at load and not again (D36). Only a value conversion is
checked as the value changes: while a math is not a tuple, `<point extend="$m"/>` is a missing
point, not drawn, with an info (REF-0, DIAG-2).

For the allowed pairs the result is x's value as a T. It is linked both ways where the conversion
can be run backward: **[probe]** `<point extend="$v"/>` of a vector is draggable, and dragging it
moves `v`.

Done by #2427 (content fixed at load) and #2436 (content made at run time). #2447 (D36) replaced
#2436's run-time check of the composite with a load-time check of every case:
`W/utils/dast/typeChangeAtLoad.ts`, a pass over the serialized document after sugar and before
the list forms, which records `typeChangeAtLoad` on each `_copy` written as a tag. The table is
`typeChangeRule` in `W/utils/typeChange.js`, applied only to author-written extends and copies.
It also allows:
- any pair an `adapter` gives, such as `<text extend="$ion"/>`;
- an angle as a math, and a label as a text.

`<coords>` follows the point group, though it inherits from `<math>`.

Diagnostics:
- **`doenet-e0062`:** an input from a value;
- **`doenet-e0063`:** a container with a `text` (`<p>`, `<li>`) as another tag, suggesting
  `$p.text`;
- **`doenet-e0064`:** a composite that can hold several components. Its reason says why:
  `numToSelect`, any number, or a case, option or iteration holding several. Its
  `noElse` reason is gone since #2458: a part holding nothing gives a missing tag, with info
  **`doenet-i0055`** while no case of a `<conditionalContent>` with no `<else>` is true;
- **`doenet-e0065`:** any other pair;
- **`doenet-e0066`:** different types, suggesting `<T>$x</T>`, for a scalar or a list tag;
- **`doenet-e0067`:** a property or a repeat's value, whose type isn't known at load;
- **`doenet-i0053`:** an info for a value that does not allow the tag (a point from a non-tuple,
  a boolean from a math that is not true or false). The tag is missing (D37, #2458);
- **`doenet-i0054`:** an info for an index that names nothing now (REF-0).

The run-time `e0064` and `e0065` infos from #2436 are gone (#2447).

A linked extend takes the converted value again when it converts. A copy stays as it was made.

Evidence: `T/copying/type_change.test.ts`, `T/copying/type_change_run_time.test.ts`.

Not decided yet (behave as before): content holding a list (written there or by a bare `$l`), a
list or `<group>` written as the tag, internal list forms, and unresolved paths. An index after a
reference to a copy (`$a1[2]` of `<group name="a1" extend="$a"/>`) selects a child of the copy,
not a pick of what it copies, so it is left to run time (compare B26). Since #2518 the rule
decides it: the copy passes the index through if it holds one component, else names nothing.

**Done by #2484** (closing #2440, #2429, #2437; B22, B24, B30): an input written as a related
tag reads its value, so `<point extend="$mi"/>` is `(1, 2)` and dragging it edits `mi`. A boolean
is `1`/`0` as a number or math (`convertBoolean`, which an author's `<number convertBoolean>`
can now be written through). A `<boolean>` from a text reads the word `true`/`false`, and any
other text is missing with `i0053`. A property source is checked against its value as it
changes (`<point extend="$P.x"/>` is missing). `bindValueTo` of a `<subsetOfRealsInput>` works.

**Done by #2542** (closing #2488, #2501):
- `<point extend="$ci"/>` of a `<choiceInput>` is decided again as the selection changes;
- a component in error beside others in what a tag is made from is missing, so the tag is made
  from the rest;
- **a tag that makes its list of values itself** (`<sequence>`, `<sampleRandomNumbers>`,
  `<selectPrimeNumbers>`, `<samplePrimeNumbers>`, `<sampleMultivariateRandomNumber>`,
  `<sortIndices>`) is made only from one component of its own type. Anything else, a property or
  an entry included (`<sequence extend="$s.value"/>`, `$s[1]`), is `doenet-e0071`, which says to
  write the reference bare. A `<conditionalContent>` or `<select>` holding one sequence in each
  part is one sequence, and `<sequence extend="$cc"/>` is `＿` while no case is true.

Known violations:
- `<point extend="$ci"/>` of a `<choiceInput>` with no choice selected, or several, is `(0, 0)`;
  with a text choice among its choices it is `e0065` at load even while a tuple is selected
  (#2546);
- a component in error is dropped from a group's content only when the copy is first made; when
  the content changes later, it counts again (#2546);
- a composite tag (`<repeat>`, `<select>`, `<collect>`, `<sort>`) extending a property shows
  nothing, with no diagnostic (#2546);
- a copy that made nothing could report a different info after a reload (B37). #2447 removed
  the run-time `e0065` of its example; whether two infos can still differ is not checked;
- a `<select>` whose options are all written with `copy` failed to load (B39); fixed by #2468.

Fixed: a type-changed copy keeps its decision through a reload since #2443 (B31). Infos follow
their condition since #2444 (B33). Bare-text cases convert since #2447 (B23).

Cost (Tier 3): a linked extend that follows run-time content is about twice as slow as before
(#2436). #2447 did not recover it. It keeps `typeChangeContent` watching the composite, though
that no longer decides anything. The watching is still needed to:
- make the copy from the one component a case or pick holds, which changes when a case further
  in changes;
- stop two `<conditionalContent>`s extending each other from recursing.

The perf census is unchanged.

Evidence for the related pairs:
- `T/copying/extend_references.test.ts:3200` "extend wraps to match specified type" (math,
  number and coords from a mathInput and a point), and `:6366`;
- `T/copying/list_extend_attributes.test.ts` (#2231).

**Current behavior for unrelated pairs does not need to be reproduced.** Today an unrelated pair
gives a default T, sometimes with a confusing "Invalid children" warning and sometimes with no
warning at all. For example, `<boolean extend="$m"/>` of a math is silently `false`. A
container tag (`<p extend="$m"/>`) just holds the referent. A new core should give the error
instead, and no test should pin today's results. The test named "handle extending or copying
with invalid component type" covers an unrecognized tag name, not an unrelated pair.

Inconsistency within the related pairs: across a type change, a list extend takes the source's
same-named attributes (`hide`, `fixed`, display settings, #2231), but a scalar extend does not
(D19).

### REF-6: a reference inside an extend means what it means in the source, or its counterpart in the extend (Tier 1; D43)
An extend is the same component again. A reference inside the extended subtree:
- **to something outside the subtree** means what it means in the source, through any number of
  chained extends;
- **to something inside the subtree** means its counterpart in the extend, as in a copy (CPY-3).

So extend and copy follow one rule for references, and differ only in whether they share state.
For values the two readings agree, since the counterpart is the same component again. They
differ where identity matters, or where the extend changes its own root:
- a `<label for>`, a legend label's `forObject`, an input's `forAnswer` inside the subtree point to
  the extend's own input, object or answer. One that points outside the subtree is dropped, as
  for a reference that names a label (REF-3, #2529);
- a reference to the root's own part sees what the extend gives it: an attribute written on the
  extend (REF-3), a replaced single child (REF-4a), an added child (REF-4).

**Known violation, postponed to the cells core** (D43): the JavaScript core keeps every reference
inside an extend bound to the source. It builds an extend's internal references as shadows of the
source's resolved ones (below), and remapping them isn't worth the change there. Fixes that depend
on remapping (#2537 items 2 and 3) wait for the cells core. These examples are its tests; each
shows the current result and the one wanted:

| Document | Today | Wanted |
|---|---|---|
| `<section name="s"><title>Old</title><p>This section: $s.title</p></section>` and `<section extend="$s"><title>New</title></section>` | the extend's paragraph says "Old" | "New" |
| `<group name="g"><textInput name="ti3"/><label name="l3" for="$ti3">M</label></group>` and `<group name="g3" extend="$g"/>` | `g3.l3` labels `g.ti3`, which has two labels; `g3.ti3` has none | `g3.l3` labels `g3.ti3` |
| `<textInput name="t"/><group name="g"><label for="$t">T</label></group>` and `<group extend="$g"/>` | `t` has two labels | the extend's label labels nothing |
| `<repeat name="r" …><textInput name="tr"/><label for="$tr">…</label></repeat>` and `$r[1]` | the label labels no input (#2537 item 3) | the counterpart input, or nothing |
| `<group name="g"><answer name="a">x</answer><mathInput forAnswer="$a"/></group>` and `<group extend="$g"/>` | the extend's input is for `g.a` | the extend's `a` (same state; the link follows the extend) |
| `<graph name="gr"><point name="P"/><legend><label forObject="$P">P</label></legend></graph>` and `<graph extend="$gr"/>` | the extend's legend entry is for `gr.P` | the extend's `P` |

The first is **[probe]**d; the others follow from the code and should be confirmed when the tests
are written.

**[probe]** (a reference to something outside the subtree)
```xml
<section name="A"><number name="n">1</number><group name="g"><p name="p">$n</p></group></section>
<section name="T"><number name="n">2</number><group extend="$A.g" name="ge"/></section>
```
`T.ge.p` is 1, even though `T` has its own `n`.

Evidence:
- `T/copying/extend_references.test.ts`: `:2401` (four levels), `:6408` (three levels), `:2908`,
  and `:3153`/`:3177` "extend repeat";
- `T/copying/external_references.test.ts:409`.

Code: `expandShadowingComposite` (`W/core/CompositeExpander.ts:426`) copies the source's
replacements without resolving them again. When a linked shadow does have to re-resolve and
fails, it falls back to the source's binding (#1805,
`W/core/dependencies/refResolutionDependencies.ts:278`).

### REF-7: an extend is the same component again; it cannot change what a tag makes (Tier 1; D32, done by #2409)
An `extend` shares its source's content and state. It can have its own name and can look
different, but it cannot change what the component makes or what its state can hold. Trying to
is an error located on the extend, which shows the error in place of its content. The rest of
the document renders.

- **Allowed on any extend:** a bare extend (the same as `$x`, REF-1), a name, and attributes that
  only change appearance (`hide`, `styleNumber`, display settings, `asList`, `disabled`,
  `fixed`). A `<group>` or `<module>` extend can also be given children, which are appended.
- **Errors** (Tier 2, the list authors are not given):
  - on a tag whose content is made rather than written, an attribute its class declares beyond
    those an extend applies, `doenet-e0056` (on a `pretzel`, only `mode`), and children written
    inside, `doenet-e0057`. The tags are `repeat`, `repeatForSequence`, the `select…` and
    `sample…` tags, `shuffle`, `conditionalContent`, `collect`, `sort`, `sortIndices`,
    `sequence`, `intersection`, `substitute`, `split`, `lorem`, `idx` and `pretzel`;
  - on a `<module>`, a module attribute declared in its `<moduleAttributes>`, `doenet-e0060`;
  - on a `<choiceInput>`, choices written inside, `doenet-e0058`, and `shuffleOrder`,
    `doenet-e0059`;
  - any extend of `case`, `else` or `option`, `doenet-e0061`, including a bare `$c` (REF-1's one
    exception). `<case copy="$c"/>` still works.
- **The message** names the tag, what it makes, why an extend can't change it, and what to write
  instead, citing the reference: "A `<repeat>` makes its content from `for`. An `extend` shows
  the same content as `$r2`, so it can't change `for`. To show the content of `$r2` again, remove
  `for`. To make a new `<repeat>` with a different `for`, use `copy`."
- **Still warnings:** `doenet-w0168` and `doenet-w0169` remain for composites and lists outside
  the list above, and for an attribute a module does not declare, such as `displayDigits` on a
  `<module extend>`, which is ignored. Under the Tier 1 rule an appearance attribute should take
  effect there instead.
- **A reference to an errored extend** (`$e`, `<repeat copy="$e"/>`) shows the error again and
  reports it again at its own location.

Evidence: `T/copying/extend_cannot_change_content.test.ts` (91 tests, #2409): bare, named and
appearance-only extends of 18 tags, display settings taking effect, a named extend reaching
inside, one error test per banned attribute and kind of child, `module`, `choiceInput`,
`case`/`else`/`option`, an extended `group` holding a repeat.

Code: `extendChangesContentErrors` and `attributesAnExtendApplies` in
`W/components/abstract/Copy.js`. The parser's `conditionalContent` and `repeat` sugar skips an
element written with `extend`, which fixed B12.

**Done by #2542** (closing #2217, #2211, #2216; D4, B5): `condition` on a copy of a
`<conditionalContent>` written without `<case>` becomes the condition of the case the sugar made
(beside written cases it is ignored with `w0079`, as on the tag written whole); a copy that writes
`valueName` or `indexName` gets aliases for each name; `replacement` on a copy of a `<substitute>`
is read with its `type`. **Known violations** (#2546): `<substitute copy="$t" type="math">`
of a text substitute (and the reverse) fails to load; `<repeat copy="$r"><number>2$v</number></repeat>`
can't read `$v` from a child written in the copy unless the copy writes `valueName`.
**[probe]** at `894d3ea`, #2218 and the copy half of #2215 look fixed. #2219
(`styleNumber` on an extend of `<intersection>`) was fixed by #2426.

### REF-8: an extend's descendants are reached through the extend's own name, and an unnamed reference creates no names (Tier 1)
- **Through a name.** With `<p name="e" extend="$p"/>`, `$e.t` reaches e's own counterpart of
  p's `t`, which is linked to it.
- **Without a name.** A reference with no name of its own adds no names to the document, as a
  reference never does. That stays true when the path goes through an ancestor, so the
  ancestor's name does not help:

  ```xml
  <p name="p"><text name="t">hi</text></p>
  <section name="sec1">$p</section>
  <section name="sec2"><group name="g">$p</group></section>
  ```

  | Reference | Result |
  |---|---|
  | `$sec1.p`, `$sec1.t` | do not resolve: the bare `$p` brings neither p's name nor t's into `sec1` |
  | `$sec2.g.p`, `$sec2.g.t` | do not resolve, for the same reason |

  Evidence: `T/copying/extend_references.test.ts:6549` "reference inside composite adds to index
  resolution but not names". That test also asserts that `$sec2.g[1].t` reaches `t` by its
  position in the group. That part changes under D27, which decides that an index never selects
  a child of a group (#2518).

To reach into a reference, name it: `<p extend="$p" name="e"/>`, then `$e.t`.

**List extends (fixed by #2393).** `$e.h` reaches e's counterpart of `h` for
`<mathList name="e" extend="$l"/>`, as `$E.h` does for `<p name="E" extend="$P"/>`. Before #2393 a
linked list extend had no children of its own to name (defect B10, #2376). This holds for every
authored list, an extend of an extend (`$e2.h`), a reference written before the extend, and a
list inside an extended component (`$E.l.h`, `$Pe.Q.h`). `$e.l` still names nothing (NAME-3).
Evidence: `T/tagSpecific/listcomponentvaluelists.test.ts:753`, `:843`, `:934`, `:995`, `:1040`.

Other tests: `:1626`, `:1837`, `:6408`, `:5773`.

### REF-9: an extend shares state, not identity (Tier 2)
A bare `$P` stands for P as a click target. A *named* extend or copy is a component of its own:
- a trigger on `$P` fires only for clicks on P;
- a trigger on `$Q`, where Q extends P, fires only for clicks on Q;
- a click on a copy fires neither.

Evidence:
- `T/tagSpecific/clickTarget.test.ts:165` "a bare reference to a click target is a click target,
  but an extension is not";
- **[probe]** for points.

Gap: no test of a named extend of a point as its own target.

### REF-10: an extend re-derives from the source's definition; an extend of a property takes the computed value (Tier 2)
- `<math extend="$m" simplify="none"/>` of `<math simplify>x+x</math>` gives `x+x`. The extend
  re-reads m's children with its own `simplify`.
- `<math extend="$m.value" simplify="none"/>` gives `2x` (`T/tagSpecific/math.test.ts:2759`).
- `splitSymbols` likewise re-parses (`:3140`).

This is defensible: an extend means "same definition, my attributes", and a property means
"that value". The cost is that it pins exactly which state is shared: the unnormalized children,
not the visible value. A rewrite has to decide which inputs an extend shares. The rule worth
keeping is "attributes that control how the content is read apply to the extend's reading of
the same content".

---

## 3. `copy`

### CPY-1: a copy behaves as the source's DoenetML pasted in place (Tier 1)
`<T copy="$x" …/>` and `<T copyWithState="$x" …/>` behave as if x's DoenetML were pasted at that
spot:
- attributes written on the copy override x's, as in REF-3;
- children written inside it are appended, as in REF-4;
- the link to x itself is cut, so later changes to x do not reach the copy, and the copy's
  changes do not reach x.

**`copy` is only that** (D33): it carries no reader state and no random choices, and starts as
written content does. `<mathInput copy="$mi"/>` starts at mi's prefill, whatever the reader typed.
Its random components draw their own values, fixed for a given variant and kept through a
reload; two copies of one source differ (D17). A copy of a choosing tag chooses again, and a copy
of a `<conditionalContent>` or `<repeat>` decides its own case or iterations.
**`copyWithState` adds** the reader's current state (CPY-2) and the source's random choices
(CPY-8).

**Both keep what they were made from through a reload** (SAVE-1). A `copy` carries no state, but
its shape depends on what it was made from: `copy="$cc.p"` pastes the `p` of the case active
then. After a reload it is made from the same source (#2443's held case and type-change decision;
B35, #2446). Only the state snapshot is `copyWithState`'s alone. Implementation: #2459.

**Done by #2467** (closing #2459). A `copy` is reseeded from the variant's seed and its own
`stateId` (D17), so two copies differ and each is stable through a reload. A `copy` of a repeat
makes its iterations from the template, with its own choices. New diagnostics:
- **`doenet-e0068`** (error at load): a `copyWithState` that writes an attribute deciding what a
  choosing tag chooses, by name, listed per class (`attributesDeterminingChoices`);
- **`doenet-e0069`** (error at load): a `copyWithState` that adds options: an `<option>` to a
  select, anything to a shuffle, a `<problem>` to a pretzel, a `<choice>` to a choiceInput whose
  source shuffles (decided: only when shuffled);
- **`doenet-w0186`**: a `copyWithState` whose written attribute reaches a nested choice at run
  time; the carried choices win;
- **`doenet-w0185`**: `copyWithState` of a URI, which behaves as `copy`.

The `v07-to-v08` converter, still to come, renames existing `copy` to `copyWithState`, except
copies of a URI, copies of a module, and copies that change what is chosen (#2457).

**Known violations:**
- a copied `<award>` in an `<answer>` gets an extra, visible `<mathInput>` from the answer's sugar,
  which the written-out award doesn't, because the sugar sees an award with no children (#2531);
- a `copyWithState` doesn't carry a sampler's draws, and they aren't kept through a reload; and
  a module attribute reaching a nested choice through a list other than `<numberList>` isn't
  kept, with no `w0186` (#2477);
- #2476 was not a defect: `condition` on a `<conditionalContent>` with an `<else>` is ignored with a
  warning, and the blank came from a name declared twice. #2481 made `<conditionalContent copy>`
  a new `<conditionalContent>` that decides its own case, also through a reload.

Evidence:
- `T/copying/unlinked copy.test.ts:285` "copy no link, base test";
- `T/copying/context_attributes.test.ts:441` "an unlinked copy is its source pasted: it keeps the
  source's attributes, not where the source sits";
- `T/copying/list_extend_attributes.test.ts` (#2231);
- PRs #559, #2240, #2259.

Code: `W/components/abstract/Copy.js:1564-1576` (`copyAll`, `copyPrimaryEssentialIfShadow`,
`copyEssentialStateIfShadow`, `copyVariants`) and `BaseComponent.serialize`
(`W/components/abstract/BaseComponent.js:1453-1840`).

What the copy does *not* take from x:
- **x's surroundings.** A point fixed only by its graph is not fixed when copied elsewhere
  (`context_attributes.test.ts:525`, `:563`).
- **`labelIsName`.** It is deliberately not pasted (`Copy.js:1566`), an exception noted in D19.

### CPY-2: `copyWithState` starts from the source's current reader state, and keeps that snapshot (Tier 1)
A `copyWithState` made after the reader has interacted with x starts where x is now, not from
x's prefill. (Below, "copy" in this principle means `copyWithState`; examples written with `copy`
show behavior through 0.7, D33.)
- **[probe]** `mi` was typed to 5 and `P` dragged to (7,8). A `<conditionalContent>` then
  revealed `<mathInput copy="$mi"/>` and `<point copy="$P"/>`. They show 5 and (7,8).
- A copy made at load stays at the prefill after `mi` changes.
- Through a reload, the copy keeps the snapshot it was made with (#2234). Since #2443 that
  includes what decided its shape: the type-change decision of a copy written as another tag,
  and the case of a `<conditionalContent>` it was made from. A copy deleted and made again
  within a session keeps them too.
- Since #2481 a copy of a component named inside a case keeps that case through a reload (B35),
  and a saved value is restored only to a component of its own type (B36). **Known
  violations:** a source a composite in the case makes, and `$e.p` through an extend of a
  `<conditionalContent>`, are made from what the reference names now (#2485).

This is how authors freeze a reader's work, and it is why `copyWithState` is "pasted DoenetML
*plus the current state*", not pure paste. `copy` is pure paste (CPY-1).

A document loaded from a URI has no reader state, so `copyWithState="doenet:…"` carries nothing
more than `copy`: it behaves as `copy`, with a warning that says to write `copy` (D33).

Evidence:
- `T/copying/unlinked copy.test.ts:2112-2312` "create snapshot of group/repeat with
  conditionalContent/callAction";
- `T/copying/unlinked_copy_reload.test.ts:20-514`.

Which state is carried is inconsistent. A reader's write to a literal `hide` is carried; one to
`fixed` is not. See D2.

Cost: the reload half is expensive in the current core.
- Every unlinked copy is remade at save time and compared (`W/utils/copySnapshot.js`,
  `snapshotStillMade`).
- That runs inside `ProcessQueue.runExclusive`.
- It uses positional `stateId`s with type checks.

A core that records the copy's own state when it is made gets the same author-visible result
for free. Keep the behavior and drop the mechanism.

### CPY-8: `copyWithState` keeps its source's random choices, however deeply nested; a child added to a copy draws its own (Tier 1)
Random choices are part of the state `copyWithState` carries (CPY-2), so a `copyWithState` of anything holding a
`<select>`, `<selectFromSequence>`, `<shuffle>` or sampler shows the same values as its source.
That holds at any depth inside the copied content. A child written inside the copy is new
content: it draws its own value, which is fixed for a given variant, and never repeats one of
the source's.

Evidence:
- `T/copying/group_copy_variants.test.ts` (#2344), over variants 1–5:
  - a `<group copy>` keeps random values nested in divs and inner groups, including in a hidden
    group, a `<shuffle>` and a `<select>` with unique variants;
  - a random child added to a `<group copy>` gets its own value, the same for a given variant,
    and keeps it through a reload. A copy of that copy keeps it too;
  - an unlinked copy of a repeat keeps the random values in its template, and they are kept when
    the page is loaded again with the variant it generated;
- `T/tagSpecific/select.test.ts:432` (copies do not resample);
- `selectfromsequence.test.ts:567`;
- `shuffle.test.ts:47`.

Code: `copyVariants` in `W/components/abstract/Copy.js`. It gives each serialized component its
`generatedVariantInfo` as its desired variant.

**Fixed: #2342, by #2344.** A `<group copy>` used to break this rule in two ways:
- it drew a new value for a random component nested in a `<div>` and an inner group, because
  the group was serialized before its inner content had been expanded;
- a random child added to it repeated the source's first draw (`429 966` became `429 966 429`).

#2344 keeps the variant of each child of an unexpanded group, and gives a group copy with added
random children a seed of its own. **[probe]** on main, for variants 1–3: the nested value matches
its source, and an added child draws its own (`323 109` becomes `323 109 722`).

**Decided (D33): a copy that changes what is chosen (#2389, defect B11).** CPY-8 says a copy keeps its
source's random choices, and D4 says the attributes written on a copy override. They conflict
when the copy changes what is chosen, as `<select copy="$x" numToSelect="4"/>` of a two-pick
select does. The copy cannot keep two picks and make four. Today (**[probe]**):
- `<select>` makes the whole document fail to load;
- `<selectFromSequence>` shows nothing, with error `doenet-e0037`;
- `<sampleRandomNumbers copy numSamples="4">` makes four new samples.

Decided in D33:
- **`copy` chooses again**: `<select copy="$x" numToSelect="4"/>` is a new select with four picks.
- **`copyWithState` always keeps its source's choices.** Writing on it an attribute that decides
  what is chosen (`numToSelect`, `withReplacement`, a range, `exclude`, a sampler's `numSamples`
  or distribution), or adding options, is an error that says to use `copy`. The check goes by
  attribute name, so `numToSelect="2"` and `"3"` behave the same. A change that reaches nested
  content, known only at run time (`<module copyWithState="$m" k="4"/>` where `k` sets a nested
  `numToSelect`), gives a warning, and the carried choices win (DIAG-1).

That replaces an earlier proposal that a copy changing what is chosen chooses again, which made
the result depend on the value written.

### CPY-3: references inside a copy stay live; ones that pointed into the source now point into the copy (Tier 1)
```xml
<group name="g"><mathInput name="mi" prefill="1"/><p name="p">$mi</p></group>
<group copy="$g" name="gc"/>
```
Typing 7 into `gc.mi` changes `gc.p` to 7 and leaves `g.p` at 1 (**[probe]**). A reference to
something outside the copied part, such as `$n`, keeps following it.

Evidence:
- `T/copying/unlinked copy.test.ts`:
  - `:1056` "internal copy to source alias is linked";
  - `:981`;
  - `:1118` "copy no link containing external copies use absolute source" (#559).
- `T/copying/value_references.test.ts:843`.

Code: `remapRefResolutions` (`W/utils/componentIndices.ts:413-503`).

A reference into the source that goes **through the source's own name** keeps pointing at the
original. In a copy of `<p name="P"><math name="h"/>$P.h</p>`, `$P.h` still names P's `h`, because
`P` is not the copy's name. Only references by inner names, such as `$h`, move to the copy. Since
#2367 the same holds for lists: `$l.h` written inside `<mathList name="l">` refers to the original
`l` in a copy.

**Changed by #2397 (D1).** The rule goes by referent, not spelling: `$P.h` and `$l.h` name
something inside the copied part, so they now name the copy's counterpart. So does
`$P.sectionNumber` written inside a copied section `P`.

### CPY-4: a copy of a reference pastes what the reference points to (Tier 2)
`copy="$r"`, where `r` is `<T extend="$m" …/>`, pastes m's DoenetML with r's own attributes on
top. This is the "exception" from the recent PRs (#2259). It is principled: `r` has no
DoenetML of its own beyond its attributes.

Evidence:
- `T/copying/copy_of_extend.test.ts` (whole file): a point at `($a, 0)` copied through an
  extend follows `a` and writes `a`;
- `T/copying/unlinked copy.test.ts:2406` "a copy of a reference is what the reference is linked
  to, pasted", and `:1864-2000`;
- `T/copying/list_extend_attributes.test.ts:184`, `:226`;
- `T/copying/unlinked copy.test.ts:2477` (repeat).

How it is implemented:
- `copy="$r"` resolves to r's replacement, a shadow that has no attributes of its own.
- `serializeShadowedAttributes` walks back to `m` to paste them
  (`W/components/abstract/BaseComponent.js:2286`). That part is principled.
- The shadow's main value is then frozen (`copyPrimaryEssentialIfShadow`) unless one of these
  holds:
  - (a) the class lists the attribute that defines its value, in `attributesDefiningPrimaryValue`.
    Only `xs` on point and vector are listed (`Point.js:58`, `Vector.js:55`);
  - (b) the shadow serializes children. **[probe]**: a copy of an extend of
    `<math>$n+1</math>` follows `n`.
- So whether a copy of an extend stays live depends on where its class keeps its definition.
  Other classes that moved their definition into expression attributes (#2258, #2263: line
  `equation`, curve `parMin`/`parMax`) are untested.

D5 proposes doing the paste generically. One known violation remains: attributes written on a
copy of an extend do not reach the copy's descendants. See the TODO with a commented-out
assertion at `T/copying/unlinked copy.test.ts:1967-2002` (`g3.B` `styleNumber`).

### CPY-5: a copy of a property or a list entry holds a value (Tier 1)
`copy="$P.x"` has no DoenetML to paste, so it holds the value it had when the copy was made. This
holds for both forms: for `copy` the value is its only content. It
also keeps the display settings it showed. Attributes written on the copy still apply.

Evidence:
- `T/copying/unlinked copy.test.ts:1689` "copy no-link of a copy prop", and `:1757`;
- `T/copying/attribute_values.test.ts:187`, `:227`, `:608`;
- `T/copying/context_attributes.test.ts:525`.

Code: `replacementFromProp`, `W/components/abstract/Copy.js:1457-1545`.

A copy of an *authored value list* used to freeze its entries too, though the list has DoenetML
to paste. Since #2367 it is pasted like any other component (D3).

### CPY-6: references to names outside the copied part keep their referents (Tier 1; D1, done by #2397)

A reference in copied content whose referent is outside the copied part keeps that referent. It
is not looked up again where the copy is written. An `extend` already does this (REF-6), so the
two agree. Author statement: a copy is the source's DoenetML pasted here, with its names still
meaning what they meant in the source.

**Before #2397** the copy was pasted DoenetML, so a `$n` inside it that pointed to something
*outside* the copied part was resolved again from the copy's new location. A nearer `n` there
captured it. Two equally near `n`s made it ambiguous. An `extend` at the same spot keeps the source's `n`
(REF-6).

The example, with what it showed before #2397:
```xml
<section name="A"><number name="n">1</number><group name="g"><p name="p">$n</p></group></section>
<section name="T"><number name="n">2</number>
  <group copy="$A.g" name="gc"/>     <!-- gc.p = 2: captured by T.n -->
  <group extend="$A.g" name="ge"/>   <!-- ge.p = 1 -->
</section>
<section name="U"><group copy="$A.g" name="gu"/></section>   <!-- gu.p empty: "Multiple referents" -->
```

Now `gc.p` and `gu.p` show 1, with no warning, and `copy="$r[2].p"` of repeat content showing
`$i` shows the iteration's value (B4).

Evidence: `T/copying/copy_keeps_referents.test.ts` (#2397): capture, ambiguity, chains at depths
1–3, references through the copied root's own name, repeat content, an attribute of a copied
reference, attributes a copy of a list entry or property takes from its source, and a reload.

#2400 (closing #2398, B14) extends this to a copy of an `extend`, and to a copy of part of one:
an outside referent is kept as a referent, not looked up again by name.


### CPY-7: to start from another component's current value, copy its value, not the component (Tier 1)
A copy is independent of the component it copied, but **not of what that component refers
to**. It pastes the component's definition, and references in that definition stay live
(CPY-3). An author who wants "a new component that starts at x's value and then changes on
its own" must copy the value: `copy="$x.value"`. A value has no definition to paste (CPY-5).

This comes up most with module attributes that set an initial value:

```xml
<module name="m">
  <moduleAttributes><number name="x0">5</number></moduleAttributes>
  <number name="x" copy="$x0"/>          <!-- intended: starts at x0, then changes on its own -->
  <graph><point name="P">($x, 0)</point></graph>
</module>
<module copy="$m" x0="$initial"/>
```

A module attribute supplied as `x0="$initial"` behaves like `<number name="x0">$initial</number>`.
So `copy="$x0"` pastes a live `$initial` into `x`. **[probe]** Dragging `P` gives:

| `initial` is | `x` defined by | Result of the drag |
|---|---|---|
| `<number>3</number>` | `copy="$x0"` | P moves, **and the caller's `initial` becomes 9** |
| `<number><number>1</number>+<number>2</number></number>` | `copy="$x0"` | P does not move: the pasted `1+2` has two changeable parts and cannot be inverted |
| `<number>$a+$b</number>` | `copy="$x0"` | P does not move, for the same reason |
| `<number>$a+1</number>` | `copy="$x0"` | P moves, **and the caller's `a` becomes 8** |
| any of these | `copy="$x0.value"` | P moves; `initial` and `a` are untouched |
| omitted (the default `5`), or a literal `x0="3"` | `copy="$x0"` | P moves; nothing outside changes |

So the same module works when tested with a literal, and fails or reaches outside itself once
a caller passes a reference. Copying the value avoids every one of these failures.

How to say it to authors:

> `copy` copies a definition. To start a new value from where something is now, copy its
> value: `copy="$x.value"`. (`copyWithState="$x"` also starts from where x is now, but it
> copies the definition too, so its references stay live.)

This belongs on the `<module>` and `<moduleAttributes>` reference pages, next to the existing
advice to use `copy` so that each instance is independent. No test pins any row of the table
above. D28 asks whether the model can make the natural spelling work.

---

## 4. Nesting: the rules compose

When references are chained, each link follows its own rule:
- **an `extend`** keeps the meaning its source's references already have (REF-6);
- **a `copy` or `copyWithState`** pastes the source's DoenetML, and keeps what its names meant
  there too (CPY-6, #2397).

The example below chains extends and copies of one group. The group holds a paragraph that
shows `$n`, and every section except F has its own number named `n`.

```xml
<section name="A">
  <number name="n">1</number>
  <group name="g"><p name="p">n is $n</p></group>
</section>

<section name="B"><number name="n">2</number> <group name="gB" extend="$A.g"/></section>
<section name="C"><number name="n">3</number> <group name="gC" extend="$B.gB"/></section>
<section name="D"><number name="n">4</number> <group name="gD" copy="$C.gC"/></section>
<section name="E"><number name="n">5</number> <group name="gE" copy="$D.gD"/></section>
<section name="F">                            <group name="gF" copy="$E.gE"/></section>
<section name="G"><number name="n">6</number> <group name="gG" extend="$E.gE"/></section>
```

Each group's paragraph shows (**[probe]** on main at `a53fbb9`, after #2400):

| Paragraph | Shows | Why |
|---|---|---|
| `A.g.p` | n is 1 | the original; its `$n` is A's `n` |
| `B.gB.p` | n is 1 | `gB` extends `g`, so its `$n` still means A's `n`, though B has its own `n` |
| `C.gC.p` | n is 1 | an extend of an extend: still A's `n` |
| `D.gD.p` | n is 1 | `gD` copies `gC`, which stands for `g` (CPY-4). Its `$n` keeps A's `n` (D1). Before #2397 it found D's `n` (4), and between #2397 and #2400 C's (3), where the extend `gC` is written (B14) |
| `E.gE.p` | n is 1 | a copy of a copy keeps what `$n` meant in `gD`. Before #2397, 5 |
| `F.gF.p` | n is 1 | the same. Before #2397 it was empty: from F, which has no `n`, the `n`s in A to E and G were equally near |
| `G.gG.p` | n is 1 | `gG` extends the copy `gE`, so it keeps what `$n` means in `gE`. Before #2397, 5 |

The same holds for a reference in an attribute written on a copy (NAME-4):

```xml
<section name="T">
  <number name="m">-3</number>
  <graph name="G1"/>
  <graph name="G2" copy="$G1" xMin="$m"/>     <!-- xMin -3: T's m -->
</section>
<section name="U">
  <number name="m">-5</number>
  <graph name="G3" extend="$T.G2"/>            <!-- xMin -3: keeps G2's meaning of $m -->
  <graph name="G4" copy="$T.G2"/>              <!-- xMin -3: keeps G2's meaning of $m (-5 before #2397) -->
</section>
```

**[probe]** confirms the three values. The test is `extend_references.test.ts:7759`, updated by
#2397.

Coverage of nesting is thin. `copy_keeps_referents.test.ts` (#2397, #2400) now covers copy
chains at depths 1–3, capture inside copied content, a copy of repeat-iteration content
(`copy="$r[2].p"`), chains that mix extends and copies such as the one above, and copies of
direct extends of content-making tags. These cases still have no tests:
- live references at depth 3 through extends;
- modules nested three deep.

Privacy of names inside a copy (NAME-3) is tested since #2367.

See [testing-principles.md](testing-principles.md) §4 for a sweep that runs every component
through extend and copy at depths 1–3.

---

## 5. Tests that pin incidental behavior (Tier 3)

| Test | Why it is incidental |
|---|---|
| `_ref` versus full-component assertions in `extend_parity.test.ts` and `extend_references.test.ts` (#2233) | Which internal kind a reference becomes. Keep the "same text, same `fixed`" half |
| `copy_of_extend.test.ts:150-280`, the #2199 repros (`essentialVarName` for vector `tail2`, ray `direction2`) | Load-without-crashing checks of an internal naming quirk. Keep "a copy of an extend of a ray loads" |
| `copy_of_extend.test.ts` `bothWays` toggle (expression attributes on and off) | Proves two internal representations agree. Keep the expected values; drop the toggle |
| `unlinked_copy_reload.test.ts:84` "holds nothing when no copy's source changed" | A saved-state size optimization |
| `unlinked_copy_reload.test.ts:229-421` (`stateId` type matching across cases) | Follows from positional `stateId`s |
| `module.test.ts:1474`, `:1505` (module attributes named `constructor`, `toString`, `link`) | Robustness against prototype maps and `_copy` attribute collisions |
| `utils/copy.test.ts` (whole file) | Unit test of an internal fallback. Keep one integration test of "a reference to a point in its own label shows its value" |
| `warningsInfos.test.ts` w0168/w0169 exemptions for `_copy`'s own attributes | Artifacts of the `_copy` encoding |
| `circularReferences.test.ts:27-67` `rejects.toThrow` | Pins "the document fails to load" as the failure mode (D14) |

## 6. The critical tests for this area

A new core should pass these before anything else in this area:
- `T/copying/extend_parity.test.ts` (REF-1)
- `T/copying/attribute_values.test.ts:33`, `:72` (REF-3)
- `T/copying/extend_references.test.ts`:
  - `:3200` (REF-5);
  - `:3266-4609`, the added-children tests (REF-4);
  - `:2401`, `:6408` (REF-6, NAME-2);
  - `:7583-7790` (NAME-4).
- `T/copying/unlinked copy.test.ts`:
  - `:285`, `:981`, `:1056`, `:1118` (CPY-1, CPY-3);
  - `:2112-2312` (CPY-2);
  - `:1689` (CPY-5);
  - `:2406`, `:2504` (CPY-4, REF-3a).
- `T/copying/copy_of_extend.test.ts` (CPY-4), minus the Tier 3 items above
- `T/copying/unlinked_copy_reload.test.ts:20` (CPY-2 through reload)
- `T/copying/external_references.test.ts` (NAME-6)
- `T/tagSpecific/module.test.ts:68`, `:539`, `:1715-1930` (modules)
- `RS/resolve.test.rs`, `RS/build_resolver.test.rs` (NAME-1, NAME-3)
