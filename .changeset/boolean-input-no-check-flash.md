---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Viewer: keep an input's eagerly shown value on screen until core answers the action that set it.

Inputs put the reader's change on screen right away and let core confirm it afterwards. Clicking a boolean input sends core two actions, though — `focusChanged` first, then the change itself — and core answers the first while the second is still in flight. That answer carries the value from before the click, so the renderer took the reader's check mark back off and then put it on again once core caught up: a visible flash, and a long one in a document where the change sets off an expensive recompute.

An update that arrives for a component while one of that component's own actions is still in flight now leaves the base state variable alone, since core built it before it had processed the action. Core's answer to the action itself is still taken as it always was, so a value the document refuses — a `bindValueTo` that can't be updated, say — still snaps back.
