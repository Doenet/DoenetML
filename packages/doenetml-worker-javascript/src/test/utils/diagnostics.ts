import { DiagnosticRecord } from "@doenet/utils";

export function getDiagnosticsByType(core: any) {
    return {
        get errors() {
            return core.core!.diagnostics.filter(
                (d: DiagnosticRecord) => d.type === "error",
            );
        },
        get warnings() {
            return core.core!.diagnostics.filter(
                (d: DiagnosticRecord) => d.type === "warning",
            );
        },
        get infos() {
            return core.core!.diagnostics.filter(
                (d: DiagnosticRecord) => d.type === "info",
            );
        },
    };
}
