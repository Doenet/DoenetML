---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Open attribute-value autocomplete immediately after typing `=`. The completion menu now appears with bare-value labels (no surrounding quotes) and inserts the chosen value wrapped in double quotes — so typing `<math simplify=` and picking `full` produces `<math simplify="full"`. Typing a partial value right after `=` without a quote (e.g. `<math simplify=ful`) filters the menu and replaces the typed prefix with the fully quoted value on selection. Existing behavior when the author types `"` first is preserved (menu items insert without quotes since the quotes are already in the source).
