import {
    ErrorRecord,
    InfoRecord,
    WarningRecord,
    isErrorRecord,
    isInfoRecord,
    isWarningRecord,
} from "@doenet/utils";

type AccessibilityRecord = {
    type: "accessibility";
    level?: 1 | 2;
    message: string;
    position?: any;
    sourceDoc?: number;
};

type DiagnosticsByType = {
    readonly errors: ErrorRecord[];
    readonly warnings: WarningRecord[];
    readonly infos: InfoRecord[];
    readonly accessibility: AccessibilityRecord[];
};

export function getDiagnosticsByType(core: any): DiagnosticsByType {
    return {
        get errors() {
            return core.core!.diagnostics.filter(isErrorRecord);
        },
        get warnings() {
            return core.core!.diagnostics.filter(isWarningRecord);
        },
        get infos() {
            return core.core!.diagnostics.filter(isInfoRecord);
        },
        get accessibility() {
            return core.core!.diagnostics.filter(
                (diagnostic: any) => diagnostic.type === "accessibility",
            );
        },
    };
}
