---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A reader no longer sees an error appear while they work (DIAG-7). Errors should be decided when the document loads, from the DoenetML alone, but some are still found only when content made later is made, such as an extend that would change what it extends (`doenet-e0056`) in a case that isn't true yet. Such an error, reported after load, is now a warning, and its component shows a blank, `＿`, rather than an error box. Errors reported at load are unchanged, as is an error reported at load and again when the content holding it is made.
