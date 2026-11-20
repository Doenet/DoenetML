---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

An action reaches what its `target` stands for, an input that isn't focused never shows an edit that wasn't entered, and a one-entry `<textList>` holding a space is kept by a `copyWithState`.

- **An `<updateValue>` or `<animateFromSequence>` whose `target` is a wrapper of one component changes that component.** `target="$g"` of a `<group>` holding one input, `target="$r[1]"` of an iteration holding one `<number>`, and `target="$s"` of a `<select>` picking one option holding one math change it, and so does `$g.value`. Before, they changed nothing, with `doenet-w0044` ("…on a `<group>`"). A wrapper of several components is still only a container, and a bare `<repeat>` target is still `doenet-w0195` (COLL-3).
- **A name after a repeat or a select reaches every item's component.** `target="$r.mi"` changes `mi` in every iteration, as does `$r.mi.value`, and `$r.value` changes the component of each iteration holding one (COLL-2). Before, they changed nothing, with `doenet-w0044`.
- **An input that isn't focused never shows an edit that wasn't entered** (D50). Dragging a point in a graph may not take focus from an input, and a condition can read `$mi.immediateValue` as the reader types, so the edit wasn't always entered. Now an input enters its edit when it is made or shown again, unless it is the input the reader is editing:
  - a `<mathInput copyWithState="$mi"/>` that a drag or typing shows, made while `mi` has an edit not entered, shows the edit entered, not value `1` with `4` typed over it;
  - an input in a case a drag hides while the reader edits it enters the edit when shown again;
  - an `extend` of an input, in a case a drag hides while the reader edits it, enters the edit in the input it extends, which stays shown;
  - a reload enters the edit of every input, not only of the last one edited.

  An input made again with an edit that its value has since replaced (through `bindValueTo`) still shows its value.
- **A `copyWithState` of a `<module>` keeps the carried choices through a one-entry `<textList>` whose entry holds a space**, as `<text>a b</text>`: the nested choice's attribute is held at what the source chose with, with `doenet-w0186`, as for a `<mathList>`. Before, the module attribute written on the copy applied as written.

Items 1, 2, 4 and 5 of #2598.
