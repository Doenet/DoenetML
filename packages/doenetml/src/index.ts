export { DoenetViewer, DoenetEditor } from "./doenetml";
export type { DiagnosticsTabId, DoenetEditorHandle } from "./doenetml";

export {
    getStylePalettes,
    getStylePalette,
    mathjaxConfig,
    cidFromText,
    retrieveTextFileForCid,
    serializedComponentsReplacer,
    serializedComponentsReviver,
    mediaLicenses,
    getMediaLicenseInfo,
    getMediaLicenseDisplay,
    creativeCommonsVersions,
    defaultCreativeCommonsVersion,
    // returnAllPossibleVariants,
} from "@doenet/utils";
export type {
    StylePaletteInfo,
    ResolvedStyleDefinition,
    DiagnosticRecord,
    ErrorRecord,
    WarningRecord,
    ReaderStyleOverrides,
    ReaderStyleValueOverrides,
    MediaLicenseInfo,
    MediaLicenseKind,
    MediaLicenseDisplay,
    CreativeCommonsVersion,
} from "@doenet/utils";

export { CodeMirror } from "@doenet/codemirror";

// For a bundle served from a CDN under a floating tag: pins the URLs it
// resolves its sibling assets against — the core worker, the message catalogs —
// to the release the bundle itself is, so caches cannot pair it with another's.
export { pinPackageVersion } from "./global-config";

// Where a host installs the message catalogs the viewer in *this* bundle reads.
//
// The loaders are module-level state, and a bundle can hold more than one
// instance of `@doenet/i18n` — one built from the host's own source tree, one
// compiled into this package's `dist/`. Only the latter resolves a document's
// language, so a host must reach the setter through the entry point its viewer
// comes from; installing loaders on any other instance leaves the viewer with
// none, and an unreachable catalog falls back to English in silence.
export {
    setLocaleLoaders,
    fetchLocaleLoaders,
    type LocaleLoader,
    type LocaleLoaders,
} from "@doenet/i18n";
