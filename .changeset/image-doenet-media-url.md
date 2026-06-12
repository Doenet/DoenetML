---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Image: resolve `source="doenet:<id>"` against a configurable media URL.

When an `<image>` specifies `source="doenet:abcdefg"`, the image now loads from `doenetMediaUrl + "/" + imageId` (the middle slash is omitted when `doenetMediaUrl` already ends with `/`). The `doenetMediaUrl` is a new optional prop on `<DoenetViewer>` and `<DoenetEditor>` (defaulting to `https://doenet.org/api/media`), mirroring the existing `doenetViewerUrl` prop.
