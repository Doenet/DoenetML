---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fix a `<pegboard>` removed from a document coming back, and stop it taking a `<label>` it cannot draw.

A pegboard listens for the graph's bounding box changing so that it can re-tile as the graph is panned or zoomed. That listener was never removed. The board outlives a pegboard taken out of the document — one inside a `<conditionalContent>` that switches off, say — so the next pan or zoom found no pegs and built a fresh set. Those pegs belonged to no component, so nothing could ever remove them; only reloading cleared them. The listener is now registered once, when the pegboard arrives, and removed when it goes.

A `<pegboard>` also no longer takes a `<label>`. It fills the whole visible region, so there is nowhere for a label to sit, and none was ever drawn — one written on a pegboard was read and then dropped. It is now reported as the invalid child it is.
