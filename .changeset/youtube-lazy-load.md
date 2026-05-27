---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Stop loading the YouTube IFrame API at viewer/editor startup. The `https://www.youtube.com/iframe_api` script is now injected lazily — only when a `<video>` component with a `youtube` attribute actually renders. Documents that contain no YouTube videos make no network request to youtube.com.
