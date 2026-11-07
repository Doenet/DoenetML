---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

More errors are decided when the document loads, and none appears while a reader works (DIAG-7).

- **An extend that would change what it extends is an error at load, wherever it is**: `doenet-e0056`, `e0057`, `e0058`, `e0059`, `e0060` and `e0061`, when it is written as the tag it extends (or as a part of a choosing tag). Before, an extend in a case that was not true yet, an iteration not made yet or an option not picked reported its error only once that content was made, so after a reader's interaction. An extend whose index a value decides (`<sequence extend="$r[$n]" to="5"/>`) now reports one error, quoting the reference as written, rather than one for each index it had.
- **A `<select>` with more to select than options is an error at load when `numToSelect` and `withReplacement` are written as literals** (`doenet-e0035`), also in content made later. A `<select>` with no options still selects nothing, with no error.
- **A scalar tag made from a list whose entries are written** (`<math extend="$ml"/>` of `<mathList name="ml">1 2</mathList>`) is an error at load when the list doesn't hold one entry (`doenet-e0064`), also in content made later. This holds when each entry is text with no comma, or a single component that isn't a `<math>`. **When a value can change how many entries the list holds**, as `maxNumber="$n"`, the tag is missing, shown as `＿`, with an info while the list doesn't hold one. Before, it was an error that appeared when the value changed. **The same info and `＿` now replace the error when an entry has a comma or is a `<math>`** (`<mathList>1,2</mathList>`, `<intervalList>(1,2) (3,4)</intervalList>`, `<textList>a, b</textList>`, `<mathList><math>1</math><math>2</math></mathList>`), since how many entries such a list holds is not decided at load.
- **An error reported after the document has loaded is reported as a warning**, and its component is missing (`＿`) rather than an error box, so a reader never sees an error appear. Such an error is a bug: errors are decided at load, from the DoenetML alone.
