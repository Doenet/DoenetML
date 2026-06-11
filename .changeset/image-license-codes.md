---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Image: restrict `licenseCodes` to a known set of open licenses and derive license names and URLs.

`<image>` now recognizes a fixed set of open-license codes (the Creative Commons licenses, `CC0`, `PDM`, plus `GFDL`, `FAL`, `OGL`, `MIT`, and `APACHE-2.0`). Codes are matched case-insensitively and offered in editor autocomplete in their canonical case; specifying two codes marks the image as dual-licensed. From the codes (and a new `licenseVersion` attribute for the Creative Commons URL version, defaulting to `4.0`) the worker derives public `licenseNames` and `licenseUrls`, which the renderer shows as an author/license attribution caption. The `licenseName`/`licenseUrl` attributes remain as a fallback used only when no `licenseCodes` are given. The recognized license list is exported from `@doenet/doenetml` and `@doenet/doenetml-iframe` (as `mediaLicenses`, `getMediaLicenseInfo`, `creativeCommonsVersions`, and `defaultCreativeCommonsVersion`) so embedding apps can build their own license pickers from the same source of truth.
