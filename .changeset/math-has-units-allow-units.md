---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A number check can now refuse a quantity written with a unit, so `50%` need not
count as a number between 0 and 1.

`50%` is worth `0.5`, and every numeric check in Doenet went by what a value is
worth: `<isNumber>`, `isnumber(...)`, and the inequalities all accepted a
percent, and nothing an author could write told the two apart. `<math>` had an
`isNumber` property that did tell them apart, but only because it demanded the
expression be spelled as a bare number — it turned down `1/2` as readily as
`50%`.

Two additions close that gap:

- `<math>` gains a `hasUnits` property, true when the expression contains a
  quantity written with a unit — a percent, a currency such as `$5`, or an angle
  such as `30 deg` — anywhere within it.
- `<isNumber>` and `<isInteger>` gain an `allowUnits` attribute, defaulting to
  `true`. With `allowUnits="false"` they refuse `50%` while still accepting
  `0.5`, `1/2`, and every other unit-free way of writing the same value. The
  same attribute is available on `<boolean>`, `<when>`, `<award>`, and
  `<answer>`, where it governs the `isnumber(...)` and `isinteger(...)`
  functions, so both spellings of each check treat units the same way.

Set on an `<answer>`, `allowUnits` carries down to the awards and conditions
inside it, and reaches both spellings alike: `<isNumber>` written inside an
award picks it up just as `isnumber(...)` does. An `<isNumber>` or
`<isInteger>` takes the setting from whatever component encloses it, so a
`<boolean allowUnits="false">` governs the tags nested in it too. One written
with nothing relevant around it keeps the default of allowing units.

So an answer that wants a decimal rather than a percent can now say so:

```
<answer allowUnits="false">
  <mathInput name="mi"/>
  <award><when>isnumber($mi) and 0 <= $mi <= 1</when></award>
</answer>
```

`allowUnits` governs the number checks only. Inequalities and equality
comparisons continue to use what a value is worth, so `50% = 0.5` remains true.
