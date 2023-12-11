import * as Comlink from "comlink";
import type { CoreWorker } from "@doenet/doenetml-worker-rust";
import { doenetGlobalConfig } from "./global-config";
import React from "react";
import type { DastRoot } from "@doenet/parser";
import { DoenetMLFlags } from "./doenet-applet";

/**
 * Return a promise and its resolver.
 */
function promiseAndResolver<T>() {
    let resolver: (value: T) => void;
    const promise = new Promise<T>((resolve) => {
        resolver = resolve;
    });

    return { promise, resolve: resolver! };
}

/**
 * Create a DoenetCoreWorker that is wrapped in Comlink for a nice async API.
 */
export function createWrappedCoreWorker() {
    const worker = new Worker(doenetGlobalConfig.doenetWorkerUrl, {
        type: "module",
    });

    return Comlink.wrap(worker) as Comlink.Remote<CoreWorker>;
}

/**
 * Hook to get a DoenetCoreWorker.
 */
export function useCoreWorker({
    source,
    dast,
    flags,
}: {
    source: string;
    dast: DastRoot;
    flags: DoenetMLFlags;
}) {
    const [coreWorker, _setCoreWorker] = React.useState(
        createWrappedCoreWorker,
    );
    const [initPromise, setInitPromise] = React.useState(
        promiseAndResolver<boolean>,
    );
    const [initialized, setInitialized] = React.useState(false);
    const [inErrorState, setInErrorState] = React.useState(false);

    React.useEffect(() => {
        console.log("setting up core worker");
        (async () => {
            await coreWorker.initializeWorker({ source, dast, flags });
            initPromise.resolve(true);
            setInitialized(true);
            setInErrorState(false);
        })().catch((err) => {
            console.error("Failed to initialize worker", err);
            setInErrorState(true);
        });

        return () => {
            coreWorker.terminate();
        };
    }, [coreWorker]);

    React.useEffect(() => {
        if (!initialized) {
            return;
        }
        (async () => {
            await coreWorker.initializeWorker({ source, dast, flags });

            const flatDast = await coreWorker.createCore({});
            console.log("flatDast", flatDast);
            setInErrorState(false);
        })().catch((err) => {
            console.error("Failed to run worker", err);
            setInErrorState(true);
        });
    }, [initialized, dast, source, flags]);

    return { coreWorker, initialized, inErrorState };
}
