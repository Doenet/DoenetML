---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Add a dynamic `annotations-skeleton` autocomplete snippet for prefigure graphs.

When authoring inside a `<graph renderer="prefigure">`, autocomplete now offers `annotations-skeleton`, which inserts an `<annotations>` tree derived from authored graphical descendants. The generated author-facing annotation text now covers supported prefigure graphical component types (including authored `<function>`), uses explicit coordinate labels where appropriate for accessibility, and includes guidance when a referenced graphical component is unnamed.

This change also aligns Ray coordinate aliases with generated annotation references by supporting `.endpoint.x/.y/.z` and `.through.x/.y/.z` access patterns in core state variables.
