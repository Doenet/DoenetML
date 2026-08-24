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
and the same happened for any sequence attribute written in terms of the
sequence's own values, `<sequence exclude="$a[1]"/>` and `to="$a[1]"` among them.

Doenet already recognizes a cycle like this one and says which components are
involved; it just never got the chance here, because the resolution of the two
sides never came back to ask. Resolving an item that is already being resolved
now puts the question to that check, and the document reports a circular
dependency naming the components instead of consuming the tab.

The report arrives as the document's failure rather than as an error on the
offending component, which is how a cycle found while the document is being
built — `<math extend="$m" name="m"/>` and the like — is reported. Confining
this one the same way is left for later.
