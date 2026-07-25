---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Give warnings and errors stable codes, and translate the first of them.

Every diagnostic that has moved into the message catalogs now carries a permanent code — `doenet-w0001`, `doenet-i0001` — alongside its message. A code names one situation forever, so it is something to search for, cite in a bug report, or filter on, and the editor shows it beside the message in the problem list.

Because a diagnostic now carries its code and the values that fill its message in, rather than a finished sentence, it can be shown in the reader's language. Diagnostics follow `uiLocale`, not `documentLocale`: they are addressed to whoever is looking at the screen, so a Spanish-speaking student working a French activity reads the activity in French and its warnings in Spanish. Setting `uiLocale="es"` now reports `<line>`, `<lineSegment>`, `<ray>` and `<vector>` diagnostics in Spanish with nothing else configured.

Lists inside a message are assembled by whichever language ends up rendering it, rather than pieced together as English and handed over as a finished string. So the verb agrees with the list beside it — "slope is ignored" for one attribute against "slope and length are ignored" for two — and a message that has no translation yet keeps both its sentence and its list in English instead of mixing the two.

The remaining messages still report in English and are unaffected. With no locale configured, every diagnostic reads exactly as it did.
