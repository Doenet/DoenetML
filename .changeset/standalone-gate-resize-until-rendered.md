---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Stop the standalone viewer from collapsing its host iframe during boot.

When embedded with `data-doenet-send-resize-events="true"`, the viewer used to start reporting its height to the parent page the moment the React element mounted — before the core had rendered anything. Hosts that honor these messages (e.g. PreTeXt) would shrink the iframe to a sliver while the activity was still loading, and leave it collapsed if the render never completed.

The viewer now waits for the document's first render before reporting heights, and never reports collapse-level heights. Host iframes keep their placeholder size until real content appears, then resize to its true height.
