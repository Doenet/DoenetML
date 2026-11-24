---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Viewer: keys typed quickly into a math input, text input or code editor are no longer lost.

Core sends the renderer update for an action and then replies to the action, but the two reach the viewer on different message channels, so the reply can be handled first. The reply cleared the value the input had put on screen ahead of core, so the update that followed was taken as news: it carried the value from that earlier key, the input redrew with the later keys missing, and the keys typed afterward built on the shortened value. Typed "9081" could end as "90". It took keys arriving in a burst to see it: a fast typist on a slow device, or assistive technology or automation that sends keys quickly.

Core's reply now says whether it sent the action a renderer update. When it did, the viewer keeps the value until that update arrives; when it did not, the viewer lets go of the value at once. An update held back while an input's own action was in flight is now shown if that action changes nothing, so an input no longer keeps showing an old value after, for example, pressing Enter with nothing new to commit while another part of the document changed it.
