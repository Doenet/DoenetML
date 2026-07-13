---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Image: resolve `source="doenet:<id>"` against a configurable media URL.

When an `<image>` specifies `source="doenet:abcdefg"`, the image now loads from `doenetImagesUrl + "/" + imageId` (the middle slash is omitted when `doenetImagesUrl` already ends with `/`). The `doenetImagesUrl` is a new optional prop on `<DoenetViewer>` and `<DoenetEditor>` (defaulting to `https://doenet.org/api/media`), mirroring the existing `doenetViewerUrl` prop.

Only a source that is exactly `doenet:<id>` (an alphanumeric id) is treated as a media reference; any other `doenet:` source (such as a legacy `doenet:cid=<hash>` form) renders the image placeholder rather than requesting an unknown URL.
