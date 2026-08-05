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

// Where a host installs the message catalogs the viewer in *this* bundle reads.
//
// Re-exported rather than left to `@doenet/i18n` because the loaders are
// module-level state and a bundle can hold more than one instance of that
// module: `@doenet/standalone` builds its own copy from source while the viewer
// it renders carries the copy compiled into this package's `dist/`. Installing
// loaders on the first leaves the second — the one that resolves a document's
// language — with none, and an unreachable catalog is a silent fall back to
// English. Reaching the setter through the same entry point the viewer comes
// from makes the two one instance.
export {
    setLocaleLoaders,
    fetchLocaleLoaders,
    type LocaleLoader,
    type LocaleLoaders,
} from "@doenet/i18n";
