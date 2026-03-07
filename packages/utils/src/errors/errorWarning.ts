import type { Position, Point } from "@doenet/parser";

export type { Position, Point };

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

/**
 * Convert a warning-like record into an error record consumed by Core's
 * `sendErrors` path.
 */
export function warningRecordToErrorRecord<T extends Record<string, any>>(
    warning: T,
) {
    return {
        ...warning,
        type: "error" as const,
    };
}

/**
 * Build the state-variable definition return payload for accessibility checks.
 *
 * When `upgradeWarningsToErrors` is true, warnings are emitted through
 * `sendErrors` so they are surfaced as errors and can create `_error`
 * components.
 */
export function accessibilityWarningsResult<T extends Record<string, any>>({
    setValue,
    warnings,
    upgradeWarningsToErrors,
}: {
    setValue: T;
    warnings: Record<string, any>[];
    upgradeWarningsToErrors: boolean;
}) {
    if (upgradeWarningsToErrors) {
        return {
            setValue,
            sendErrors: warnings.map(warningRecordToErrorRecord),
        };
    }

    return {
        setValue,
        sendWarnings: warnings,
    };
}
