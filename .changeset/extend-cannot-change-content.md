---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

An `extend` is the same component again, sharing its source's content and state, so writing on it something that would change what its source makes is now an error, shown in place of the extend while the rest of the document renders. It was ignored, mostly with a warning. This is a breaking change for documents that relied on it being ignored.

The error is given for:

- an attribute that decides the content of a tag whose content is made rather than written: `for`, `valueName` or `indexName` on a `<repeat>`; `from`, `to`, `step` or `length` on a `<repeatForSequence>`; `numToSelect`, `withReplacement`, ranges, `exclude` and distribution parameters on a `<select>`, `<selectFromSequence>`, `<selectPrimeNumbers>`, `<selectRandomNumbers>` or a `sample…` tag; `condition` on a `<conditionalContent>`; `componentType`, `from` or `maxNumber` on a `<collect>`; the sort keys of a `<sort>`; the attributes of a `<sequence>`, including `type`; `match`, `replacement` or `type` on a `<substitute>`; `splitBy` on a `<split>`; the attributes of a `<lorem>`; and `mode` on a `<pretzel>`;
- children written inside the extend of such a tag: the template of a repeat, the options of a select, the cases of a `<conditionalContent>`, the children of a `<shuffle>`, `<sort>`, `<substitute>` or `<intersection>`, and the problems of a `<pretzel>`;
- a module attribute on an extend of a `<module>`;
- choices written inside, or `shuffleOrder` on, an extend of a `<choiceInput>`. A choice added this way used to show an empty choice that set the source's selection to nothing;
- an extend of a `<case>`, `<else>` or `<option>`, which means something only in its `<conditionalContent>` or `<select>`.

Each message names the tag, what it makes, why an extend can't change it, and what to write instead, which is usually `copy`. A bare extend, such as `$x` or `<repeat extend="$x"/>`, is never an error, nor is a name, or an attribute that only changes how it looks, such as `hide`, `styleNumber` or `displayDigits`. Children added to an extend of a `<group>` or `<module>` are still added after its own. A bare `<conditionalContent extend="$cc"/>` no longer warns that children written inside it are ignored, and a `<shuffle extend>` given children no longer drops them silently.

Closes #2404.
