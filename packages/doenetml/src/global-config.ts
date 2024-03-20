if (typeof window === "undefined") {
    // @ts-ignore
    globalThis.window = globalThis;
}

export const doenetGlobalConfig = {
    doenetWorkerUrl: new URL(
        "/doenetml-worker/CoreWorker.js",
        window?.location?.href || "https://doenet.org",
    ).href,
};
// We want this to be available in the global scope
(window as any).doenetGlobalConfig = doenetGlobalConfig;
