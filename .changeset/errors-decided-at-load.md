---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

More errors that follow from what an author wrote are now reported when the document loads, wherever the content is: in a `<case>` that is not true yet, in an iteration of a `<repeat>` not made yet, or in an `<option>` a `<select>` did not pick. They used to appear only once a reader's action made that content, so the author did not see them. When the content is made, it shows the same error, and the error is reported once.

- An `extend` that would change what it extends (`<sequence extend="$s" to="5"/>`, `doenet-e0056` to `doenet-e0061`). An extend through an index (`<sequence extend="$r[$n]" to="5"/>` of a `<repeat>` whose iterations each hold one `<sequence>`) is reported once, quoting the reference as written, whatever index it is made with.
- A `<select>` whose `numToSelect` and `withReplacement` are written as literals, with more to select than options (`doenet-e0035`).
- A scalar tag made from a list whose entries are written, when the list does not hold one entry (`<math extend="$ml"/>` of `<mathList name="ml">1, 2</mathList>`, `doenet-e0064`).
- A `<module>` made from something that is not a module (`<module extend="$m"/>` of a `<math>`, `doenet-e0065`).

A list whose `maxNumber` is a value, such as `maxNumber="$n"`, can change how many entries it holds as the reader works, so a scalar tag made from it is now missing (`＿`), with an info, while the list does not hold one entry, rather than an error.

What is not written as a literal, such as `numToSelect="1+2"`, `withReplacement=""`, a list of `<math>` children or a list made from another list, is still decided when the content is made, as before.

Closes #2493.
