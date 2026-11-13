---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

From outside, content that is not shown acts as missing, and content shown again follows what changed while it was not shown (D40, SAVE-4).

- **An action on content that is not shown does nothing.** A `<callAction>` or `<updateValue>` whose `target` is in a case of a `<conditionalContent>` that is not true, or in an iteration a repeat no longer has, leaves it unchanged and reports an info (`doenet-i0060`), where it acted on it: `<callAction target="$cc.ans" actionName="submitAnswer"/>` pressed while the case was hidden submitted the answer, losing its credit. This includes one triggered by `triggerWhen` as the case is hidden. Once the target is shown again, the action reaches it.
- **Reading content that is not shown no longer changes it.** A paragraph showing `$cc.ans.justSubmitted` while the case was hidden made the answer lose its "just submitted" mark, so a section's check-work button counted the unchanged answer as another attempt. An answer in a repeat that shrinks to no iterations and grows again keeps the mark, whatever reads it meanwhile.
- **Content shown again follows what changed while it was not shown, and keeps what did not.** A `<mathInput bindValueTo="$x"/>` in a hidden case, with `x` changed meanwhile, shows the new value when the case is shown again after a reload, where it showed what was typed before. An answer whose response changed meanwhile is no longer "just submitted" when shown again, in the session or after a reload, and stays so when nothing changed. An input's edit not yet entered is kept as long as its value has not changed. This holds for a case of a `<conditionalContent>` with several cases, which is made again when shown.
- **`copyWithState` of a sampler shows its source's samples.** `<sampleRandomNumbers copyWithState="$s"/>`, and the same for `<samplePrimeNumbers>` and `<sampleMultivariateRandomNumber>`, shows the samples `s` drew, where it drew its own. Samples drawn as the document loads are kept through a reload even when the reader has done nothing since, where a reload drew them again. A `copy` still draws its own.
- **A `copyWithState` of a module keeps its carried choices when a module attribute written as a `<mathList>` or `<textList>` reaches them**, as for a `<numberList>`: `<module copyWithState="$m1" ex="5 7"/>`, where `ex` is the `exclude` of a `<selectFromSequence>` in the module, now gives the warning `doenet-w0186` and keeps excluding what the source excluded, where the written value applied silently.
- **A copy through a `<conditionalContent>` that extends another keeps its case through a reload.** `<p copy="$e.p"/>` with `<conditionalContent extend="$cc" name="e"/>` keeps showing the case it was made from, as `<p copy="$cc.p"/>` does, where a reload made it from the case shown then.

Closes #2152, #2325, #2174 and #2477. Item 2 of #2485.
