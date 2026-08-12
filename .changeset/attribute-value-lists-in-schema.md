---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: offer the values of `renderMode`, `marker`, and `grid` in autocomplete and context help.

Each of these attributes accepted a fixed set of words that lived only in the
renderer's `if`/`else` chain, so the schema surfaced them as free text and an
author had no way to discover or check what to write.

- `<math renderMode>` now declares `inline` and `display` and matches them
  case-insensitively; an unrecognized value falls back to `inline` with a
  diagnostic instead of silently rendering inline. The renderer's other two
  modes are deliberately not offered on `<math>`: `numbered` needs an equation
  tag that only `<me>`, `<men>`, and `<odeSystem>` supply, and `align` needs `&`
  markers that a `<math>` expression cannot carry — use `<md>` for that.
- `<odeSystem renderMode>` is deprecated and removed. `align` was always its
  only workable value — the rendered LaTeX carries `&` markers and its own
  `\tag`, which no other mode's delimiters can hold — so the mode is now fixed
  by the component. The attribute is dropped during DAST normalization with a
  deprecation warning, so existing documents keep working and render as before
  rather than failing on an unknown attribute. (Since the mode is no longer an
  attribute, `$theOdeSystem.renderMode` is no longer available as a public
  reference.)
- `marker` is split per tag, since the two sets do not cross. `<ul>` declares
  `disc`, `circle`, and `square` and enforces them: they are the complete set,
  so they now match case-insensitively and an unusable value is reported
  instead of silently reverting to the level default. `<ol>` offers `1`, `a`,
  `A`, `i`, and `I` as suggestions only, because the renderer matches on the
  first character and decorated forms like `1.` or `a)` are legitimate.
- `<graph grid>` lists its values as suggestions too, since it also accepts
  two numbers for the spacing, and now offers `1 1` and `2 2` alongside the
  named spacings so the numeric form stays discoverable.
