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

The English is otherwise unchanged. The one exception is a PreFigure warning
about a descendant with no component type, which now names it `<?>` rather than
`<unknown>`: the subject of these warnings is handed to the message as an
argument, so an English word there is one no translation can reach.
