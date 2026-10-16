---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add `<page>`, which marks the content of one printed page.

On screen a `<page>` is an unformatted container. The sections and problems inside it are numbered along with the ones beside it, and inside a `<problems>` the problems on each page stay items of the list, so `<problems><page><problem/></page><page><problem/></page></problems>` numbers its problems 1 and 2 as before. Exported to PreTeXt and printed, each page starts on a new sheet.
