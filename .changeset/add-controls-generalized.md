---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Generalize point slider controls into an `addControls` feature with graph-level modes. Replace the boolean `addSliders` attribute with `addControls` text attribute supporting `all`, `slidersOnly`, `inputsOnly`, and `none`. Rename the per-point `addSliders` attribute to `addControls` while preserving point-level options (`both`, `xOnly`, `yOnly`, `none`).

New capabilities in `all` mode: sliders are paired with editable inline axis inputs in their labels, allowing users to both drag and type to adjust coordinates.

New `inputsOnly` mode: pure text input controls where users can enter single values or ordered pairs, validated as math expressions before committing.

Authors can now choose the control interaction style that best fits their pedagogical goals: traditional sliders, text input boxes, or a hybrid combining both.
