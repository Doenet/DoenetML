---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Section-wide check work: add a `maxNumAttempts` attribute and rename `documentWideCheckWork` to `sectionWideCheckWork`.

Any container that supports `sectionWideCheckWork` (`<section>`, `<problem>`, `<exercise>`, `<example>`, `<p>`, `<li>`, `<div>`, `<span>`, lists, and the document) now also accepts `maxNumAttempts`. Each press of the section-wide "Check Work" button counts as one attempt; the number of attempts remaining is shown next to the button, and once the attempts are exhausted every `<answer>` inside the container becomes disabled and the button is disabled.

The document's `documentWideCheckWork` attribute is renamed to `sectionWideCheckWork` so the document shares the same abstraction as other containers. `documentWideCheckWork` continues to work as a deprecated alias (with a deprecation warning).

Setting `maxNumAttempts` on an `<answer>` that is inside a container with `sectionWideCheckWork` now emits a warning, since the per-answer limit conflicts with the section-wide limit.

Closes #1308.
