---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Documents that reference a property of a component, such as `<math extend="$P.x" displayDigits="2"/>` or `$mi` inside a `<textList>`, use less memory. Such a reference, or one to an entry of a list, used to make a small component for each display setting and other attribute (such as `hide`) it takes from its source; it now reads them from the source directly. What documents compute and display is unchanged.
