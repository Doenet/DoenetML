import {
    ErrorRecord,
    InfoRecord,
    WarningRecord,
    isErrorRecord,
    isInfoRecord,
    isWarningRecord,
} from "@doenet/utils";

type DiagnosticsByType = {
    readonly errors: ErrorRecord[];
    readonly warnings: WarningRecord[];
    readonly infos: InfoRecord[];
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
    };
}
