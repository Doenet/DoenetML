---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A value computed from a missing input is missing, `null` is never shown, and an angle with no measure is blank (D40).

- **A number or a boolean computed from a missing input is missing**, shown as `＿` and never equal to anything, where a number was `NaN` and a boolean took the missing operand as not true. A math still holds the blank: `<math>$nothing + 1</math>` is `＿ + 1`.
  - `<number>$nothing + 1</number>` and `<number>$l[5] + 1</number>` past the end of `l` are `＿`, not `NaN`. A `NaN` from inputs that are all there (`<number>x</number>`, `<number>0/0</number>`) stays `NaN`, and `valueOnNaN` still applies.
  - An operator over numbers with a missing number among them is `＿`: `<sum>`, `<mean>`, `<product>`, `<min>`, `<max>` and the others of `<numberList>1 $nothing 3</numberList>`, and `<sum>$l[5] 3</sum>` of a `<numberList>`, where they were `NaN` or `＿ + 3`. Over maths, the blank takes part as before (`<sum>` of a `<mathList>` with a blank entry is `1 + ＿ + 3`), and `<count>` still counts a missing operand.
  - An operator whose `NaN` comes from a blank or missing input is `＿`: `<median><math>＿</math></median>`, `<clampNumber>$nothing</clampNumber>`, `<wrapNumberPeriodic>$nothing</wrapNumberPeriodic>`.
  - A numeric function (`symbolic="false"`) evaluated at a blank is `＿`, whether by `<evaluate>`, `$$f($nothing)` or an input not yet submitted (`input="$ans.submittedResponse"`), where it was `1 + ＿`. A symbolic function, the default, still holds the blank (`1 + ＿`). A function that is missing (one `through` a missing point) evaluates to `＿`, where it gave a number.
  - `not`, `and` and `or` with a missing operand are missing, whatever the other operand: `<boolean>not $nothing</boolean>`, `<boolean>$nothing or true</boolean>`, `<and>$nothing true</and>` and `<or>$nothing true</or>` are `＿`, not `true` or `false`. An award whose `<when>` is one gives no credit. A comparison is unchanged: `<boolean>$nothing = 1</boolean>` is `false`, as a blank never equals anything. So is a test such as `<isNumber>$nothing</isNumber>`.
- **A property that holds `null` has no value, so a reference to it is missing** (`＿`), where it was empty text, `NaN`, or, recorded by an answer, an empty text: an `<award>`'s `feedbackText` with none, a `<summaryStatistics>`'s `mean` of no values, a chart's `yMin` and `yMax` when it was not drawn, an unnumbered equation's `equationTag`. This was the rule only for `maxNumber` of a `<collect>`.
- **A blank entry of a list is a blank in what is read of it**: `$nl.text` of `<numberList name="nl">1 $nothing 3</numberList>` is `1, ＿, 3`, not `1, NaN, 3`, a `<booleanList>`'s is `＿`, not `false`, and the `matrixSize` of a blank entry of a `<mathList>` is `＿`, not `1, 1`. A list of a property of every entry, such as `$pl.y` of a `<pointList>`, marks its blank entries, and a `<math>` child of a list whose content is only a missing reference (`<mathList><math>$l[$i]</math> 3</mathList>`) is a blank entry.
- **A `<math>` reads a missing child holding `NaN` as a blank**: `<math><number>$nothing</number></math>` and `<math><math extend="$n"/></math>` of a missing `n` are `＿`, not `NaN`.
- **An `<angle>` whose measure nothing gives or determines is blank**, not a right angle: a bare `<angle/>`, an angle `through` one or two points, and one `betweenLines` of one line, each with no `radians` or `degrees`, have `radians` and `degrees` of `＿` and draw nothing. Add `radians="pi/2"` where a right angle was meant. An angle `betweenLines` of one line whose `radians` has no value (`radians="$nothing"`) is blank too, where it stopped the document from loading.
- `width` and `height` of a `<subsetOfRealsInput>` are `800px` and `300px`, where they read `undefined%`.
- A reference to a few properties that are a list or text shown as a number, such as `$P.scales` of a point, no longer stops the document from loading.
- Typing in an input read by a component that can be missing for a while (`<number>$x</number>`) no longer has its parent re-check what it draws on each keystroke; it does so only when whether the component is missing changes.

Closes #2324, #2516 and #2460. Item 5 of #2525, and the part of item 4 about a list.
