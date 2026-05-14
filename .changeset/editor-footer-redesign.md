---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Redesign the editor's footer and the diagnostics/responses/help panel.

- The diagnostics tabstrip and the `Format`/version bar collapse into a single footer row: version on the left, then a `</> Context` help tab, the four diagnostics tabs (errors / warnings / info / accessibility), a submitted-responses tab, and a three-dot menu on the right with `Format as DoenetML` / `Format as XML`.
- Tabs are now click-to-toggle — click a tab to open the panel on it, click the active tab to close. The close-X is gone.
- New `showHelp` prop on `DoenetEditor` (default `true`) controls the help tab independently of `showDiagnostics` / `showResponses`.
- `initialOpenTab` now defaults to opening on the help tab (or the first enabled tab). Pass `initialOpenTab={null}` to mount with the panel closed.
- The panel opens to ~¼ of the editor height; the virtual keyboard's open-keyboard tab moves to the lower right so it no longer overlaps the footer.
