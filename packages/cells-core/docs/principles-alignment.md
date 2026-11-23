# Aligning the cells core with the DoenetML principles

A review of the cells core (`packages/cells-core`, branch `cells` at
`3583ebf`) against `docs/principles/` on Doenet/DoenetML's branch
`claude/wizardly-cray-9tas6j` at `cf6c3df` (D1 to D67). The principles
distill DoenetML's behavior into tiered rules: Tier 1 are author
guarantees a new core must hold before it ships, Tier 2 consistency
invariants it should hold, Tier 3 incidental behavior it may drop.

This replaces an earlier review against a first snapshot of the
principles (see this file's history). Since then the principles gained
NAME-0, REF-0, TYPE, COLL-1 to COLL-5, SEL, DIAG-1 to DIAG-7, VAL-9 to
VAL-12, CPY-8, ACT-2a and ANS-4, and split `copy` from `copyWithState`.
Most of the earlier review's Tier 1 items were done by ADRs 0021 to 0025.

Method: each rule document was read against the code, and every claim
below marked **[probe]** was checked by loading a document through
`testing::test_utils::load` and reading cells, diagnostics or the
rendered text. §3 lists what this round changed; its cases are in
`crates/cells-core/tests/principles.rs`, each named by its principle id.

The probes ran at `3583ebf`. The components merged into `cells` after it
(the operators, `sort`, `shuffle`, `sequence`, the random samplers, the
shapes and text markup listed in the README) were not reviewed; where a
row below says a tag is not supported, it means at `3583ebf`.

## 1. The short version

The core's data model is the principles' author model, often more
directly than the current core's. A reference shares cells, so REF-2,
SAVE-2 and CTX-7 hold by construction. A repeat stamps a template per
scope, so COMP-4, COMP-7 and D12 need no code. Every branch of a choice
is built, so COMP-10 needs no stash. Picks are seeded from stable keys
(VAR-1, VAR-2, D17). Every diagnostic is a function of the source
(DIAG-6, DIAG-7). ADR 0021 turns most unsupported features into located
errors instead of silent wrong answers. This review is mostly about the
places where that last property failed.

It found three kinds of gap:

1. **Silent wrong answers.** These are the worst, because an author
   cannot see them. This round found about twenty. Thirteen are fixed
   (§3). The rest are listed in §4.1.
2. **Refusals the principles want supported**: `copy`, `disabled`,
   `hide` beyond a few types, `numItems`, a branch's names seen bare. Each
   is a diagnostic today, so it is a coverage gap, not a wrong answer
   (§4.2).
3. **Decisions in ADRs that differ from a principle**: an index is not
   rounded (ADR 0041 against NAME-2). Credit regrades (ADR 0017 against ANS-1, D16).
   Comma lists split at spaces only (ADR 0041 against VAL-12). These need
   a maintainer call before any code (§4.3). The one about references
   that name nothing was decided for the principle and is done (ADR 0046).

## 2. Status by principle

"Holds" means probed and right; "refused" means a located diagnostic
where the principle wants the feature; "N/A" means the tag or attribute is
not supported, and using it is a diagnostic.

### Names and diagnostics

| id | tier | status |
|---|---|---|
| NAME-0 | 1 | Tags, props and names are exact. **Partial**: attribute names match without case and with no warning (`Dast::attr_peek`; D51 wants w0197). Keyword values are fixed here (§3) |
| NAME-1 | 1 | Nearest scope, a tie never guessed; an ambiguous name is a warning and a blank (ADR 0046). **Partial**: two siblings with one name box the second even unreferenced |
| NAME-2 | 1 | Deep paths and live indices (`$r[$i].x`, ADR 0041) hold. **Partial**: no rounding; `$g[2]` through a one-child group is refused; `$r[$k+1]` is refused |
| NAME-3 | 1 | Holds for extends; `copy` N/A |
| NAME-4 | 1 | **Partial**: an attribute on an extend does not see children written inside it; a child inside an extend sees the clones' names |
| NAME-5 | 2 | **Departs**: attributes resolve from the parent's scope, so `<graph xMin="$k"><number name="k"/></graph>` beside an outer `k` is ambiguous |
| NAME-6 | 1 | N/A, refused |
| NAME-7 | 1 | Holds, and more strongly than the current core: every count is checked (ADR 0012), and no cycle appears after an update |
| DIAG-1, DIAG-2 | 2 | A reference that names nothing is a warning (ADR 0046); no info comes from a tick (ADR 0013) |
| DIAG-3 | 2 | **Partial**: a reference is quoted without its indices (`$nope.x[2]` shows as `'$nope'`); the `PathTooDeep` text is out of date |
| DIAG-4 | 2 | **Partial**: a reader of a box reports again (`cells-boxed-referent`); the bridge drops warnings' nodes and codes |
| DIAG-5 | 2 | **Fixed (§3)**: a cycle and an unread attribute on the root no longer stop the document |
| DIAG-6, DIAG-7 | 2, 1 | Hold by construction (ADR 0013, ADR 0014) |

### References, `extend` and `copy`

| id | tier | status |
|---|---|---|
| REF-0 | 1 | The type is decided at load; a tag whose source names nothing is missing, with a warning (ADR 0046) |
| REF-1 | 1 | **Partial**: bare `$p`, `$g`, `$r`, `$c` are refused (`cells-uncopyable-type`) while their extends work |
| REF-1a | 1 | Holds for inputs (`reads_as`, ADR 0025); `$a` of an answer waits on D21 |
| REF-2 | 1 | Holds |
| REF-3, REF-4 | 1 | Hold for points and containers. The `<math>` extend is **fixed (§3)** for attributes; children written inside a math extend still replace its text |
| REF-4a | 1 | Holds in the bridge (last `<label>` or `<title>` wins) |
| REF-5 | 2 | **Partial**: number and math, and inputs and their value types, hold; `<boolean extend>` is **fixed (§3)**; text from number/math/boolean, math from point and a group of one are refused; `<mathInput extend="$n"/>` is allowed by ADR 0025, against REF-5 |
| REF-6 | 1 | Holds outside the extended subtree (ADR 0023). **Departs** inside it: a reference within a container extend names the source's component, not its counterpart (D43) |
| REF-7 | 1 | Extends of a repeat and an answer are **refused now (§3)**; extends of a select or a conditionalContent are refused (ADR 0009), stricter than D32 |
| REF-8 | 1 | Holds |
| REF-9 | 2 | N/A |
| REF-10 | 2 | Holds since §3: `<math extend="$m" simplify="none"/>` re-reads m's text with its own setting, as does a property extend |
| CPY-1 to CPY-8 | 1, 2 | N/A: `copy`, `copyWithState` and `copySource` are refused |

### Values and attributes

| id | tier | status |
|---|---|---|
| VAL-1 | 1 | `$x.prop` is a value with no hide and no label. **Departs**: an array prop placed in content shows its first cell only (`$P.coords` shows `1`) |
| VAL-2, VAL-10, VAL-11 | 1, 2 | Hold |
| TYPE, TYPE-1, TYPE-3, TYPE-4 | 1, 2 | Hold by construction (ADR 0032) |
| TYPE-5 | 2 | **Fixed (§3)**: a type, tag or keyword attribute written with a reference is refused |
| VAL-3 | 1 | Holds where supported. **Defect**: `<boolean>$P = (1,2)</boolean>` fails the load as an internal error (§4.1) |
| VAL-4 | 2 | **Departs**: formatting reaches `$n` but not `<number>$n</number>` or `$n.value`; lists and `<math>` ignore `displayDecimals` |
| VAL-5 | 1 | Holds since ADR 0046: missing is a value of its own, shown as `＿`, propagated by numbers and booleans, held as a blank by a math, false in a comparison, no credit; `NaN` is a computation's; a `<math>` lowered to numbers shows the blank in its expression (`1 + ＿`) |
| VAL-6 to VAL-8 | 1 | Hold for scalar attributes. A reference in a literal-only attribute and an expression in a flag are **refused now (§3)** |
| VAL-9, VAL-9a | 1 | N/A |
| VAL-12 | 1 | **Departs, silently**: `<numberList>1, 2, 3</numberList>` gives `NaN, NaN, 3` (ADR 0041 decision 9; §4.3) |

### Inherited attributes, interaction and state

| id | tier | status |
|---|---|---|
| CTX-1, CTX-2, CTX-7 | 1 | Hold (ADR 0022): the hold sits on the source's cells, upstream of every alias, so D7 cannot arise |
| CTX-3, CTX-9, CTX-12 | 1 | N/A, refused |
| CTX-4 | 1 | Refused: `disabled` is a diagnostic on every type (D8) |
| CTX-5, CTX-8 | 1, 2 | `fixed` and `fixLocation` inherit. `hide` is read only on point, select and conditionalContent. `styleNumber` is accepted everywhere but never inherited, and the shared bridge does not read it (silent) |
| CTX-6 | 2 | `fixed="false"` on a repeat or a `selectFromSequence` is accepted and does nothing |
| CTX-10, CTX-11 | 1 | **Partial**: display settings and labels follow `referent`, which `<number>$n</number>` and `$P.x` do not have |
| INT-1 | 1 | Holds for numbers and numeric maths. A symbolic `<math>y</math>` cannot be typed into |
| INT-2 | 1 | **Fixed (§3)**: two equal literal maths shared one cell |
| INT-3 | 1 | Holds; `$a+$b` writes `a` by ADR 0026, which needs reconciling with INT-3's table |
| INT-4, SAVE-1 to SAVE-5 | 1, 2 | Hold |
| INT-5 | 2 | Holds for round and clamp; `abs` refuses instead of projecting |
| ACT-1, ACT-2, ACT-2a | 1 | **Partial**: `newValue` is a number or one reference; `triggerWhen` and `disabled` are refused |
| ACT-3 | 2 | **Departs**: a triggerSet's updates all read the values from before it ran |
| ACT-4 | 2 | **Partial**: a bare `$uv` is refused |
| ANS-1 | 1 | **Departs** by ADR 0017: credit regrades (D16) |
| ANS-2 | 1 | **Defect**: `<when>$mi = $c</when>` compares numerically when both sides parse, so two equal symbolic values earn 0 |
| ANS-3, ANS-4 | 1 | Refused (`maxNumAttempts`, an answer typed by a text or boolean input) |
| VAR-1, VAR-2 | 1 | Hold; VAR-3 is changed by ADR 0009, as the principles expect |

### Composites and lists

| id | tier | status |
|---|---|---|
| COMP-1 | 1 | **Fixed (§3)** for elements in math and number text. **Departs**: a `<selectFromSequence>` in a paragraph shows nothing |
| COMP-2 | 1, 2 | Commas for repeats, selects, collects and `asList` groups; whitespace items **fixed (§3)**. The core's own `rendered_text` (labels) has no commas |
| COMP-3 | 1 | **Partial**: a one-entry list in math is NaN with no diagnostic; `<numberList>1 pi</numberList>` gives `1, NaN` |
| COMP-4, COMP-7, COMP-9, COMP-10 | 1, 2 | Hold |
| COMP-5 | 1 | **Fixed (§3)**: the same valueName and indexName panicked the load |
| COMP-6 | 1 | Holds for literal and input indices |
| COMP-8, SEL, SEL-1 to SEL-8 | 1, 2 | Hold for what is supported. `numToSelect` from another selection is refused (ADR 0037); `from="$i" to="$i+1"` is wrongly reported as possibly empty |
| COMP-11 | 1 | **Departs**: a branch's names are not visible bare, and a name some branch lacks boxes the whole choice instead of its reader |
| COMP-12, COMP-14 | 1 | **Partial**: `$g` of a group is refused; a `<setup>` inside math is refused |
| COLL-1 to COLL-3 | 1, 2 | **Partial**: no `numItems`; a group or iteration of one component does not stand for it |
| COLL-4 | 2 | Not reviewed: `sort` and `shuffle` (of numbers) were added after the probes |
| COLL-5, COMP-13, COMP-15 | 2, 1 | N/A |

## 3. Fixed in this round

Each case is a test in `tests/principles.rs`, or the bridge test named.

| id | Was | Now |
|---|---|---|
| COMP-1 | `<math>2 <group>3</group></math>` was 2; `<math>2<number>3</number></math>` was 2 | refused, `cells-unsupported` (`compile/read/maths.rs`, `read/values.rs`, `ir/record.rs`) |
| COMP-5 | `valueName="v" indexName="v"` panicked | `cells-bad-attribute-value` (`stages/outline/mod.rs`) |
| REF-7 | `<repeatForSequence extend="$r"/>` was empty; `<answer extend="$a">` a second, unrelated answer | `cells-banned` |
| REF-5 | `<boolean extend="$n"/>` of 3 was false | `cells-extend-type-mismatch`; a boolean extends what reads as a boolean (`components/mod.rs`) |
| REF-3, REF-10, CTX-1 | `<math extend="$m" displayDecimals="3"/>`, `simplify="none"` or `fixed` showed `＿` | the referent's expression, planned where it sits and read with the extend's own settings (`stages/plan/ctx.rs`) |
| VAL-7, TYPE-5 | `simplify="$b"`, `prefill="$t"`, `type="$t"`, `rigid="$b"` silently ignored or true | `cells-banned`, "must be written as a literal value" (`ir/record.rs`) |
| VAL-8 | `hide="$a - 3"` was always true | `cells-banned`; one reference still binds |
| NAME-0 | `<booleanInput value="TRUE"/>` was refused | keyword values match in any case (`read/values.rs`) |
| INT-2 | two `<math>1</math>`, each bound to an input, shared one cell | a bare-number math is never merged (`stages/share.rs`) |
| DIAG-5 | `<document uniqueVariants>` panicked | a warning; the root cannot be boxed (`stages/link/unread.rs`) |
| DIAG-5, NAME-7 | any value cycle failed the whole load | the component the cycle names is boxed and the rest renders (`compile/graph/cycles.rs`; ADR 0013's amendment) |
| COMP-2 | `<group asList>` over several lines gave `1,  , 2` | `1, 2` (`doenetml-worker/src/cells/bridge.ts`) |
| VAL-5, NAME-1, REF-0, D37, D40 | `x="$typo"` boxed the point; `$l[5]` showed `NaN`, like `0/0`; `$l[5] + 3` was NaN; `＿ and true` was true | a warning and the missing value, which the element holds; shown as `＿`, propagated, false in a comparison; `0/0` stays `NaN` (ADR 0046) |

## 4. What remains

### 4.1 Small and medium, no decision needed

Ordered by how badly an author is misled. The sizes are estimates: S is
under about 50 lines, M a few files.

1. **ANS-2, defect (S to M).** `<when>$mi = $c</when>` compares numbers
   whenever the text parses, so symbolically equal answers earn 0.
   Choose the symbolic comparison when an operand reference is
   math-typed (`stages/plan/condition.rs`).
2. **VAL-3, defect (S).** `<boolean>$P = (1,2)</boolean>` passes the
   seal and the template graph but fails the build's arity check, so the
   load ends with an internal error. One of the two checks misses a
   symbolic operand's leaf.
3. **VAL-1 (S to refuse, M to honor).** An array prop placed in content
   keeps its first cell (`build/expand/mod.rs`, `place`).
4. **COMP-1 (S).** `<selectFromSequence>` in a paragraph renders nothing:
   mark its value rendered and draw it as a number in the bridge.
5. **REF-4 for math (M).** Children inside a `<math>` extend replace the
   referent's text instead of appending.
6. **CTX-5 (S).** `styleNumber` is accepted everywhere and read nowhere
   shared. Either refuse it until the bridge folds it down the tree, or
   fold it.
7. **ACT-3 (S).** Run a triggerSet's updates one tick each, in order
   (`document/request.rs`, `trigger`).
8. **COMP-11 (S then M).** Report a missing interface name on the
   reader, not the choice, so one stray `$cc.x` does not hide the whole
   choice; then make the names visible bare (D13, D22 are decided).
9. **DIAG-3, DIAG-4 (S each).** Quote whole references with indices
   (`dast/mod.rs`, `macro_display`); stop a reader of a box from reporting
   again.
10. **NAME-0 (S).** Match attribute names exactly, with a w0197 warning
    and a suggestion for a case-only mismatch (D51).
11. **VAL-4, CTX-10 (M).** A "display settings from" column beside
    `referent` for a sole-reference child and a property reference; not
    `referent` itself, since VAL-1 says a property has no label.
12. **COLL-1 (S).** A `numItems` alias beside `count` and
    `numComponents`.
13. **REF-1, COLL-3 (M).** Bare `$p`, `$g`, `$r` through the container
    copy path; a wrapper of one component standing for it.
14. **NAME-4, NAME-5 (M).** Plan an element's attribute references from
    the element itself, and keep a copy's clones out of bare lookup.

### 4.2 Coverage, refused today

Each is a located diagnostic, so none misleads; each is a feature to
build: `copy` and `copyWithState` (CPY-1 to CPY-8: paste at compile with
seeds, as the earlier review sketched), `disabled` (CTX-4, after D8),
`hide` on every rendered type (CTX-5), `newValue` as an expression
(ACT-2), an answer typed by its input (ANS-4, D55), extends of a select or
a conditionalContent (REF-7, D32; an ADR 0009 amendment), references
inside an extend naming their counterparts (REF-6, D43), and
`numToSelect` from a selection (COMP-8; an ADR 0037 amendment).

### 4.3 Decisions first

- **A reference that names nothing (VAL-5, REF-0, NAME-1, D37).**
  Decided for the principle, and done by ADR 0046.
- **Comma lists (VAL-12).** ADR 0041's decision 9 splits text lists at
  spaces only, against VAL-12's Tier 1 rule (commas if there is one).
  Porting `splitListItems` from `@doenet/parser` is M once ADR 0041 is
  amended.
- **Rounding an index (NAME-2).** ADR 0041 §3 rejects it; NAME-2 is Tier
  1. The code is S either way.
- **Credit (ANS-1, D16).** ADR 0017's "the answer regrades" against
  credit as a record. If D16 keeps the record, credit becomes an
  essential cell `submit` writes.
- **`$a + $b` typed into (INT-3).** ADR 0026 writes the first operand;
  INT-3's table refuses an expression with two changeable values.
- **`<mathInput extend="$n"/>` (REF-5).** ADR 0025 allows it; REF-5 makes
  it an error.
- **Value-driven infos (DIAG-2).** ADR 0013 rules out a diagnostic from
  a tick. An info that depends on a value would need a condition cell the
  bridge reads.

## 5. Feedback to the principles documents

- **D14 and NAME-7** can be marked done for the cells core: every count
  is checked at load, a cycle boxes its component and the rest renders,
  and no cycle can appear after an update.
- **D17 and VAR-3**: seeding from (seed, stable key) is implemented, so
  adding a random component re-maps nothing.
- **D7**: impossible in the cells model, since the hold sits upstream of
  every alias.
- **NAME-2 and ADR 0012**: a live index reads every item it could name for
  the purpose of the cycle check; the principle could say so, since it
  is what keeps NAME-7 at every count.
- **DIAG-1**: the cells core's diagnostics never depend on a value
  (ADR 0013, ADR 0014). If DIAG-2's value-driven infos stay, the
  principles should say how a core that reports only from the source
  should give them.
