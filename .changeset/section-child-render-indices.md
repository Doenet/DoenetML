---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Sections: fix children silently disappearing when a section contains a `<stylePalette>`, `<styleDefinition>`, or `<feedbackDefinition>`.

Each of those configuration children shifted the section's rendered-child indices by one, so that many children fell off the end of the section and were never rendered. A section holding both a `<stylePalette>` and a `<styleDefinition>` lost its last two children.
