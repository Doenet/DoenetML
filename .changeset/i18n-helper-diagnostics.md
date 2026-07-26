---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Translate the diagnostics that explain why unique variants could not be
determined, and the warnings the PreFigure graph conversion raises.

These were the largest group of messages still reaching authors only in English.
Three helpers built them on their callers' behalf, so roughly sixty messages sat
behind three diagnostic constructions — invisible to the migration's own
progress count, and unreachable by any translation.
