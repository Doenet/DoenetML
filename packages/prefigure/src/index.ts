import * as Comlink from "comlink";
import Worker from "./worker?worker&inline";
import type { api } from "./worker";
import { PREFIG_WHEEL_FILENAME } from "./worker/compiler";

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
let resolvedDefaultIndexUrl: string | null = null;

export const version: string = PREFIGURE_VERSION;
export const prefigWheelFilename = PREFIG_WHEEL_FILENAME;

function ensureWorkerApi() {
    if (!workerApiPromise) {
        workerApiPromise = Promise.resolve(
            Comlink.wrap<WorkerApi>(new Worker()) as PrefigureWorkerApi,
        );
    }

    return workerApiPromise;
}

export function defaultPrefigureIndexUrl(): string {
    const moduleUrl = new URL(import.meta.url);
    const path = moduleUrl.pathname;

    // When this package is linked into another Vite dev server, module URLs are
    // often served from `/@fs/.../src/index.ts`. In that case, assets live in
    // this package's `dist/assets/` directory, not in `../assets/`.
    if (path.includes("/@fs/") && path.includes("/src/")) {
        return new URL("../dist/assets/", moduleUrl).toString();
    }

    // When consumed by another package's dev server, Vite may load this file from
    // `/@fs/.../packages/prefigure/src/index.ts` while assets live in `dist/assets/`.
    if (path.includes("/packages/prefigure/src/")) {
        return new URL("../dist/assets/", moduleUrl).toString();
    }

    // In Vite dev, module URL is typically `/src/index.ts` while copied assets are served at `/assets/`.
    if (path.includes("/src/")) {
        return new URL("../assets/", moduleUrl).toString();
    }

    // In built output, `prefigure.js` and `assets/` are siblings inside `dist/`.
    return new URL("./assets/", moduleUrl).toString();
}

function prefigureIndexUrlCandidates(): string[] {
    // Keep function to centralize resolution strategy and allow future extensions.
    return [defaultPrefigureIndexUrl()];
}

async function resolveDefaultPrefigureIndexUrl(): Promise<string> {
    if (resolvedDefaultIndexUrl) {
        return resolvedDefaultIndexUrl;
    }

    const [indexUrl] = prefigureIndexUrlCandidates();
    resolvedDefaultIndexUrl = indexUrl;
    return indexUrl;
}

export async function initPrefigure(indexURL?: string) {
    if (!indexURL) {
        indexURL = await resolveDefaultPrefigureIndexUrl();
    }

    const normalizedIndexUrl = indexURL.endsWith("/")
        ? indexURL
        : `${indexURL}/`;

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
    })();

    return initPromise;
}

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

if (!(globalThis as any).prefigure) {
    (globalThis as any).prefigure = prefigure;
}

if (!(globalThis as any).initPrefigure) {
    (globalThis as any).initPrefigure = initPrefigure;
}
