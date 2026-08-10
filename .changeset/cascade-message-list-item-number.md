---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Put a held-back cascade step's message on the same row as its number.

A `<problem>`/`<task>`/`<part>` that a `<cascade>` is holding back shows one thing — the `<cascadeMessage>` telling the reader what to finish first — and its number was drawn a line above that message rather than beside it. A list item lines its number up with the first child that renders something, and a held-back step was treated as rendering nothing at all, so the message led nothing: the item dropped out of the numbering layout it uses for every other item and the message kept the top margin that pushed it onto a second row.

The message is now the child such a step lines its number up with, which is what it always was on the screen. Nothing changes once the step is revealed: the message is hidden then, and the content behind it leads as before. Nothing changes for a step with a title or a box of its own either — those draw their number in a heading, with the message below it, exactly as they did.
