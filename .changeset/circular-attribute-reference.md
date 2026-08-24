---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

An attribute that refers back to the component it is on is reported as a
circular dependency instead of hanging the page.

`<selectFromSequence name="a" from="1" to="10" numToSelect="2" exclude="2$a[1]"/>`
asks for a selection that cannot be made until the exclusion is known, and an
exclusion that cannot be evaluated until the selection is made. The two chased
each other — no warning, no error, the tab growing until it ran out of memory —
and the same happened for any attribute written in terms of the component's own
values: `<sequence exclude="$a[1]"/>` and `to="$a[1]"` among them, and the
matching shapes on `<select>`, `<repeat>`, and `<conditionalContent>`.

Doenet had recognized the cycle all along and raised its usual error naming the
components involved; the error was being dropped rather than reported, because
the step that raised it was started and never waited for. It is waited for now,
so the cycle is reported.

The report arrives as the document's failure, which is what a circular
reference has always done — `<math name="m">$m</math>` fails a document the
same way. Confining the report to the component at fault, as a composite that
reports a cycle in its own replacements manages to, is left for later.
