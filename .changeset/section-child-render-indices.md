---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Sections: fix children silently disappearing when a section contains a `<stylePalette>`, `<styleDefinition>`, or `<feedbackDefinition>`.

Each of those configuration children shifted the section's rendered-child indices by one, dropping an equal number of children off the end of the section. A section holding both a `<stylePalette>` and a `<styleDefinition>` lost its last two children.
