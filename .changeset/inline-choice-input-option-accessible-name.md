---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Viewer: announce inline `<choiceInput>` options by their text, not "[object Object]".

The inline choice input passed each choice's rendered content to react-select as
the option label. React-select stringifies that label for the announcements it
writes to its aria-live region (and for typeahead filtering), so screen readers
heard "[object Object], 1 of 3" instead of the choice text, and typing to filter
the list matched nothing.

Each option now carries its plain text alongside the rendered content: the text
supplies the accessible name and the filter string, while the rendered content —
which may contain math, images, or styled text — is still what is drawn in the
menu and in the displayed value.

With `selectMultiple`, the button that removes a selected choice was likewise
named "Remove [object Object]"; it is now named after the choice text too.

Closes #1613.
