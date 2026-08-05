---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: Fix missing property autocomplete and context help for references to a name that is reused across sibling scopes.

Given two `<exercise>` sections that each contain a `<point name="P">`, `$P.styleDescription` resolved correctly at runtime, but typing `$P.` in the editor offered no property suggestions and the context-help panel said nothing about `styleDescription`. Both features now describe the point inside the same `<exercise>` as the reference, matching what the document renders.

The two features share one resolver call, which started its lookup from the enclosing element itself. Since the core searches outward from the origin's *parent* scope, that began the search above `<exercise>`, where both points named `P` are in view — so the core reported an ambiguous name and the editor silently offered nothing. Resolution now starts from inside the enclosing element, the same origin bare-`$P` reference classification already used.
