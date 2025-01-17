import { doenetGlobalConfig } from "../global-config";

export function createCoreWorker() {
    return new Worker(doenetGlobalConfig.doenetWorkerUrl, {
        type: "classic",
    });
}

export function initializeCoreWorker({ coreWorker, doenetML, flags }) {
    // Initializes core worker with the given arguments.
    // Returns a promise.
    // If the worker is successfully initialized, the promise is resolved
    // If an error was encountered while initializing, the promise is rejected

    let resolveInitializePromise;
    let rejectInitializePromise;

    let initializePromise = new Promise((resolve, reject) => {
        resolveInitializePromise = resolve;
        rejectInitializePromise = reject;
    });

    let initializeListener = function (e) {
        if (e.data.messageType === "initializeResult") {
            coreWorker.removeEventListener("message", initializeListener);

            let initializeResult = e.data.args;

            if (initializeResult.success) {
                resolveInitializePromise();
            } else {
                rejectInitializePromise(new Error(initializeResult.errMsg));
            }
        }
    };

    coreWorker.addEventListener("message", initializeListener);

    coreWorker.postMessage({
        messageType: "initializeWorker",
        args: {
            doenetML,
            flags,
        },
    });

    return initializePromise;
}
