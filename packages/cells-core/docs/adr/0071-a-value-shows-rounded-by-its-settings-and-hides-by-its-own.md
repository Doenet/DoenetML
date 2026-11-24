# A value shows rounded by its display settings, and hides by its own `hide`

Status: proposed 2026-11-24. From the sweep-3 triage of the wrong values
in the copying, `<math>`, `<mathInput>` and `<answer>` tests. Follows ADR
0058 (display settings are props; its open item on a setting taken from a
sole child), ADR 0024 (a reference presents as its referent) and ADR
0046 (missing shows as the blank).

## Context

The largest single cause of a wrong value in those files was rounding.
The current core writes a `<number>`'s and a `<math>`'s `text`, and its
`valueForDisplay`, rounded by the number-display settings
(`utils/numberDisplay.js`: 3 significant digits and at least 2 decimals by
default), and a paragraph's text is its children's texts, so `<p>$n</p>`
shows `5.12` for `5.123456`. The cells core rounded only a math's LaTeX
(the bridge's `mathLatex`, ADR 0058): its own text (`rendered_text`, what
a container's `text` reads) printed every number to ten significant
digits, the bridge drew a `<number>` the same way unless it had
`displayDecimals`, and the parity adapter read `valueForDisplay` as the
value. ADR 0058 left a setting taken from a sole child open
(`<number>$n</number>` shows as `n` does).

The second cause was `hide` on a value: `<math name="xy" hide>x+y</math>`
(or an `<m>`),
the answer key the answer tests write, was refused as an attribute
nothing reads, so the `<math>` became an error and the answer compared
against the missing value; `<text hide>` likewise.

## Decision

1. **The core's text rounds.** A type that declares the display settings
   (`<number>`, `<math>`) shows its value in text rounded and written by
   them, as the current core's `text` (`sym::Display::text`,
   `number_text`). The settings are resolved by ADR 0058's rule, the
   nearest of the component and its referents writing each, digits and
   decimals together, now also in the core (`Document::display_settings`,
   `document/display.rs`), since the text the core composes for a
   container needs them; the bridge keeps its own walk for LaTeX
   (`contracts.ts`, `displaySettings`), the same rule. The core exports
   the settings, the rounded text and the rounded value
   (`display_settings`, `display_text`, `display_ast`,
   `number_display_text`, `number_display_value`); the bridge draws a
   `<number>` with the rounded text (`Reads.numberText`), and the parity
   adapter reads `text`, `valueForDisplay` and the settings through them.
2. **A sole child's settings.** An element that writes a setting neither
   itself nor through its coupled one (digits with decimals) and whose
   children are one bare reference (`<number>$n</number>`: no text beside
   it, no index, no prop) to a component whose type has the setting takes
   that setting by reference (`plan_display`, `sole_child_setting`), as
   the current core's `childGroupsIfSingleMatch`. An operand is no sole
   child: `<number>$n+1</number>` and `<number>2$n</number>` take the
   defaults.
3. **A value's `hide` is a presentation setting.** `<number>`, `<math>`,
   `<text>`, and the containers `<p>`, `<m>` and `<md>`/`<me>`, declare `hide`, planned as a display setting is
   (`PropFrom::Display`): written bare or `true` on, `false` off, or a
   reference a tick may change, and not given (NaN) without the
   attribute. A reader takes it from the nearest of the component and its
   referents that gives it (`hiddenByHide` in the bridge,
   `Document::hidden_value` in the core), so an extend of a hidden value
   is hidden unless it says `hide="false"`, and a bare reference, which
   aliases its referent's cells, is hidden with it, as the current core's
   copies are. A hidden value is not drawn and is not in its parent's
   text; its own text is unchanged.

## Consequences

- `text`, `valueForDisplay` and the drawn `<number>` agree with the
  current core's rounding (`document/display.rs` tests, the bridge
  test). A number in a container's text is rounded as it is drawn.
- Each `<number>`, `<math>`, `<text>`, `<p>`, `<m>` and `<md>` has one
  more prop, `hide`,
  a constant NaN cell unless written; the spec cost snapshots of the
  types that hold numbers count it.
- The core resolves the display settings twice over, once in Rust for
  its text and once in the bridge for LaTeX, by one rule.

## Not done, and why

- **A lowered `<math>` reads as its number.** `<math>$n+1</math>` with `n`
  a number is lowered to a numeric chain (ADR 0005), so its value is `6`
  where the current core's is the expression `5 + 1`, unsimplified
  (`$a/4` is `-0.75`, not `-3/4`). Showing the expression would mean
  instantiating it on every change (ADR 0046 decision 6 does so only
  while the value is missing). A question for the maintainers: keep the
  number, or keep the expression for a math that is not simplified.
- **A setting given by an expression** (`displayDigits="2+2"`) is not
  evaluated, and a setting written but not a number
  (`displayDigits="bad"`, or `$n` holding `x`) is not given, so the
  referent's or the default applies, where the current core shows all
  digits (ADR 0058's rule that a NaN cell writes nothing).
- **The settings of a point, an operator and a `<mathInput>`**, still not
  props: `<math extend="$P.x"/>` does not take the point's digits, and a
  `<math>$mi</math>` not the input's.
- `hide` on the other types (the lists, the inputs, the other
  containers).

## Migration

- *Done 2026-11-24:* decisions 1 to 3; ADR 0058's open item on a setting
  taken from a sole child (its first part: a reference child; a setting
  of a point or an operator is still open).
