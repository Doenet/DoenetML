---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: suggest, describe, and insert only text that is actually a reference.

Autocomplete opened on every `.`, including one ending a sentence. It now opens only when the period continues an unfinished reference path — `$P.`, `$P.coords.`, `$rep[1].`, `$(P.` — and a list that is already open closes as soon as the reference ends, so typing `$P.(`, `$P."` or `$P. ` no longer leaves the members of `$P.` on screen.

Three places also offered the forms `$(P).coords` and `$P.(coords)`, which read as a reference followed by literal text: a macro ends at the `)` of `$(P)`, and the grammar has no parenthesized property form. Member completions, the help panel, and the annotation skeleton snippet now all use the form that works.

Completing a member into a path that needs the richer `$(…)` identifier syntax — because of a hyphen, say — rewrites the macro instead of parenthesizing one segment: accepting `my-p` after `$base.my` now gives `$(base.my-p)`, and accepting `p1` after `$s.sub-sec.` gives `$(s.sub-sec.p1)`. The help panel names paths the same way, and the annotation skeleton writes `$(my-seg.endpoints[1].x)`.
