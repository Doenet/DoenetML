---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

An `extend` or `copy` written as a different tag than what it references, such as `<math extend="$t"/>` of a `<text>`, is now allowed only between related types. Any other pair is an error shown in place of the reference, where it used to give a default component of the written tag, sometimes with an "Invalid children" warning and sometimes silently. This is a breaking change for documents that relied on that.

The related types are math, number, text and boolean among each other; point, vector and coords among each other; a math from a point, vector or coords, and a point, vector or coords from a math whose value is a tuple; and a math, number, text or boolean from an input, as its value. An angle counts as the math of its measure, and a label as its text. Any other component may also be written as a type it stands in for elsewhere (its adapters), such as an `<ion>` as the `<text>` of its name. A `<group>` may be made from anything. A `<group>` that holds exactly one component counts as that component, and so does a list whose entries are written (`<mathList>`). This is checked only for content fixed when the document loads: a group holding components written in it, other such groups, and references to components. What the document makes as it runs (what a `<conditionalContent>`, `<select>`, `<repeat>` or `<collect>` holds, an iteration, a pick or a case, a list made by a `<sequence>` or `<selectFromSequence>`) is not checked, and is made as before.

The errors say what to write instead:

- a `<p>` or other container that has a text, as a value tag: use `$p.text` (one with no text, such as a `<section>` or a `<graph>`, is any other pair);
- an input made from a value, such as `<mathInput extend="$m"/>`, which used to act as `bindValueTo`: write `<mathInput bindValueTo="$m"/>` to edit `$m`, or `<mathInput prefill="$m"/>` to start from its value;
- a group or a list holding several components, or none, as a value tag, such as `<math extend="$g"/>` of a group of two maths: name the one you want, or write `<math>$g</math>` to read them all as one value. For a list, `$ml[1]` is suggested too;
- any other pair, such as a point as a `<text>`, or a `<collect copy="$cc"/>` of a `<conditionalContent>`, which used to show nothing with the warning "No source found for collect".

When the value of a math or an input, referenced directly, does not allow the tag (a point, vector or coords from a math whose value is not a tuple, or a boolean from one that is not true, false, a relation or a number), it is an info instead, and nothing is shown while it lasts. An `extend` is shown again when the value matches: `<point extend="$m"/>` of a math `x+1` shows nothing, and shows the point once `m` is `(1, 2)`. A `copy` stays as it was made.

`type` on a copy of a tag that reads the text written in it as its `type` (`<sort>`, `<shuffle>`, `<sortIndices>`, `<tally>`, `<indexOf>`, `<searchSorted>`, `<argMin>` and `<argMax>`), such as `<sort copy="$s" type="text"/>`, now decides how the text written in the source is read, as it does on the source. It was ignored.

Closes #2414 and #2415. Implements the part of #2423 for content fixed when the document loads; content made at run time is left to a follow-up.
