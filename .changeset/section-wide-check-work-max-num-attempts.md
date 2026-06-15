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

Within a `sectionWideCheckWork` container, the attempt count is controlled solely by that container. A `maxNumAttempts` set on an enclosed `<answer>` — or on a nested `sectionWideCheckWork` container — is ignored, and DoenetML emits a warning suggesting that `maxNumAttempts` be set on the (outer) container instead.

Closes #1308.
