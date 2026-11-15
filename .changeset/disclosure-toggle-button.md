---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

The banner that opens and closes a collapsible section, an `<aside>`, a `<hint>` or a `<solution>` is now a real button. Screen readers announce it as a button that is collapsed or expanded (with `aria-expanded`, and `aria-controls` naming the content while it is open), its name is the title alone, and Space opens and closes it as well as Enter. A collapsible section's heading keeps its level, with the button inside it. Nothing looks different, and a click anywhere on the banner still toggles it. The keyboard focus ring now shows only for keyboard focus. Nothing looks different on a page that embeds the viewer and styles its own buttons either. An open solution that cannot be closed now marks its button disabled, and Enter on it does nothing, as a click already did.
