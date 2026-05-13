---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Improve the editor's context-sensitive help panel.

- The panel now reflects the currently-highlighted autocomplete row. Arrow-key navigation through the popup swaps the help instantly, and closing the popup reverts to cursor-based help. Element, attribute, property (ref-member), `$name` reference, and value rows are all supported.
- Highlighting a snippet row shows the snippet's description and a preview of the template it would insert.
- Help no longer disappears mid-attribute when the cursor crosses tricky parser boundaries: `<math simplify=`, `<math simplify="`, `<math simplify=full`, and similar unquoted-value cases all keep the `simplify` attribute help visible.
- Unknown attributes fall back to element help instead of blanking. Typing `<math bad`, `<math bad=foo`, or having `"foo"` highlighted in the value popup now keeps the `<math>` description on screen.
