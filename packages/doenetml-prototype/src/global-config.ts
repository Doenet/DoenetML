export const doenetGlobalConfig = {
    doenetWorkerUrl: new URL(
        "/doenetml-worker/index.js",
        window.location.href,
    ).href,
};
// We want this to be available in the global scope
(window as any).doenetGlobalConfig = doenetGlobalConfig;
