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
const workerUrl = new URL(workerPath, import.meta.url).href;

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

if (isSameOrigin(workerUrl)) {
    // Same-origin: `new Worker(url)` works directly, and every worker created
    // from the same URL shares the browser's HTTP + compiled-script cache.
    doenetGlobalConfig.doenetWorkerUrl = workerUrl;
} else {
    // Cross-origin (e.g. the bundle is loaded from a CDN, as PreTeXt and
    // doenet.org do): a dedicated `new Worker(crossOriginUrl)` is blocked. Wrap
    // the worker in a tiny SAME-ORIGIN classic-worker bootstrap that
    // `importScripts()` the real (CORS-served) worker. `importScripts` is
    // allowed cross-origin in classic workers — which is exactly what
    // `createCoreWorker` (`utils/docUtils.ts`) creates — so the realm holds
    // only this ~100-byte bootstrap instead of the ~15 MB worker, while the
    // worker code is fetched and parsed in the worker thread.
    const bootstrap = `importScripts(${JSON.stringify(workerUrl)});`;
    doenetGlobalConfig.doenetWorkerUrl = URL.createObjectURL(
        new Blob([bootstrap], { type: "text/javascript" }),
    );
}
