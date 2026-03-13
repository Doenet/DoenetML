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

export const version: string = PREFIGURE_VERSION;
export const prefigWheelFilename = PREFIG_WHEEL_FILENAME;
const GLOBAL_SCOPE = globalThis as typeof globalThis & {
    prefigure?: typeof prefigure;
    initPrefigure?: typeof initPrefigure;
};

function ensureWorkerApi() {
    if (!workerApiPromise) {
        workerApiPromise = Promise.resolve(
            Comlink.wrap<WorkerApi>(new Worker()) as PrefigureWorkerApi,
        );
    }

    return workerApiPromise;
}

export function defaultPrefigureIndexUrl(): string {
    // Default to sibling assets relative to the module URL.
    // Callers can pass an explicit indexURL when loading prefigure from a non-standard location.
    return new URL("./assets/", import.meta.url).toString();
}

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

if (!GLOBAL_SCOPE.prefigure) {
    GLOBAL_SCOPE.prefigure = prefigure;
}

if (!GLOBAL_SCOPE.initPrefigure) {
    GLOBAL_SCOPE.initPrefigure = initPrefigure;
}
