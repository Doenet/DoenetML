export type GraphControlsMode = "all" | "slidersonly" | "inputsonly" | "none";

/**
 * Normalize graph-level controls mode from core SVs.
 *
 * Invalid or missing values are treated as "none" so renderers do not show
 * controls unless explicitly requested by authored content/core state.
 */
export function normalizeGraphControlsMode(value: unknown): GraphControlsMode {
    if (typeof value !== "string") {
        return "none";
    }

    const normalized = value.toLowerCase();
    if (
        normalized === "all" ||
        normalized === "slidersonly" ||
        normalized === "inputsonly" ||
        normalized === "none"
    ) {
        return normalized;
    }

    return "none";
}