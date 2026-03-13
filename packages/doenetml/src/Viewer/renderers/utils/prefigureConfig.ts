const DEFAULT_PREFIGURE_BUILD_ENDPOINT = "https://prefigure.doenet.org/build";
const DEFAULT_PREFIGURE_DIAGCESS_SCRIPT_URL =
    "https://cdn.jsdelivr.net/npm/diagcess@1.4.0/dist/diagcess.js";

const env = (
    import.meta as ImportMeta & {
        env?: Record<string, string | undefined>;
    }
).env;

// Build/runtime configurable endpoints for prefigure renderer integration.
// These can be overridden via Vite env vars:
// - VITE_PREFIGURE_BUILD_ENDPOINT
// - VITE_PREFIGURE_DIAGCESS_SCRIPT_URL
export const PREFIGURE_BUILD_ENDPOINT =
    env?.VITE_PREFIGURE_BUILD_ENDPOINT ?? DEFAULT_PREFIGURE_BUILD_ENDPOINT;

export const PREFIGURE_DIAGCESS_SCRIPT_URL =
    env?.VITE_PREFIGURE_DIAGCESS_SCRIPT_URL ??
    DEFAULT_PREFIGURE_DIAGCESS_SCRIPT_URL;
