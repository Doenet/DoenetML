---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A diagnostic caused by a value that can change is now an info rather than a warning, and it lasts only while the value causes it. A warning now means the DoenetML should change; a document waiting for its reader to fill in an input has none. The same check is still a warning when what causes it is written in the DoenetML. No diagnostic codes change.

- **An index from a value that names nothing:** `$l[$i]` or `$r[$i]` while `i` is blank or 0 gives an info, which goes away once `i` names an entry. `$l[0]` is still a warning.
- **An index into a value that is a single expression:** `$m[2]` is an info when `m`'s value can change, such as one that comes from an input. It is a warning when the value is written, as in `<math name="m">5</math>`.
- **Geometry, functions and other math built from values:** for example, a `<circle>` or `<function>` through a point that uses a blank input, a `<line>` or `<ray>` whose points or dimensions come from inputs, a function `domain`, an `<odeSystem>`'s variables, `<solveEquations>`, `<eigenDecomposition>` and `<matchesPattern>` (`doenet-w0002`–`w0004`, `w0006`, `w0008`, `w0017`, `w0027`, `w0031`, `w0035`–`w0040`, `w0042`, `w0045`–`w0048`, `w0054`, `w0056`–`w0059`, `w0082`, `w0117`, `w0122`).
- **Sampling from parameters that come from values:** for example, `<sampleRandomNumbers type="gaussian" standardDeviation="$s"/>` while `s` is blank (`doenet-w0051`, `w0052`, `w0126`–`w0133`, `w0135`–`w0137`, `w0165`, `w0166`).
- **Charts, counts and index operators of values:** for example, a bar chart of a value from an input that is not a number, `bins` or `barWidth` from a value, or `<searchSorted>` of values that are out of order while a student types (`doenet-w0134`, `w0139`–`w0144`, `w0148`–`w0161`, `w0164`). Their infos (`doenet-i0049`, `i0052`) now also go away when their condition ends.
- **A `<collect>` from content that isn't shown:** `<collect from="$cc.S"/>` while the case holding `S` isn't active gives an info (`doenet-w0072`). A `from` that names nothing is still a warning. So is a `componentType` that names no type, unless it comes from a value (`w0073`).
- **The target of an `<updateValue>` or `<animateFromSequence>` that holds nothing now**, such as a composite with no replacements or a list with no entries, gives an info (`doenet-w0043`). A missing target is still a warning.
- **A graph's `grid`, bounds, `width` or `aspectRatio` from a value** that is invalid gives an info (`doenet-w0062`–`w0064`, `w0118`, `w0119`, `w0174`). A `grid` from a reference was silent before.

A copy of a component reports at the same level as its source.

Closes #2422.
