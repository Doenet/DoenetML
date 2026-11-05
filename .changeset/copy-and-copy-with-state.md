---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

`copy` writes its source's DoenetML again, and the new `copyWithState` duplicates its source with its state (D33). This is a backward-incompatible change to what `copy` makes.

- **`<T copy="$x"/>` starts fresh**, as if `x`'s DoenetML were written there: it carries none of the reader's changes and none of `x`'s random choices. `<mathInput copy="$mi"/>` starts at `mi`'s prefill, and `<point copy="$P"/>` where `P` was written, whatever the reader did to them. A random component in it, such as a `<select>`, `<selectFromSequence>`, `<shuffle>` or a `<choiceInput shuffleOrder>`, makes its own choices, so two copies of one source differ; they are fixed for a given variant and kept through a reload. A copy of a choosing tag chooses again: `<select copy="$x" numToSelect="4"/>` makes four new picks. Each `<module copy="$m"/>` draws its own values. A `copy` keeps no snapshot of its source; its components save their own state, as written content's do. It still keeps what it was made from through a reload, such as the case of a `<conditionalContent>` it copies part of, and a copy of a property or a list entry holds the value it had when made.
- **`<T copyWithState="$x"/>` is what `copy` was**: it starts with `x`'s current state and random choices, however deeply nested, and keeps that snapshot through a reload. Appearance attributes, `disabled` and `fixed`, and other attributes written on it still apply and take precedence over the carried state.
- **On a `copyWithState`, an attribute that decides what a choosing tag chooses is an error** (`doenet-e0068`), whatever its value, as `numToSelect`, `withReplacement`, a range, `exclude`, a sampler's `numSamples` or distribution, a `<choiceInput>`'s `shuffleOrder` or a `<pretzel>`'s `mode`. So is adding options (`doenet-e0069`): an `<option>` to a `<select>`, a child to a `<shuffle>`, a problem to a `<pretzel>`, or a `<choice>` to a `<choiceInput>` that shuffles its choices. Each says to use `copy`.
- **A `copyWithState` of a `<module>` whose written module attribute reaches a nested choice** (`<module copyWithState="$m" k="4"/>` where `k` sets a nested `numToSelect`) keeps the carried choices, with a warning that says to use `copy` (`doenet-w0186`). The module attribute itself takes the written value.
- **A `copyWithState` of a URI** (`copyWithState="doenet:…"`) behaves as `copy`, with a warning that says to write `copy` (`doenet-w0185`), as a loaded document has no state to carry.
- The language server knows `copyWithState`, including for the attributes of a `<module copyWithState>`.

Closes #2459.
