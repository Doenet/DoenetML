---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Always label the rendered activity with the language it was rendered in.

The container the viewer renders carries a `lang` attribute even when nobody declared a language — no `<document lang>`, no `documentLocale` from the host. Such an activity is labeled `en`, which is what it is: English is the language the core computes its prose in and the chrome renders in when nothing says otherwise. Were the container left unlabeled, its subtree would inherit the embedding page's language instead, so a Spanish page could wrap an English "Check Work" and an English "thick red line" in a subtree the DOM called Spanish, and a screen reader would read them with a Spanish voice.

An author who wrote in another language and never said so should declare it — `<document lang="es">` — the same fix that already gets them Spanish style descriptions and Spanish chrome.
