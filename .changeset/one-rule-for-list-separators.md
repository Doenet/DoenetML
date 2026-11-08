---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Every list written as text now separates its entries by one rule: commas if the text has a comma outside brackets, spaces otherwise. `<mathList>x + 1, y</mathList>` is the two entries `x + 1` and `y`, while `<mathList>x y z</mathList>` is still three. The rule covers value lists (`<mathList>`, `<numberList>`, `<textList>`, `<booleanList>`, `<pointList>`, `<vectorList>`, `<intervalList>`, `<tupleList>`), the options of a `<select>`, `<repeat for>`, list attributes such as `vertices`, `variables` and `exclude`, the text of math, boolean and list operators (`<sum>`, `<and>`, `<sort>`, `<tally>`, …), `<sideBySide widths>`, `<graph grid>` and `<angle betweenLines>`.

Parentheses, square brackets and braces keep what is inside them in one entry, and any closing bracket closes any opening one, so `<intervalList>(1, 2], [3, 4)</intervalList>` is two half-open intervals. If a list's brackets don't balance, they are ignored for that list, and a new warning (`doenet-w0188`) says so. With commas, every comma separates two entries, so a trailing comma or two commas in a row give an empty entry (`＿` in a math list). A comma in the value of a reference never makes a list use commas, and a reference in a math or boolean operator is still an operand of its own.

This changes what some documents mean. Text that used both spaces and commas was split at the spaces before, which gave entries such as `(a, ＿)` and `NaN` that an author would not expect, and now it is split at the commas: `<textList>a, b</textList>` was `a,` and `b` and is now `a` and `b`; `<numberList>1, 2</numberList>` was `NaN, 2` and is now `1, 2`; `<pointList>(1, 2), (3, 4)</pointList>` and `<repeat for="1, 2, 3">` now give two points and three iterations. Text written with spaces alone means what it did. The `removeStrings` of a `<mathInput>` is the one exception: it is separated by spaces alone, since a comma is often one of the strings to remove.

Closes #2492.
