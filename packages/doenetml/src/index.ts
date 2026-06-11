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
    creativeCommonsVersions,
    defaultCreativeCommonsVersion,
    // returnAllPossibleVariants,
} from "@doenet/utils";
export type {
    DiagnosticRecord,
    ErrorRecord,
    WarningRecord,
    MediaLicenseInfo,
    CreativeCommonsVersion,
} from "@doenet/utils";

export { CodeMirror } from "@doenet/codemirror";
