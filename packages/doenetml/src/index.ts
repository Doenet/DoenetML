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

// Where a host installs catalogs the viewer in *this* bundle will read.
//
// Re-exported rather than left to `@doenet/i18n` because the loaders are
// module-level state, and a bundle can hold more than one instance of that
// module: `@doenet/standalone` builds its own copy of `@doenet/i18n` from
// source while the viewer it renders carries the copy compiled into this
// package's `dist/`. Installing loaders on the first leaves the second — the
// one that actually resolves a document's language — with none, and since a
// catalog that cannot be reached is a silent fall back to English, the whole
// arrangement fails without a word. Reaching the setter through the same
// entry point the viewer comes from is what makes the two the same instance.
export {
    setLocaleLoaders,
    fetchLocaleLoaders,
    type LocaleLoader,
    type LocaleLoaders,
} from "@doenet/i18n";
