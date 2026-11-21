---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<fractionInput>` made with `extend` no longer warns of children that weren't written, a disabled or read-only input never shows an edit that wasn't entered, and two more `<variantControl>` mistakes are errors.

- **A `<fractionInput>` made with `extend` no longer warns that children written inside it are ignored (`doenet-w0169`)**, when none were written. A `<fractionInput>` made with `extend`, `copy` or `copyWithState` now has only the two input boxes it gets from its source. Before, it was given two more of its own: an `extend` ignored them, with that warning, and a `copy` or `copyWithState` had them after its source's two, not shown, holding the same value.
- **An input disabled while it holds an edit not entered enters it** (D50). A disabled input can't be focused, so it is treated like one that is hidden: the edit is entered when the input becomes disabled (by a drag that doesn't take focus from it, by what is typed into it, or by another input's edit being entered), and an input made disabled with an edit not entered (at a reload, or in a case shown again) enters it as it is made. The `answered` event is recorded, as when the reader leaves the input. Before, the input kept showing the edit, also after a reload and after being enabled again.
- **Under `readOnly`, an input reloaded with an edit not entered shows the edit entered**, as its value. Nothing is saved, and no event is recorded. Before, it showed the edit typed over its value.
- **An error while entering an input's edit after a request no longer rejects that request**, whose work was done, and the other inputs waiting are still entered. The error is logged.
- **An empty `numVariants=""` on a `<variantControl>` is an error (`doenet-e0072`), and is ignored**: the default of 100 variants is used, and its other attributes are followed. Before, it gave one variant, silently. `<variantControl numVariants/>`, which was an error that made the whole `<variantControl>` ignored, now ignores only `numVariants`.
- **A `<variantControl>` made with `extend`, `copy` or `copyWithState` is an error (`doenet-e0088`), and is ignored.** A document's variants are decided before anything else in it, so what the attribute references can't be read; write its attributes out instead. Before, `<variantControl extend="$vc"/>` was ignored silently, and with a reference among its attributes, as `numVariants="$n"`, the document didn't load ("Invalid reference in a primitive attribute").
- **`doenet-w0044` writes the index of a property an action's target doesn't have**, as `styleDescription[1]`. Before, it wrote a literal `[idx]`.

Items 3–9 of #2614.
