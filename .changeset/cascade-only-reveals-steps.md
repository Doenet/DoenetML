---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

`<cascade>` now only reveals its children step by step; it is no longer a section.

A cascade keeps everything about the reveal: `numCompleted`, `hideFutureSections`, `revealAll`, `boxAll`, `<cascadeMessage>`, nested cascades, the step colors (`completedColor`, `inProgressColor`, `notStartedColor` and their dark-mode variants, and `completedColorRequiresCredit`), and numbering the problems inside it as items of a `<problems>`.

What it no longer has is everything that made it a section. It has no title, number or heading, and it no longer changes the heading level of the sections inside it, so a section in a cascade is drawn at the same level as the sections beside it. It has no box and cannot be collapsed. It has no score of its own — no `weight`, `sectionWideCheckWork` or check-work button, and no `creditAchieved` — and a section around it is now scored on the steps inside it directly. A cascade nested directly in another cascade no longer counts as a single step toward the score of a section around them; each of its own steps counts instead, which changes the weights. It no longer seeds variants, so random values inside a cascade may differ from before. The section attributes `level`, `includeAutoName`, `includeAutoNumber`, `noAutoTitle`, `renameTo`, `boxed`, `collapsible` and `startOpen` are gone from it, as are `<styleDefinition>`, `<stylePalette>` and `<feedbackDefinition>` children.

To keep any of those, wrap the cascade in a `<section>` (or another division) and give the section the title, `boxed`, `collapsible`, scoring attributes or `<variantControl>`. A `<title>` written directly in a `<cascade>` is no longer shown, and a warning suggests moving it to an enclosing `<section>`.

List items are now numbered in one sequence through a cascade. In `<problems><cascade><problem/><problem/></cascade><problem/></problems>` the problems are 1, 2, 3 rather than 1, 2, 2, and the same holds for `<exercises>`, for `<part>`s of a problem, and for cascades nested in cascades. Items after a `<repeatForSequence>` whose length changes while the document runs are also renumbered to follow it.
