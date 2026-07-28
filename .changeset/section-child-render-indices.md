---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Sections: fix children silently disappearing when a section contains a `<stylePalette>`, `<styleDefinition>`, or `<feedbackDefinition>`.

Each of those configuration children shifted the section's rendered-child indices by one, so content at the end of the section was silently dropped — one child for each configuration child present.
