import { isErrorRecord, isInfoRecord, isWarningRecord } from "@doenet/utils";

export function getDiagnosticsByType(result) {
    const diagnostics = Array.isArray(result)
        ? result
        : (result?.diagnostics ?? []);

    return {
        errors: diagnostics.filter(isErrorRecord),
        warnings: diagnostics.filter(isWarningRecord),
        infos: diagnostics.filter(isInfoRecord),
    };
}
