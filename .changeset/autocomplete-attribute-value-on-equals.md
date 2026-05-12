---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Open attribute-value autocomplete immediately after typing `=`. The completion menu now appears with the canonical quoted form in the dropdown (e.g. `"full"`) while still matching on the bare value — so typing `<math simplify=` and picking `"full"` produces `<math simplify="full"`. Typing a partial value right after `=` without a quote (e.g. `<math simplify=ful`) filters the menu and replaces the typed prefix with the fully quoted value on selection. When the author types `"` first, dropdown items display without surrounding quotes since they are already in the source. For free-text attributes that have no enumerated values (e.g. `name`), typing a bare prefix after `=` (e.g. `<aa name=foo`) now offers a single `"foo"` hint that wraps the typed value in quotes on acceptance — an expert who types `"` first sees no menu.
