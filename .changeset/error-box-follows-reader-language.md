---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Render the red error box inside a document in the reader's language, instead of leaving it English beside a Diagnostics panel that was already translated.

The same error reported in two places used to read in two languages: the panel showed the reader's, the box in the document showed the English the worker wrote. The box now renders from the same code and arguments the panel does, so the two agree.

The line the error was found on follows the reader too. It is a message with a line number in it rather than a sentence the worker assembles, so a translation can put the number where its own language wants it.

An error that has no code yet still shows the English it arrived with, unchanged.
