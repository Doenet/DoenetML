---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Viewer: show the right choice in an inline `<choiceInput>` that has a hidden choice.

A hidden choice still occupies an index, but the inline input looked its selected
choice up by position in the list of *visible* options. Every choice after a
hidden one therefore displayed its neighbor's text — or, for the last choice,
fell back to the placeholder as though nothing were selected. Only the display
was wrong; the recorded answer was always correct.
