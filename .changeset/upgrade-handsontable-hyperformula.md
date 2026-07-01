---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Spreadsheet: upgrade `handsontable` to v18.0.0, `@handsontable/react-wrapper` to v18.0.0 (replaces `@handsontable/react`), and `hyperformula` to v3.3.0.

No changes to `<spreadsheet>` markup or formula syntax — existing content continues to work as-is. Floating-point formula results may differ very slightly (HyperFormula now rounds at 10 significant digits, matching Excel/Google Sheets behavior). The spreadsheet visual appearance is preserved via the Classic theme.

Closes #1391.
