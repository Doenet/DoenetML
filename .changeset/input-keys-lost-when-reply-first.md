---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Viewer: keys typed quickly into a math or text input are no longer lost.

Core sends the renderer update for an action and then replies to the action, but the two reach the viewer on different message channels, so the reply can be handled first. The reply cleared the value the input had put on screen ahead of core, so the update that followed was taken as news: it carried the value from that earlier key, the input redrew with the later keys missing, and the updates for the keys typed since were then ignored as stale. Typed "9081" could end as "90". It took keys arriving in a burst to see it: a fast typist on a slow device, or assistive technology or automation that sends keys quickly.

The reply now marks the value as answered instead of dropping it. It is dropped once the update for that action has been processed, or once the first renderer update for an action sent later has arrived, before or after the reply, which shows that core sent none for it.
