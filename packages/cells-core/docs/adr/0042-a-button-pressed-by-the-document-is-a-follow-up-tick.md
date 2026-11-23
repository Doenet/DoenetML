# A button pressed by the document is a follow-up tick

Status: proposed 2026-11-23. Every migration step is done; see Migration.
Builds on ADR 0040 (actions are named functions beside their types),
whose decision 4 left "an action fired by a condition (`triggerWhen`)"
undecided.

A button (`<updateValue>`, `<callAction>`, `<triggerSet>`) is pressed by
a student, or by the document: when its `triggerWhen` becomes true, or
when a component it waits on acts (`triggerWith`), is clicked
(`triggerWhenObjectsClicked`) or takes focus
(`triggerWhenObjectsFocused`). The second kind of press is a tick of its
own, run after the tick that caused it settles.

## Context

In the current core, a button's `triggerWhen` is a boolean state
variable whose change runs an action (`triggerActionOnChange`): the
action runs when the value is true and the previous value was `false`
(never on the first evaluation, when there was none). `triggerWith`
chains: a component's action, once done, calls `triggerChainedActions`,
which runs every action waiting on it, and a point's `pointClicked` and
`pointFocused` do the same with a `click` or `focus` tag. Three rules
cut across them: a button with `triggerWhen` ignores its `triggerWith`;
a button inside a `<triggerSet>` ignores both, since the set presses it;
and a button pressed any of these ways is hidden.

The cells core carries a student's act out as one tick: requests are
inverted, the essential cells written, the derived ones recomputed, the
structure rebuilt if a count changed (ADR 0004). An action (ADR 0040) is
a function returning requests, carried out the same way. Nothing in a
tick runs an action: the program is a schedule of instructions over
cells, and an action is not one.

The user decided (2026-11-23): when a tick settles, each condition that
went from false to true fires its action as a follow-up tick, in
document order, with a cap on chained firings.

## Decision

### 1. What presses a button, declared

A type a condition presses declares the prop
(`triggers { when: triggerWhen }`), a 0/1 prop its planner wires as a
`<boolean>`'s content (a literal, one reference, or a condition), marked
`read_by_action` so it is live. A component it waits on is an attribute
of kind `After(event)` (`triggerWith: After(Act)`,
`triggerWhenObjectsClicked: After(Click)`,
`triggerWhenObjectsFocused: After(Focus)`), recorded on the plan and
resolved by the build as a `Component` attribute is (ADR 0040). Each
action declares what it is to a component waiting on it: an act, unless
marked a click or a focus (`pointClicked: nothing [Click]`).

### 2. A follow-up tick per press, in document order

`Document::request` and `Document::act` note, before the tick, whether
each pressed component's condition holds. When the tick settles, the
components it presses are those whose condition was false before and is
true now, and those waiting on an event an action of the tick carried
out, the action's own or one it called (a `<triggerSet>`'s children). In
document order, each is pressed (its action `trigger`) as a tick of its
own, noting its conditions and events in turn, so a press may press
others. At most `MAX_FOLLOW_UPS` (64) follow-up ticks run after one
tick; then the rest are dropped. The outcomes fold into the first's
(`TickOutcome::follow_ups` counts them): after a rebuild the cells are
numbered anew, so the folded outcome says it rebuilt and lists no
changed cell.

A component is known across a rebuild by its element and scope, so a
press queued before a rebuild finds its component after it. One that was
not there before the tick (a new iteration's) was not false, and does
not fire, as the current core's first evaluation does not.

### 3. The rules that cut across, in one place

- A component inside one of a type with `triggers` (a `<triggerSet>`'s
  buttons) is pressed only by it: `Built::pressed` leaves it out.
- An element that gives the prop `triggers` names (`triggerWhen`) waits
  on nothing else: planning records no `After` link for it.
- A button pressed other than by a student is hidden: its planner wires
  `hide` to 1 when it gives `triggerWhen` or an `After` attribute.

## Considered options

- **Inside the tick.** Run a rising condition's action while the tick
  recomputes. Rejected: an action reads the settled document and returns
  requests, which the tick would then have to invert midway; and its
  writes could raise other conditions, so the tick would not settle in
  one pass.
- **All presses in one follow-up tick.** Gather every press a tick
  causes into one tick. Rejected: a press reading what an earlier press
  wrote (`triggerWith` reading the target of the button it follows)
  would read the value before it, unlike the current core, which runs
  them in turn.
- **No cap.** Two buttons waiting on each other press each other
  forever in the current core. A cap makes a tick finish; 64 is far
  beyond any chain an author writes on purpose.
- **Fire at load.** Rejected, as in the current core: a condition true
  at load was never false.

## Consequences

- A request no button waits on costs nothing more: a document whose
  `Built::pressed` is empty ticks as before.
- A follow-up tick is a tick: it may be refused, drop requests or
  rebuild, and the outcome says so.
- Saved state is a student's writes; a follow-up's writes are writes
  like a press's, kept the same way, and a restore fires nothing.
- `TickOutcome` gains `follow_ups`.
- `triggerWith` naming an input (the current core chains on an input's
  value change) waits on nothing: a request is not an action. A reference
  to an iteration or a list's entry waits on nothing either.
- A button inside a `<triggerSet>` is not hidden in the core (its
  planner cannot see its parent); the bridge does not draw it, since a
  set draws no children.

## Migration

One step, landed 2026-11-23 with the suite green:

- `Triggers` and `Event` (`components/decl.rs`), `triggers { when: p }`
  and `[Click]`/`[Focus]` in `component!`; `AttrKind::After`.
- `document/act.rs`: `Document::tick_and_follow`, which `request`,
  `act` and the unchecked tick go through; `Built::pressed`.
- `<updateValue>` and `<triggerSet>` move to `components/inputs/` with
  planners of their own (`triggerWhen`, the `After` attributes, `hide`),
  as does `<callAction>`'s. `<updateValue>`'s `newValue` may be math or
  a condition (`not $b`), read by its tokens, and it reads `type`:
  `boolean` reads `newValue` as a condition, `text` takes one reference
  only (a tick makes no text), `number` and `math` are math. A point lists
  `pointClicked` and `pointFocused`, which change nothing.
- `cells-wasm` gains `act_by_name`, the bridge an `act` effect and a
  point's `pointClicked` and `pointFocused` (the prototype's point
  renderer does not send them yet), and the bridge sends a lone
  `<updateValue>` as a button.
- Specs: `components/inputs/update_value.spec.rs` and
  `trigger_set.spec.rs` (a rise, chains, a click, the cap, a set's
  children).
