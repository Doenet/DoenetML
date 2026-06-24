---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Image: add open-license attribution to `<image>`.

`<image>` gains a set of new attributes for crediting open-licensed images. A new `licenseCodes` attribute accepts a fixed set of open-license codes (the Creative Commons licenses, `CC0`, `PDM`, plus `GFDL`, `FAL`, `OGL`, `MIT`, and `APACHE-2.0`); codes are matched case-insensitively and offered in editor autocomplete in their canonical case, and specifying two codes marks the image as dual-licensed. A new `licenseVersion` attribute selects the Creative Commons URL version (default `4.0`; ignored by other licenses). From the codes the worker derives public `licenseNames` and `licenseUrls`. New `licenseName`/`licenseUrl` attributes provide a fallback used only when no `licenseCodes` are given.

New optional attributes `imageName`, `authorName`, `authorUrl`, and `originalUrl` supply the rest of the attribution. The viewer renders a Creative Commons "TASL"-style credit sentence (e.g. `"Squirrel" by Jane Doe is licensed under a Creative Commons Attribution 4.0 license.`) at the bottom of the image's `<description>` — and shows the same description disclosure UI even when no `<description>` is authored. The license clause is phrased by kind: Creative Commons reads "a <name> <version> license", other licenses read "the <name>", and public-domain dedications read "is in the public domain (<name>)"; dual licenses are joined with "or".

The recognized license list is exported from `@doenet/doenetml` and `@doenet/doenetml-iframe` (`mediaLicenses`, `getMediaLicenseInfo`, `getMediaLicenseDisplay`, `creativeCommonsVersions`, `defaultCreativeCommonsVersion`, and the `MediaLicenseInfo` / `MediaLicenseKind` / `MediaLicenseDisplay` / `CreativeCommonsVersion` types) so embedding apps can build their own license pickers from the same source of truth.
