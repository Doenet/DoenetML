import type { Position, Point } from "@doenet/parser";

export type { Position, Point };

/** 1 = WCAG AA violation (critical); 2 = advisory recommendation. */
export type DiagnosticLevel = 1 | 2;

export type DiagnosticType = "error" | "warning" | "info" | "accessibility";

type BaseDiagnosticRecord = {
    message: string;
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
    | ErrorRecord
    | WarningRecord
    | InfoRecord
    | AccessibilityRecord;

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
