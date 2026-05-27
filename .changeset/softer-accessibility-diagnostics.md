---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Make accessibility diagnostics less intrusive in the editor. The squiggle now covers only the opening tag (`<graph`, `<image`, …) instead of the entire multi-line element, so the hover popup no longer follows the cursor across an element's body. The squiggle and tooltip are restyled to a dotted purple to read as advisory rather than as a hard error, and a new "Show accessibility diagnostics in editor" toggle on the accessibility report tab lets authors silence the editor squiggles while still seeing the issues in the report and status button.
