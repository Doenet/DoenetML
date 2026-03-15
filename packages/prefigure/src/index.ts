import * as Comlink from "comlink";
import Worker from "./worker?worker";
import type { api } from "./worker";
import { PREFIG_WHEEL_FILENAME } from "./worker/compiler-metadata";

declare const PREFIGURE_VERSION: string;

export type PrefigureMode = "svg" | "tactile";

export type PrefigureCompileResult = {
    svg: string;
    annotationsXml: string;
};

export type PrefigureCompileOptions = {
    mode?: PrefigureMode;
    indexURL?: string;
};

type WorkerApi = typeof api;
type PrefigureWorkerApi = Comlink.Remote<WorkerApi>;

let workerApiPromise: Promise<PrefigureWorkerApi> | null = null;
let initPromise: Promise<void> | null = null;
let initializedIndexUrl: string | null = null;

export const version: string = PREFIGURE_VERSION;
export const prefigWheelFilename = PREFIG_WHEEL_FILENAME;
const GLOBAL_SCOPE = globalThis as typeof globalThis & {
    prefigure?: typeof prefigure;
    initPrefigure?: typeof initPrefigure;
};

function ensureWorkerApi() {
    if (!workerApiPromise) {
        workerApiPromise = makeCrossOriginSafeWorker().then(
            (worker) => Comlink.wrap<WorkerApi>(worker) as PrefigureWorkerApi,
        );
    }

    return workerApiPromise;
}

/**
 * Create the Comlink worker, working around browser restrictions on cross-origin
 * Worker construction.
 *
 * When `prefigure.js` is loaded from a CDN (e.g. jsDelivr) into a page on a
 * different origin, browsers throw a SecurityError for
 * `new Worker(cross_origin_url)` even for `{ type: "module" }` workers in some
 * environments (notably Vite's dev server).
 *
 * Workaround: capture the URL Vite's `?worker` factory would use, then create a
 * same-origin blob worker that simply re-imports the real CDN script.  Blob URLs
 * share the document's origin so the Worker constructor succeeds, and ES module
 * `import` inside the blob can CORS-fetch the CDN URL.
 */
async function makeCrossOriginSafeWorker(): Promise<Worker> {
    const moduleOrigin = new URL(import.meta.url).origin;
    const docOrigin =
        typeof globalThis.location !== "undefined"
            ? globalThis.location.origin
            : null;

    if (!docOrigin || moduleOrigin === docOrigin) {
        // Same-origin or non-browser context – use Vite's factory directly.
        return new Worker();
    }

    // Cross-origin: capture the URL from Vite's ?worker factory by temporarily
    // intercepting the native Worker constructor, then use a blob wrapper.
    let capturedUrl: string | undefined;
    const OrigWorker = globalThis.Worker;
    (globalThis as any).Worker = function (url: string) {
        capturedUrl = url;
    };
    try {
        new Worker();
    } catch {
        // Ignore – factory may throw because our stub isn't a real Worker.
    } finally {
        (globalThis as any).Worker = OrigWorker;
    }

    if (!capturedUrl) {
        throw new Error("[prefigure] Worker URL capture failed");
    }

    const blob = new Blob([`import ${JSON.stringify(capturedUrl)}`], {
        type: "text/javascript",
    });
    const blobUrl = URL.createObjectURL(blob);
    try {
        return new OrigWorker(blobUrl, { type: "module" });
    } finally {
        URL.revokeObjectURL(blobUrl);
    }
}

export function defaultPrefigureIndexUrl(): string {
    // Default to sibling assets relative to the module URL.
    // Callers can pass an explicit indexURL when loading prefigure from a non-standard location.
    return new URL("./assets/", import.meta.url).toString();
}

/**
 * Initialize the prefigure worker runtime.
 *
 * Initialization is idempotent for the same `indexURL` and rejects if called
 * again with a different URL after a successful initialization.
 */
export async function initPrefigure(indexURL?: string) {
    const effectiveIndexUrl = indexURL ?? defaultPrefigureIndexUrl();

    const normalizedIndexUrl = effectiveIndexUrl.endsWith("/")
        ? effectiveIndexUrl
        : `${effectiveIndexUrl}/`;

    if (initializedIndexUrl && normalizedIndexUrl !== initializedIndexUrl) {
        throw new Error(
            `Prefigure is already initialized with a different indexURL (${initializedIndexUrl}).`,
        );
    }

    if (initPromise) {
        return initPromise;
    }

    initPromise = (async () => {
        const workerApi = await ensureWorkerApi();
        await workerApi.init({
            indexURL: normalizedIndexUrl,
        });
        initializedIndexUrl = normalizedIndexUrl;
    })().catch((error) => {
        // Allow retries after transient initialization failures.
        initPromise = null;
        throw error;
    });

    return initPromise;
}

/**
 * Compile PreFigure XML into SVG and annotations XML.
 *
 * This ensures the worker runtime is initialized before delegating to the
 * worker `compile` method.
 */
export async function compilePrefigure(
    source: string,
    options: PrefigureCompileOptions = {},
): Promise<PrefigureCompileResult> {
    const mode = options.mode ?? "svg";
    const indexURL = options.indexURL;

    await initPrefigure(indexURL);
    const workerApi = await ensureWorkerApi();
    const output = await workerApi.compile(mode, source);

    return {
        svg: output.svg,
        annotationsXml: output.annotations,
    };
}

export async function prefigure(
    source: string,
    options: PrefigureCompileOptions = {},
): Promise<PrefigureCompileResult> {
    return compilePrefigure(source, options);
}

if (!GLOBAL_SCOPE.prefigure) {
    GLOBAL_SCOPE.prefigure = prefigure;
}

if (!GLOBAL_SCOPE.initPrefigure) {
    GLOBAL_SCOPE.initPrefigure = initPrefigure;
}
