---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
"@doenet/doenetml-headless": patch
---

Answers, inputs and actions: composites hold awards and matrix rows, one `submitLabel`, an answer's label on its input, and new warnings where something did nothing silently.

- **An `<award>` inside a composite is the answer's award** (COMP-1, #1874). `<answer><group><award>…</award></group></answer>`, and the same with a `<select>`'s option, a `<repeat>` or a `<conditionalContent>`, used to wrap the composite in a second award, so the authored award never graded (credit 0, with a misleading `doenet-w0107`). Each now grades, one award per award written (two from a `<repeat>` of two), and reads its plain text as the answer's type. A `<setup>` beside an award is no longer wrapped in an award of its own.
- **A `<matrix>`'s rows and columns can come from a composite** (#1873): rows from a `<repeat>`, a `<group>`, a case or an option are the matrix's rows. Before, the matrix was an empty 1×1 with misleading `doenet-w0107`s. A `<math>` beside such rows is ignored, with `doenet-w0194`, as beside rows written out.
- **One `submitLabel`** (D66 decision 15, #349). Its default is "Check Work" when correctness is shown and "Submit Response" when it isn't, and an authored `submitLabel` is used in both cases. `submitLabelNoCorrectness` is retired: it is read as `submitLabel`, with a deprecation warning (`doenet-w0108`), or dropped (`doenet-w0109`) where `submitLabel` is also written. `$a.submitLabelNoCorrectness` no longer exists. This applies to `<answer>` and to the section-wide check-work button.
- **An `<answer>`'s `<label>` labels its one input when the input is written directly in it** and has no label of its own (D66 decision 2, #1674), as it labels an input the answer adds. Before, the label was shown nowhere and the input's accessible name was generic. Where it can't (more than one input, or an input with a label of its own), a new warning, `doenet-w0209`.
- **`<orbitalDiagramInput>` and `<subsetOfRealsInput>` take a `<label>`** and `labelIsName` (CTX-11, #1279), shown above the widget, which it names. Before, a `<label>` was an invalid child.
- **A bare `$choice` in a `<choiceInput>`** (`<choiceInput>$c1 $c2</choiceInput>`) is whether the choice was submitted, so it adds no choice (D21, D42). It now gives a new warning, `doenet-w0210`, that says so and suggests `<choice copy="$c1"/>`, in place of a `doenet-w0107` about invalid `<boolean>` children (#2097). A `<choiceInput>` no longer selects an index past its choices.
- **Two references that name nothing are not each other's responses** (VAL-5, #1853): `<award referencesAreResponses="$nope1"><when>$nope2 = 1</when></award>` records no response, also for indices (`$mis[$nope1]` and `$mis[$nope2]`).
- **A `<callAction>` whose `target` names a property** (`$p.x`, `$p.styleDescription[1]`) names no component and does nothing. It now gives a new warning at load, `doenet-w0211` (#1565), where the property follows a component that is written out and isn't a composite (after a composite, or a component made by `copy` or `extend`, a name may name what it makes or has from its source).
- **From #2657**, after the answer's type was decided from its input (D55):
  - an answer's `type` is trimmed, so `type=" videoWatched "` is a video answer (D67 decision 2);
  - content that is both of another type than the input and a boolean–number mix (`<number>$b</number>` in a `<booleanInput>` answer) gets only `doenet-w0205`, whose advice resolves both (D67 decision 3);
  - `doenet-w0205` for a reference names its value: "`$ti` gives a `text`" (D67 decision 4);
  - `doenet-w0078` (a `type` that names no type) is at the `type` attribute in every answer, a choice answer included (D67 decision 5);
  - an `<award copy>` whose source is outside the answer reads its plain text as the answer's type: `<award name="aw">hello</award><answer><textInput/><award copy="$aw"/></answer>` earns credit for "hello" (it earned 0);
  - an `<answer copy>` with awards of its own uses its source's input, and reads its awards' text as that input's type (it added a second input and earned 0);
  - `doenet-w0205` is given for content of another type inside a composite (`<textInput/><group><math>x</math></group>`);
  - `doenet-w0206` and `doenet-w0207` are no longer given for a reference with an index to a composite holding a `<when>` (`<award>$r[1]</award>`), and are given for a copy of a composite that holds no `<when>`, and for a `<when>` inside a `<p>` in a `<group>`;
  - `doenet-w0207` no longer names an input the answer doesn't add, and `doenet-w0205` is not given then; `doenet-e0092` quotes the `type` as written;
  - what is reported of an answer's own content (`doenet-w0203`) is located at the content (from its first to its last component, or text between the components written around it), not at the whole answer, where that can be told.
