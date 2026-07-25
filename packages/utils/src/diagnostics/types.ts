import type { DiagnosticArgs, DiagnosticCode } from "@doenet/i18n";
import type { Position, Point } from "@doenet/parser";

export type { Position, Point };

/** 1 = WCAG AA violation (critical); 2 = advisory recommendation. */
export type DiagnosticLevel = 1 | 2;

export type DiagnosticType = "error" | "warning" | "info" | "accessibility";

type BaseDiagnosticRecord = {
    /**
     * The diagnostic as a finished sentence.
     *
     * Always present, even on a coded record. The worker always writes it in
     * English — that is what its dedupe keys on, and what the worker's own
     * tests assert — and `DocViewer` re-renders it in `uiLocale` on the way
     * out, so a host reading `setDiagnosticsCallback` sees the reader's
     * language. A code with no translation in the negotiated locale keeps the
     * English.
     */
    message: string;
    /**
     * The stable code naming this situation, for records that have migrated to
     * the catalogs (#1518). Absent on a legacy diagnostic, whose English
     * string is all there is.
     */
    code?: DiagnosticCode;
    /**
     * The values filling the coded message's blanks, kept as data so the main
     * thread can re-render the message in the reader's language.
     */
    args?: DiagnosticArgs;
    position?: Position;
    sourceDoc?: number;
};

export type ErrorRecord = BaseDiagnosticRecord & {
    type: "error";
};

export type WarningRecord = BaseDiagnosticRecord & {
    type: "warning";
};

export type InfoRecord = BaseDiagnosticRecord & {
    type: "info";
};

export type AccessibilityRecord = BaseDiagnosticRecord & {
    type: "accessibility";
    level: DiagnosticLevel;
};

export type DiagnosticRecord =
    ErrorRecord | WarningRecord | InfoRecord | AccessibilityRecord;

export function isErrorRecord(
    diagnostic: DiagnosticRecord,
): diagnostic is ErrorRecord {
    return diagnostic.type === "error";
}

export function isWarningRecord(
    diagnostic: DiagnosticRecord,
): diagnostic is WarningRecord {
    return diagnostic.type === "warning";
}

export function isInfoRecord(
    diagnostic: DiagnosticRecord,
): diagnostic is InfoRecord {
    return diagnostic.type === "info";
}

export function isAccessibilityRecord(
    diagnostic: DiagnosticRecord,
): diagnostic is AccessibilityRecord {
    return (
        diagnostic.type === "accessibility" &&
        (diagnostic.level === 1 || diagnostic.level === 2)
    );
}
