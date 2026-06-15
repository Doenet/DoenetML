---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Section-wide check work: add a `maxNumAttempts` attribute and rename `documentWideCheckWork` to `sectionWideCheckWork`.

Any container that supports `sectionWideCheckWork` (`<section>`, `<problem>`, `<exercise>`, `<example>`, `<p>`, `<li>`, `<div>`, `<span>`, lists, and the document) now also accepts `maxNumAttempts`. Just like a per-`<answer>` `maxNumAttempts`, each submission counts as one attempt: pressing the section-wide "Check Work" button submits and uses up an attempt, and pressing the button again does nothing until one of the inputs changes (returning the button to "Check Work"). The number of attempts remaining is shown next to the button, and once the attempts are exhausted every `<answer>` inside the container becomes disabled and the button is disabled.

The document's `documentWideCheckWork` attribute is renamed to `sectionWideCheckWork` so the document shares the same abstraction as other containers. `documentWideCheckWork` continues to work as a deprecated alias (with a deprecation warning).

Setting `maxNumAttempts` on an `<answer>` that is inside a container with `sectionWideCheckWork` now emits a warning, since the per-answer limit conflicts with the section-wide limit.

Closes #1308.
