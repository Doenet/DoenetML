export function getDiagnosticsByType(result) {
    const diagnostics = Array.isArray(result)
        ? result
        : (result?.diagnostics ?? []);

    return {
        errors: diagnostics.filter((d) => d.type === "error"),
        warnings: diagnostics.filter((d) => d.type !== "error"),
    };
}
