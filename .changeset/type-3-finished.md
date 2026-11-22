---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
"@doenet/doenetml-headless": patch
---

Every type a reference reads is decided from the DoenetML when the document loads, or the reference is an error at load. A type is never worked out as the document runs.

- **A reference to a property whose type the DoenetML doesn't decide is an error at load,** a new `doenet-e0090`, shown in place of the reference. This is an `<answer>` whose responses are of more than one type in places known only as it runs (beside a list whose length can change, responses a `<select>` or `<repeat>` makes, a `<conditionalContent>` whose cases hold different numbers of responses, several inputs of different types written `forAnswer` it, a path resolved only as the document runs), for `$ans`, `$ans.currentResponses`, `$ans.submittedResponse2` and the like, written bare, as a tag (`<math extend="$ans.submittedResponse2"/>`, or `<point extend="$ans"/>`, which reads its submitted responses) or in an expression. The answer itself still grades and records its responses. Before, such a reference was typed by what the run time found, and a tag made from it was checked only once shown.
- **A missing response has its type** (D52): a reference to a `<choiceInput>` with nothing selected, an index past the end of a list, or a missing component is recorded as a missing value of its type (a text `＿`, a math `＿`, a number `NaN`, a boolean `false`), not as a blank math, and its type is decided at load. A reference that names nothing is a blank math.
- **A property made into points or vectors has that type at load** (D52): `$c.center`, `$pl.vertices`, `$pl.vertices[2]`, `$l.points[1]`, `$pg.vertex1` and `$v.displacement` are points or vectors, so `<text extend="$c.center"/>` is `doenet-e0065` at load, also in a case not shown.
- **More answers are typed at load:** an answer whose sugar-made input is skipped or kept as its awards decide, a function as a response (a math in an award), an `<award copy>`, a `<collect isResponse>` of a tag, authored lists of known length (a `<pointList>` beside a `<vectorList>` is points then vectors), an answer made with `copy` or `copyWithState` that writes children of its own, and choices in a `<sort>` or `<shuffle>`.
- **A `<group>` in a `<tally>` or `<markers>`** counts each component it holds toward the one type, so a `<number>` beside a `<text>`, in the group or beside it, is `doenet-e0076`; before, the tally counted them all as texts, silently.
- **An `extend` through a composite gets REF-7's errors:** `<answer extend="$cc" weight="2"/>` of a `<conditionalContent>` holding an `<answer>` in every case (or a `<select>`, or a `<group>`) is `doenet-e0083`, and a `<choiceInput extend="$g">` written with new choices is `doenet-e0058`, at load, as for an extend of the answer or choice input itself.
- **An empty `<tally>`'s categories are texts,** so `<point extend="$t.categories"/>` is `doenet-e0065` there too, where it was missing.
- **An answer's responses of one type are one list,** as for any array property (VAL-1): a bare `$ans`, `$ans.currentResponses` or `$ans.submittedResponses` of an answer with two `<mathInput>`s is a `<mathList>`, where it was two maths. It shows the same in a paragraph. Responses of more than one type are still one component of each.
- No type is saved with an answer's submitted responses; a type saved by an earlier version is ignored.
