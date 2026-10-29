if (typeof window === "undefined") {
    // @ts-ignore
    globalThis.window = globalThis;
}

/**
 * Global configuration object for DoenetML.
 */
export const doenetGlobalConfig = {
    doenetWorkerUrl: getWorkerUrl(),
    /**
     * The cells core's own worker, which starts without the other two cores
     * (ADR 0020 in `packages/cells-core`); `null` runs the cells core in the
     * worker at `doenetWorkerUrl`, which hosts every core.
     */
    doenetCellsWorkerUrl: getWorkerUrl("cells-worker.js") as string | null,
};
// We want this to be available in the global scope
(window as any).doenetGlobalConfig = doenetGlobalConfig;

/**
 * Attempt to resolve the URL of the doenet worker. This function falls back
 * to `doenet.org` if an error is thrown.
 * @returns
 */
function getWorkerUrl(file = "index.js") {
    try {
        return new URL(
            `/doenetml-worker/${file}`,
            window?.location?.href || "https://doenet.org",
        ).href;
    } catch (e) {
        // `window.location.href` may not be a valid URL. For example, in an iframe it
        // could be `about:srcdoc`.
        return `https://doenet.org/doenetml-worker/${file}`;
    }
}
