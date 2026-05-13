---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Redesign the editor's footer and the diagnostics/responses/help panel.

- The diagnostics tab strip and the `Format`/version bar collapse into a single thin footer row. The panel meets the editor with just a slim resize handle (no extra header row).
- Footer layout: DoenetML version on the far left, then a `</> Context` tab for context-sensitive help, the four diagnostics tabs (errors / warnings / info / accessibility) in their own group, a submitted-responses tab in its own group, and a three-dot menu on the far right.
- Tabs themselves are the open/close affordance — click one to open the panel on that tab, click the active one to close. The close-X is gone.
- The three-dot menu (when the formatter is enabled) offers `Format as DoenetML` / `Format as XML` directly; the separate Format dropdown + button row is gone.
- New `showHelp` prop on `DoenetEditor` controls the help tab independently of `showDiagnostics` / `showResponses`.
- `initialOpenTab` now defaults to opening the panel on the help tab (or the first available tab). Pass `initialOpenTab={null}` to mount with the panel closed.
- The panel opens to ~¼ of the editor height and only snaps closed when dragged well below that.
- The virtual keyboard's open-keyboard tab moves to the lower right so it no longer overlaps the footer.
- The DoenetML version reads `v…` and truncates with ellipsis + tooltip for long dev tags.
