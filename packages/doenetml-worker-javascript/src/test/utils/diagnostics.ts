export function getDiagnosticsByType(core: any) {
    return {
        get errors() {
            return core.core!.diagnostics.filter(
                (d: any) => d.type === "error",
            );
        },
        get warnings() {
            return core.core!.diagnostics.filter(
                (d: any) => d.type !== "error",
            );
        },
    };
}
