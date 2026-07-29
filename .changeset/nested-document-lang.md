---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Let a nested `<document lang>` reach the rendered page.

An inner `<document lang="es">` already resolved its language in the core and had its computed prose translated, but nothing in the DOM said so: the `lang` attribute was only ever written for the activity as a whole, so a screen reader read the Spanish subtree with an English voice.

The inner document now carries its own `lang` — but only when its language differs from the one already in effect around it. A nested document that merely restates the surrounding language adds no attribute, since the DOM already says it.
