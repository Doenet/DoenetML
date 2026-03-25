import { DiagnosticRecord, ErrorRecord, WarningRecord } from "@doenet/utils";
import {
    Diagnostic,
    DiagnosticSeverity,
} from "vscode-languageserver-protocol/browser";

/** CodeMirror/LSP diagnostic with optional editor mark class metadata. */
export type EditorLspDiagnostic = Diagnostic & { markClass?: string };
type DiagnosticPosition = DiagnosticRecord extends { position?: infer P }
    ? P
    : never;

type EditorDiagnosticBase = {
    message: string;
    position?: DiagnosticPosition;
};

export type AccessibilityRecord = EditorDiagnosticBase & {
    type: "accessibility";
    level: 1 | 2;
};

export type InfoRecord = DiagnosticRecord & { type: "info" };

export type EditorDiagnosticRecord =
    | ErrorRecord
    | WarningRecord
    | InfoRecord
    | AccessibilityRecord;

/** Type guard for accessibility diagnostics in mixed diagnostic arrays. */
export function isAccessibilityDiagnostic(
    diagnostic: EditorDiagnosticRecord,
): diagnostic is AccessibilityRecord {
    return (diagnostic as { type: string }).type === "accessibility";
}

/**
 * Converts a single editor diagnostic into an LSP-compatible diagnostic.
 * Accessibility diagnostics are surfaced as warnings with custom source/markClass.
 */
function toLspDiagnostic(
    diagnostic: EditorDiagnosticRecord,
): EditorLspDiagnostic {
    if (diagnostic.type === "error") {
        return {
            message: diagnostic.message,
            severity: DiagnosticSeverity.Error,
            range: diagnostic.position!,
        };
    }

    if (diagnostic.type === "info") {
        return {
            message: diagnostic.message,
            severity: DiagnosticSeverity.Information,
            range: diagnostic.position!,
        };
    }

    if (diagnostic.type === "accessibility") {
        return {
            message: diagnostic.message,
            severity: DiagnosticSeverity.Warning,
            range: diagnostic.position!,
            source:
                diagnostic.level === 1
                    ? "WCAG AA Accessibility Violation"
                    : "Accessibility alert",
            markClass: `cm-doenet-accessibility-diagnostic cm-doenet-accessibility-diagnostic-level-${diagnostic.level}`,
        };
    }

    return {
        message: diagnostic.message,
        severity: DiagnosticSeverity.Warning,
        range: diagnostic.position!,
    };
}

/**
 * Filters diagnostics based on per-type annotation toggles and maps them to LSP diagnostics.
 */
export function toAdditionalDiagnosticsForLsp({
    diagnostics,
    showWarningAnnotations,
    showInfoAnnotations,
    showAccessibilityAnnotations,
}: {
    diagnostics: EditorDiagnosticRecord[];
    showWarningAnnotations: boolean;
    showInfoAnnotations: boolean;
    showAccessibilityAnnotations: boolean;
}): EditorLspDiagnostic[] {
    return diagnostics
        .filter((diagnostic) => {
            if (!diagnostic.position) {
                return false;
            }

            if (diagnostic.type === "error") {
                return true;
            }

            if (diagnostic.type === "warning") {
                return showWarningAnnotations;
            }

            if (diagnostic.type === "info") {
                return showInfoAnnotations;
            }

            if (diagnostic.type === "accessibility") {
                return showAccessibilityAnnotations;
            }

            return false;
        })
        .map(toLspDiagnostic);
}

/**
 * Merges initial and runtime diagnostics, grouped by type for tab display and counters.
 */
export function mergeDiagnosticsByType({
    initialDiagnostics,
    diagnostics,
}: {
    initialDiagnostics: EditorDiagnosticRecord[];
    diagnostics: EditorDiagnosticRecord[];
}) {
    const warnings = [
        ...initialDiagnostics.filter(
            (diagnostic): diagnostic is WarningRecord =>
                diagnostic.type === "warning",
        ),
        ...diagnostics.filter(
            (diagnostic): diagnostic is WarningRecord =>
                diagnostic.type === "warning",
        ),
    ];

    const errors = [
        ...initialDiagnostics.filter(
            (diagnostic): diagnostic is ErrorRecord =>
                diagnostic.type === "error",
        ),
        ...diagnostics.filter(
            (diagnostic): diagnostic is ErrorRecord =>
                diagnostic.type === "error",
        ),
    ];

    const infos = [
        ...initialDiagnostics.filter(
            (diagnostic): diagnostic is InfoRecord =>
                diagnostic.type === "info",
        ),
        ...diagnostics.filter(
            (diagnostic): diagnostic is InfoRecord =>
                diagnostic.type === "info",
        ),
    ];

    const accessibility = [
        ...initialDiagnostics.filter(isAccessibilityDiagnostic),
        ...diagnostics.filter(isAccessibilityDiagnostic),
    ];

    return {
        warnings,
        errors,
        infos,
        accessibility,
        accessibilityLevel1Count: accessibility.filter(
            (diagnostic) => diagnostic.level === 1,
        ).length,
        accessibilityLevel2Count: accessibility.filter(
            (diagnostic) => diagnostic.level === 2,
        ).length,
    };
}
