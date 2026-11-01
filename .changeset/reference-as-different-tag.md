---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

An `extend` or `copy` written as a different tag than what it references, such as `<math extend="$t"/>` of a `<text>`, is now allowed only between related types. Any other pair is an error shown in place of the reference, where it used to give a default component of the written tag, sometimes with an "Invalid children" warning and sometimes silently. This is a breaking change for documents that relied on that.

The related types are math, number, text and boolean among each other; point, vector and coords among each other; a math from a point, vector or coords, and a point, vector or coords from a math whose value is a tuple; and a math, number, text or boolean from an input, as its value. An angle counts as the math of its measure, and a label as its text. Any other component may also be written as a type it stands in for elsewhere (its adapters), such as an `<ion>` as the `<text>` of its name. A `<group>` may be made from anything. A composite or a list that holds exactly one component counts as that component: `<number extend="$s"/>` of a select that picked one number, or `<text extend="$cc"/>` while the active case holds a text.

The errors say what to write instead:

- a `<p>`, `<section>` or other container as a value tag: use `$p.text`;
- an input made from a value, such as `<mathInput extend="$m"/>`, which used to act as `bindValueTo`: write `<mathInput bindValueTo="$m"/>` to edit `$m`, or `<mathInput prefill="$m"/>` to start from its value;
- a composite or list holding several components as a value tag, such as `<math extend="$g"/>` of a group of two maths: name the one you want, or write `<math>$g</math>` to read them all as one value. Where an index selects one of them (an entry of a list, or an iteration or a pick that holds one component), `$r[1]` is suggested too;
- any other pair, such as a point as a `<text>`, or a `<collect copy="$cc"/>` of a `<conditionalContent>`, which used to show nothing with the warning "No source found for collect".

When the mismatch depends on what the document makes at run time (which case is active, which option was picked, how many components a collect holds, whether a math's value is a tuple or true or false), it is an info instead, and nothing is shown while it lasts. An `extend` is shown again when the content matches: `<point extend="$m"/>` of a math `x+1` shows nothing, and shows the point once `m` is `(1, 2)`. A `copy` stays as it was made.

`type` on a copy of a tag that reads the text written in it as its `type` (`<sort>`, `<shuffle>`, `<sortIndices>`, `<tally>`, `<indexOf>`, `<searchSorted>`, `<argMin>` and `<argMax>`), such as `<sort copy="$s" type="text"/>`, now decides how the text written in the source is read, as it does on the source. It was ignored.

Closes #2414, #2415 and #2423.
