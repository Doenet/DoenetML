---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A hidden `<solution>` or `<givenAnswer>` is left out of printed and PreTeXt output, as other hidden components are. Before, it was printed as an empty block with its "Solution" or "Answer" title.

Compatibility change: for hosts using `saveRendererState`, newly saved renderer-state snapshots no longer include hidden solutions or given answers, so `forceShowSolution` can no longer reveal them from those snapshots. Previously saved snapshots are unchanged.
