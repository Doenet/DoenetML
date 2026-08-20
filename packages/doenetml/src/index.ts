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

// `CodeMirror` (and the rest of `@doenet/codemirror`) is exported from its
// own entry point, `@doenet/doenetml/codemirror.js`, so that importing this
// one does not statically pull the editor stack into a viewer-only page —
// the editor loads through the lazy boundary in
// `EditorViewer/EditorViewerLazy.tsx` instead.

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
