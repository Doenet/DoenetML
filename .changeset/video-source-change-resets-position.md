---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

When a `<video>` switches to a different video, such as when its `youtube` attribute is set from a `<choiceInput>`, the new video now starts from the beginning. Before, it could start partway through, at the position reached in the previous video, and the time watched in the previous video counted toward the new one.
