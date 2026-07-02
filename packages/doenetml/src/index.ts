export { DoenetViewer, DoenetEditor } from "./doenetml";
export type { DiagnosticsTabId, DoenetEditorHandle } from "./doenetml";

export {
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
    DiagnosticRecord,
    ErrorRecord,
    WarningRecord,
    MediaLicenseInfo,
    MediaLicenseKind,
    MediaLicenseDisplay,
    CreativeCommonsVersion,
} from "@doenet/utils";

export { CodeMirror } from "@doenet/codemirror";
