---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Viewer: show a `<mathInput>`'s empty slots in dark mode.

When a `<mathInput>` is prefilled with a template that has empty slots — an empty fraction, say, or an empty exponent — each slot is drawn as a shaded box showing the reader where to type. The box was a fixed translucent black, which disappeared against the dark canvas. It is now tinted with the text color, so it shows in both themes. In light mode it looks almost as it did before, only slightly darker.
