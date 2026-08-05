export * from "./index";
import { doenetGlobalConfig } from "./global-config";

// Externalized-worker entry point (counterpart to `doenetml-inline-worker.ts`).
//
// Instead of embedding the entire ~15 MB core worker as an inline Blob string
// in the importing bundle, point the worker URL at a separately-served
// `doenetml-worker/index.js` co-located next to whatever bundle imported this
// module (resolved relative to this module's own URL at runtime). Dropping the
// worker string means each realm that loads the bundle no longer holds its own
// ~15 MB copy.
//
// `workerPath` is held in a variable rather than inlined into the `new URL(...)`
// call so Vite does not statically rewrite it as a build-time asset reference;
// we want a plain runtime resolution against `import.meta.url`.
const workerPath = "./doenetml-worker/index.js";

/**
 * Resolve the URL to load the worker from. Returns `null` if no URL can be
 * resolved (the caller then leaves the `global-config.ts` default in place).
 */
function resolveWorkerUrl(): string | null {
    // Normal case: the worker directory is co-served next to this bundle.
    try {
        return new URL(workerPath, import.meta.url).href;
    } catch {
        // `import.meta.url` is not a hierarchical URL — e.g. the bundle was
        // loaded from a blob:/data: URL (some hosts and the component tests
        // do this). Relative resolution against such a base throws, and
        // "next to the bundle" does not exist.
    }
    // Fallback: origin-root `/doenetml-worker/index.js` against the document
    // base URL — the same convention as `getWorkerUrl()` in global-config.ts.
    // In a srcdoc iframe, `document.baseURI` inherits the embedding page's
    // base URL, so this resolves against the host page's origin.
    try {
        return new URL("/doenetml-worker/index.js", document.baseURI).href;
    } catch {
        return null;
    }
}

/**
 * The bootstrap Blob URL {@link setExternalCoreWorkerUrl} last handed to the
 * global config, so a second call can revoke it instead of leaking it. Only
 * ever a URL this module created — a same-origin worker URL is used as-is.
 */
let ownedBootstrapUrl: string | null = null;

/**
 * Point the viewer's core worker at `workerUrl`, wrapping it for cross-origin
 * loading where that is needed.
 *
 * Exported because the module-scope resolution below can only find the worker
 * *beside this bundle*, and a bundle loaded through a floating CDN tag wants it
 * beside a *pinned* copy of itself instead — see `pinPackageVersion`, which
 * `@doenet/standalone` applies on top of what this module works out. The
 * override has to run after this module's own resolution (its body runs at
 * import time, before any importer's), so it is a function rather than
 * something an importer could configure ahead of it. Nothing is created here
 * that a later call cannot replace: no worker exists until a viewer mounts.
 */
export function setExternalCoreWorkerUrl(workerUrl: string) {
    let resolved: string;
    if (isSameOrigin(workerUrl)) {
        // Same-origin: `new Worker(url)` works directly, and every worker
        // created from the same URL shares the browser's HTTP + compiled-script
        // cache.
        resolved = workerUrl;
    } else {
        // Cross-origin (e.g. the bundle is loaded from a CDN, as PreTeXt
        // and doenet.org do): a dedicated `new Worker(crossOriginUrl)` is
        // blocked. Wrap the worker in a tiny SAME-ORIGIN classic-worker
        // bootstrap that `importScripts()` the real (CORS-served) worker.
        // `importScripts` is allowed cross-origin in classic workers —
        // which is exactly what `createCoreWorker` (`utils/docUtils.ts`)
        // creates — so the realm holds only this ~100-byte bootstrap
        // instead of the ~15 MB worker, while the worker code is fetched
        // and parsed in the worker thread.
        const bootstrap = `importScripts(${JSON.stringify(workerUrl)});`;
        resolved = URL.createObjectURL(
            new Blob([bootstrap], { type: "text/javascript" }),
        );
    }
    if (ownedBootstrapUrl !== null && ownedBootstrapUrl !== resolved) {
        URL.revokeObjectURL(ownedBootstrapUrl);
    }
    ownedBootstrapUrl = resolved === workerUrl ? null : resolved;
    doenetGlobalConfig.doenetWorkerUrl = resolved;
}

/**
 * Is `url` same-origin with the realm that loaded this bundle? Blob/data URLs
 * are same-origin to their realm.
 */
function isSameOrigin(url: string): boolean {
    try {
        const u = new URL(url, self.location.href);
        if (u.protocol === "blob:" || u.protocol === "data:") {
            return true;
        }
        return u.origin === self.location.origin;
    } catch {
        // If we cannot parse/compare, assume same-origin and let `new Worker`
        // attempt it directly.
        return true;
    }
}

try {
    const workerUrl = resolveWorkerUrl();
    if (workerUrl !== null) {
        setExternalCoreWorkerUrl(workerUrl);
    }
    // workerUrl === null: keep the default from global-config.ts.
} catch (e) {
    // Never let worker-URL resolution break evaluation of the whole bundle —
    // the default from global-config.ts remains in effect.
    console.warn("Unable to resolve external DoenetML worker URL:", e);
}
