import type {
    AccessibilityRecord,
    DiagnosticRecord,
    ErrorRecord,
    InfoRecord,
    Position as DastPosition,
    WarningRecord,
} from "@doenet/utils";
import { isAccessibilityRecord } from "@doenet/utils";
import {
    Diagnostic,
    DiagnosticSeverity,
    Range,
} from "vscode-languageserver-protocol/browser";

/**
 * Convert a DAST `Position` (`{line: 1-indexed, column: 1-indexed, offset?}`)
 * to an LSP `Range` (`{line: 0-indexed, character: 0-indexed}`).
 *
 * `Diagnostic.range` is typed as `Range` and downstream consumers (e.g.
 * `dedupeLspDiagnostics` in `@doenet/lsp-tools`) key on `start.character`
 * / `end.character`; if we pass the raw DAST position through, those
 * fields are `undefined` and the dedupe misses, even though the codemirror
 * plugin's own `normalizePos` papers over the shape difference at render
 * time.  The unquoted-attribute error in #1197 exercised this directly —
 * the LSP-extracted copy (proper LSP shape) and the worker-echoed copy
 * (DAST shape) never matched, so the hover tooltip duplicated.
 */
function dastPositionToLspRange(position: DastPosition): Range {
    return {
        start: {
            line: position.start.line - 1,
            character: position.start.column - 1,
        },
        end: {
            line: position.end.line - 1,
            character: position.end.column - 1,
        },
    };
}

/** CodeMirror/LSP diagnostic with optional editor mark class metadata. */
export type EditorLspDiagnostic = Diagnostic & { markClass?: string };

/** Aggregated counts emitted for editor diagnostics callbacks. */
export type DiagnosticsSummary = {
    warningsCount: number;
    errorsCount: number;
    infosCount: number;
    accessibilityLevel1Count: number;
    accessibilityLevel2Count: number;
};

/** DAST `type` → LSP `DiagnosticSeverity`.  Accessibility records (also
 *  `severity: Warning`) take the dedicated branch in `toLspDiagnostic` to
 *  layer on `code` / `source` / `markClass`, so they aren't in the table. */
const DIAGNOSTIC_TYPE_TO_LSP_SEVERITY: Record<
    "error" | "warning" | "info",
    DiagnosticSeverity
> = {
    error: DiagnosticSeverity.Error,
    warning: DiagnosticSeverity.Warning,
    info: DiagnosticSeverity.Information,
};

/**
 * The heading the editor's tooltip shows over an accessibility diagnostic.
 *
 * `source` is the LSP's slot for the producer's own label for a *kind* of
 * diagnostic, and the CodeMirror tooltip shows it in place of the severity
 * word. It is therefore reader-facing text, and the viewer is where the
 * reader's language is known — the language server has no locale.
 *
 * Defaulted to the English these have always been, so a caller that has no
 * translator to offer (the unit tests, and any host embedding this directly)
 * gets exactly what it got before.
 */
export type AccessibilityHeadings = { level1: string; level2: string };

const EN_ACCESSIBILITY_HEADINGS: AccessibilityHeadings = {
    level1: "WCAG AA Accessibility Violation",
    level2: "Accessibility alert",
};

/**
 * Converts a single editor diagnostic into an LSP-compatible diagnostic.
 * Accessibility diagnostics are surfaced as warnings with custom source/markClass.
 */
function toLspDiagnostic(
    diagnostic: DiagnosticRecord,
    accessibilityHeadings: AccessibilityHeadings,
): EditorLspDiagnostic {
    const range = dastPositionToLspRange(diagnostic.position!);

    if (isAccessibilityRecord(diagnostic)) {
        return {
            message: diagnostic.message,
            severity: DiagnosticSeverity.Warning,
            range,
            code: `accessibility-level-${diagnostic.level}`,
            // Translated, which is why `getDiagnosticHeadingClass` in
            // `@doenet/codemirror` must not be the only thing keying on the
            // English: it matches `code` and `markClass` first, and both are
            // set right here.
            source:
                diagnostic.level === 1
                    ? accessibilityHeadings.level1
                    : accessibilityHeadings.level2,
            markClass: `cm-doenet-accessibility-diagnostic cm-doenet-accessibility-diagnostic-level-${diagnostic.level}`,
        };
    }

    return {
        message: diagnostic.message,
        severity: DIAGNOSTIC_TYPE_TO_LSP_SEVERITY[diagnostic.type],
        range,
        // `code` is where LSP expects the stable name of a diagnostic, and it
        // is what a `codeDescription` link will hang off (#1548). Populating
        // it costs nothing and puts the code in front of any client that
        // renders the field; the CodeMirror tooltip does not yet — it reads
        // `code` only to pick the accessibility heading style, as the branch
        // above relies on. Only records that have migrated to the catalogs
        // carry one (#1518); `code` is optional in LSP, so the rest are
        // unchanged.
        ...(diagnostic.code === undefined ? {} : { code: diagnostic.code }),
        // `data` is the LSP's slot for payload a client hands back later; the
        // one consumer today is `dedupeLspDiagnostics`, which needs the
        // arguments to tell two occurrences of one code apart. A code names a
        // message template, so the same code raised twice on one component
        // with different arguments — `doenet-w0040` for a bad maximum and
        // again for a bad minimum — is two diagnostics at one span, and
        // without the arguments the dedupe would collapse them.
        ...(diagnostic.args === undefined
            ? {}
            : { data: { args: diagnostic.args } }),
    };
}

/**
 * Filters diagnostics based on annotation toggles and maps them to LSP diagnostics.
 */
export function toAdditionalDiagnosticsForLsp({
    diagnostics,
    showInfoAnnotations,
    showAccessibilityAnnotations,
    accessibilityHeadings = EN_ACCESSIBILITY_HEADINGS,
}: {
    diagnostics: DiagnosticRecord[];
    showInfoAnnotations: boolean;
    showAccessibilityAnnotations: boolean;
    accessibilityHeadings?: AccessibilityHeadings;
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
                return true;
            }

            if (diagnostic.type === "info") {
                return showInfoAnnotations;
            }

            if (isAccessibilityRecord(diagnostic)) {
                return showAccessibilityAnnotations;
            }

            return false;
        })
        .map((diagnostic) =>
            toLspDiagnostic(diagnostic, accessibilityHeadings),
        );
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
}): {
    warnings: WarningRecord[];
    errors: ErrorRecord[];
    infos: InfoRecord[];
    accessibility: AccessibilityRecord[];
} & DiagnosticsSummary {
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
        warningsCount: warnings.length,
        errorsCount: errors.length,
        infosCount: infos.length,
        accessibilityLevel1Count: accessibility.filter(
            (diagnostic) => diagnostic.level === 1,
        ).length,
        accessibilityLevel2Count: accessibility.filter(
            (diagnostic) => diagnostic.level === 2,
        ).length,
    };
}
