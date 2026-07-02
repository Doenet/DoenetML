const DEFAULT_PREFIGURE_BUILD_ENDPOINT = "https://prefigure.doenet.org/build";
const DEFAULT_PREFIGURE_DIAGCESS_SCRIPT_URL =
    "https://cdn.jsdelivr.net/npm/diagcess@1.4.1/dist/diagcess.js";
// This default pins a published @doenet/prefigure package tag for CDN loading.
// It is configured here (not auto-derived from prefigure package metadata),
// but should still be manually kept aligned with runtime version bumps.
const DEFAULT_PREFIGURE_MODULE_URL =
    "https://cdn.jsdelivr.net/npm/@doenet/prefigure@0.5.15/prefigure.js";

const env = (
    import.meta as ImportMeta & {
        env?: Record<string, string | undefined>;
    }
).env;

// Build/runtime configurable endpoints for prefigure renderer integration.
// These can be overridden via Vite env vars:
// - VITE_PREFIGURE_BUILD_ENDPOINT
// - VITE_PREFIGURE_DIAGCESS_SCRIPT_URL
// - VITE_PREFIGURE_MODULE_URL
// - VITE_PREFIGURE_INDEX_URL
export const PREFIGURE_BUILD_ENDPOINT =
    env?.VITE_PREFIGURE_BUILD_ENDPOINT ?? DEFAULT_PREFIGURE_BUILD_ENDPOINT;

export const PREFIGURE_DIAGCESS_SCRIPT_URL =
    env?.VITE_PREFIGURE_DIAGCESS_SCRIPT_URL ??
    DEFAULT_PREFIGURE_DIAGCESS_SCRIPT_URL;

export const PREFIGURE_MODULE_URL =
    (globalThis as any).__DOENET_PREFIGURE_MODULE_URL__ ??
    env?.VITE_PREFIGURE_MODULE_URL ??
    DEFAULT_PREFIGURE_MODULE_URL;

export const PREFIGURE_INDEX_URL =
    (globalThis as any).__DOENET_PREFIGURE_INDEX_URL__ ??
    env?.VITE_PREFIGURE_INDEX_URL ??
    "";
