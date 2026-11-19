---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Every property's type is decided from the DoenetML when the document loads, never from a value.

- **A tag made from a property is checked at load,** like any other reference: `<point extend="$n.value"/>` of a `<number>` is `doenet-e0065` as soon as the document loads, also in a case not shown yet, and `<math extend="$g"/>` of a `<group>` holding `$P.x` is the math it holds, where before it was `doenet-e0067`.
- **A `<choiceInput>`'s values** are maths when every choice holds one math, and texts otherwise, decided from the choices as written, including those a `<repeat>` makes: `<point extend="$ci"/>` is `doenet-e0065` at load when a text choice is possible, not once a choice appears.
- **A `<slider>`'s value** is of its `type`, and an `<animateFromSequence type="letters">`'s value is a text (before, its type was `letters`, which is no type).
- **A `<tally>`'s categories** are numbers only when every value it counts is a number by its tag, or text that reads as numbers; a `<math>` is still counted by its value, but its category is now a text. A tally with no values yet is typed too, so `<point extend="$t.categories[1]"/>` is decided at load.
- **A `<number>` beside a `<text>` in a `<tally>` or `<markers>` is an error at load** (`doenet-e0076`), as in a `<sort>`. Before, the tally counted them all as text, silently.
- **A `<slider>` and a `<choiceInput>` are values of their type** in `<sort>`, `<shuffle>`, `<sortIndices>` and a repeat's `for`, so a `<choiceInput>` beside a `<number>` is `doenet-e0076` (or `doenet-e0081`) at load, where a choice `10` used to sort before a `<number>9</number>`.
- **`$g.grid` of a `<graph>` is no longer a property,** as its type followed its value.
- **A `<select>` whose `type` isn't `math`, `number`, `text` or `boolean`** reports `doenet-w0145` when it has text to read, as the list operators do, and reads that text as math, as before. A `<select>` of `<option>`s ignores its `type`, and is not reported.

An `<answer>`'s `currentResponses` and `submittedResponses` are not typed at load yet: a tag made from one is still checked once the document runs, and a tag made from a composite holding one is still `doenet-e0067`.
