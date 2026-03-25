import type { Position, Point } from "@doenet/parser";

export type { Position, Point };

export type DiagnosticLevel = 1 | 2;

export type DiagnosticType = "error" | "warning" | "info" | "accessibility";

export type DiagnosticRecord = {
    type: DiagnosticType;
    message: string;
    position?: Position;
    sourceDoc?: number;
    level?: DiagnosticLevel;
};

export type ErrorRecord = {
    type: "error";
    message: string;
    position?: Position;
    sourceDoc?: number;
};

export type WarningRecord = {
    type: "warning";
    message: string;
    position?: Position;
    sourceDoc?: number;
};

export type InfoRecord = {
    type: "info";
    message: string;
    position?: Position;
    sourceDoc?: number;
};

export type AccessibilityRecord = {
    type: "accessibility";
    level: DiagnosticLevel;
    message: string;
    position?: Position;
    sourceDoc?: number;
};

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
