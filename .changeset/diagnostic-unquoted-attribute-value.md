---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor now warns when an attribute value is written without quotes (e.g. `<math name=foo>` → `name="foo"`). The yellow squiggle covers the bare token and the hover message names the corrected form, catching the case where the author dismissed the autocomplete hint or never opened the menu.
