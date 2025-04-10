if (typeof window === "undefined") {
    // @ts-ignore
    globalThis.window = globalThis;
}

/**
 * Global configuration object for DoenetML.
 */
export const doenetGlobalConfig = {
    doenetWorkerUrl: getWorkerUrl(),
    doenetRustWorkerUrl: getRustWorkerUrl(),
};
// We want this to be available in the global scope
(window as any).doenetGlobalConfig = doenetGlobalConfig;

/**
 * Attempt to resolve the URL of the doenet worker. This function falls back
 * to `doenet.org` if an error is thrown.
 * @returns
 */
function getWorkerUrl() {
    try {
        return new URL(
            "/doenetml-worker-javascript/CoreWorker.js",
            window?.location?.href || "https://doenet.org",
        ).href;
    } catch (e) {
        // `window.location.href` may not be a valid URL. For example, in an iframe it
        // could be `about:srcdoc`.
        return "https://doenet.org/doenetml-worker-javascript/CoreWorker.js";
    }
}

/**
 * Attempt to resolve the URL of the doenet worker. This function falls back
 * to `doenet.org` if an error is thrown.
 * @returns
 */
function getRustWorkerUrl() {
    try {
        return new URL(
            "/doenetml-worker-rust/index.js",
            window?.location?.href || "https://doenet.org",
        ).href;
    } catch (e) {
        // `window.location.href` may not be a valid URL. For example, in an iframe it
        // could be `about:srcdoc`.
        return "https://doenet.org/doenetml-worker-rust/index.js";
    }
}
