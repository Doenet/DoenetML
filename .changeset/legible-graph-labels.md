---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Graph labels now render with an opaque background by default so they stay legible when they overlap an axis, grid line, or another object. Hovering or dragging the labeled object raises the label's background/border further so overlapping labels stay readable.

Previously, labels had a transparent background, so a label positioned over an axis or another graphical object could become unreadable.

Set `maskLabel="false"` on a graphical component (or a stand-alone `<label>`) to opt out and restore a transparent label background.
