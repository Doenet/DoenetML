import {
    DiagnosticRecord,
    ErrorRecord,
    InfoRecord,
    WarningRecord,
    isAccessibilityRecord,
} from "@doenet/utils";
import {
    Diagnostic,
    DiagnosticSeverity,
} from "vscode-languageserver-protocol/browser";

/** CodeMirror/LSP diagnostic with optional editor mark class metadata. */
export type EditorLspDiagnostic = Diagnostic & { markClass?: string };

/**
 * Converts a single editor diagnostic into an LSP-compatible diagnostic.
 * Accessibility diagnostics are surfaced as warnings with custom source/markClass.
 */
function toLspDiagnostic(diagnostic: DiagnosticRecord): EditorLspDiagnostic {
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

    if (isAccessibilityRecord(diagnostic)) {
        return {
            message: diagnostic.message,
            severity: DiagnosticSeverity.Warning,
            range: diagnostic.position!,
            code: `accessibility-level-${diagnostic.level}`,
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
    diagnostics: DiagnosticRecord[];
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
    initialDiagnostics: DiagnosticRecord[];
    diagnostics: DiagnosticRecord[];
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
        ...initialDiagnostics.filter(isAccessibilityRecord),
        ...diagnostics.filter(isAccessibilityRecord),
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
