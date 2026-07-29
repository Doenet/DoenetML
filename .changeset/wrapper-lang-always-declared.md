---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Always label the rendered document with the language it was rendered in.

An activity that declared no language — no `<document lang>`, no `documentLocale` from the host — used to render with no `lang` attribute at all, on the theory that inheriting the embedding page's language beat asserting English. But English was not a guess: it is the language the core computes its prose in and the chrome renders in for such a document. So a Spanish page embedding an undeclared activity produced an English "Check Work" and an English "thick red line" inside a subtree the DOM declared as Spanish, and a screen reader read them with a Spanish voice.

The wrapper now always carries the language the content was actually rendered in. Nothing changes for an activity that declares one; an undeclared activity is labeled `en`, which is what it is. An author who wrote in another language and never said so is asked for the same `lang="es"` that already fixes their computed prose and their chrome.
