# What the machinery reaches

A spike for ADR 0038, after step 7: if the machinery that plans answers,
choices, repeats and collects moved to the components side, how wide would
the context it needs be? Measured on 2026-11-09 at `beb1f7d`. Nothing was
moved.

## What the machinery is

About 1,360 lines in three stages:

| Stage | Where | Lines |
|---|---|---|
| Outline | `outline/answer.rs`, `outline/choice.rs`, the repeat arms of `add_elem_inner` | ~320 |
| Read | `read/answer.rs` (`award_form`, `input_named`, `reject_answer_attrs`) | 147 |
| Plan | `plan/answer.rs`, `plan/choice.rs`, `plan/iterates.rs`, `plan_collect` | ~990 |

`plan/condition.rs` (532 lines) is shared with `PlanCtx::condition` and is
not counted. Downstream of planning, nothing is machinery any more: since
step 7, stamping, the build, the signature and the document read the IR
(`Body::Repeat`, `Body::Choice`, `Body::Collect`, `ChoiceDef`) and the
declarations. Those are the engine's structure and stay wherever the
machinery goes.

## What it does that a planner cannot

A planner (ADR 0034) is a function of one element's record that returns that
element's wiring through `PlanCtx`. The machinery does six things a planner
does not:

1. **Plans other elements.** The answer writes the plans of its awards, its
   whens, its responses and its implicit input; the iterates write the hidden
   iteration elements in the body template, another template. Eight of the
   sixteen plan writes are to an element other than the one being planned.
2. **Makes elements and templates while outlining.** Synthetic responses and
   the implicit input (`push_elem`), a choice's branch templates and its
   `ChoiceDef`, a repeat's body template and its hidden elements
   (`push_template`, `add_synthetic`), and outlining's side tables
   (`settled.when_refs`, `settled.submitted`, `settled.answer_responses`,
   `settled.choices`).
3. **Builds reference plans by hand.** `RefPlan`s with iteration steps (`$fi`'s
   previous iterate, a repeat over `$fi.iterates`), `ar.push_ref`,
   `ar.intern_literal`, `planned.reads`, `boxes.visible`.
4. **Reads the source.** 17 reads of the DAST: the attributes `response`,
   `weight`, `credit`, `hide`, `numToSelect` and each case's `condition`, an
   award's text, and the children of another element (a function's text,
   read by its iterates). The machinery's types declare no `attributes`, so
   none of this goes through a record.
5. **Reads outlining's rows.** 25 reads of `rd.outlined`: its children's
   types, nodes and bodies; `rd.choice`; `rd.settled`.
6. **Fills other types' typed props.** 37 lines name a component's
   `prop::<type>::Props`: 15 fill a whole wiring (an answer's, an award's, a
   when's, a response's, a math input's, a select's, a conditional
   content's, a repeat's, a sequence value's, a number's, a tuple's), 19
   name one port, 3 are imports.

## Conclusion: the context would not be narrow

To move the machinery whole, its context would have to expose 1 to 5:
other elements' plans across templates, making templates and synthetic
elements, hand-built reference plans with iteration steps, the source, and
outlining's rows. That is most of the outline and plan stages' internals.
The components' side would grow by more than the machinery takes with it,
which is the opposite of the aim. **Moving the machinery is not
recommended.**

The machinery is better read as engine: answers, choices, repeats and
collects are DoenetML's structure, as math text is, and an author of an
ordinary component (a value, an input, a shape, a container) never meets
them.

## What shrinks the coupling instead

- **Ports through contracts.** Of the 19 single-port lines, 12 already have
  a declaration that names the port: an input's response port is its
  `ResponseKind` (5 lines), an answer's or a response's `response` and
  `submitted` are its `Submit` (7). The other 7 (an award's `credit` and
  `awarded`, a choice's `credit`, a when's `value`, an answer's `correct`,
  a sequence value's `km`, `scaled` and `value`, a function iterates'
  `count` and `allIteratesWithInitial`) need the role that names the type
  to declare the ports it requires, checked when the vocabulary is made.
- **Wirings through hooks.** The 15 whole-wiring fills move beside their
  types as functions the role names, as `point::props_of` and
  `math::extended` already are for `ExtendValue`. The component side keeps
  its typed `Props`, so a prop left unplanned still fails to compile.
- **Records for the machinery's types.** The answer, the award, the select,
  the conditional content and the repeats declare their `attributes`, and
  the machinery reads typed records as every planner does (ADR 0034): the
  17 source reads go, except an iterates' read of its function's text.

After those three, the engine names no `prop::<type>`, and the machinery's
roles (`Award`, `When`, `Choice`, `Function`, `Response`, `ImplicitInput`,
`Item`, `SequenceValue`, `Index`) are contracts of the machinery, which an
ordinary author never writes.
