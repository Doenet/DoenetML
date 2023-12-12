import * as Comlink from "comlink";
import { createLoggingAsyncThunk } from "../../hooks";
import { CoreWorker } from "@doenet/doenetml-worker-rust";
import { doenetGlobalConfig } from "../../../global-config";
import { RootState } from "../../store";
import { _coreReducerActions } from "./slice";
import { _dastReducerActions } from "../dast";

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

export const workerCache: { worker: Comlink.Remote<CoreWorker> }[] = [];

export const coreThunks = {
    /**
     * Create an instance of the DoenetCore webworker. No initialization is done.
     */
    _loadWorker: createLoggingAsyncThunk(
        "core/loadWorker",
        async (_: void, { dispatch, getState }) => {
            const { workerCacheKey } = getState().core;
            if (workerCacheKey != null && workerCache[workerCacheKey]?.worker) {
                // There's already a worker loaded
                return;
            }
            // We need to load a new worker

            const worker = createWrappedCoreWorker();
            const key = workerCache.length;
            workerCache[key] = { worker };
            dispatch(_coreReducerActions._setWorkerCacheKey(key));
        },
    ),
    /**
     * Initialize the DoenetCore webworker with the given source string and DAST tree.
     */
    initialize: createLoggingAsyncThunk(
        "core/initialize",
        async (_, { dispatch, getState }) => {
            dispatch(_coreReducerActions._setInitialized(false));

            await dispatch(coreThunks._loadWorker());

            const worker = getWorker(getState());
            if (worker == null) {
                throw new Error("No worker loaded");
            }

            const { source, dastFromSource: dast } = getState().dast;

            try {
                await worker.initializeWorker({ source, dast, flags: {} });
                dispatch(_coreReducerActions._setInitialized(true));
                dispatch(_coreReducerActions._setInErrorState(false));
            } catch (e) {
                console.error("Failed to initialize worker", e);
                dispatch(_coreReducerActions._setInitialized(false));
                dispatch(_coreReducerActions._setInErrorState(true));
            }
        },
    ),
    /**
     * Launch the DoenetCore webworker with the given source string and DAST tree.
     */
    launchCore: createLoggingAsyncThunk(
        "core/launchCore",
        async (_, { dispatch, getState }) => {
            const { initialized } = getState().core;
            if (!initialized) {
                await dispatch(coreThunks.initialize());
            }
            const worker = getWorker(getState());
            if (worker == null) {
                throw new Error("No worker loaded");
            }

            const flatDast = await worker.createCore({});
            dispatch(_dastReducerActions._setFlatDast(flatDast));
            console.log("flatDast", flatDast);
        },
    ),
};

function getWorker(
    state: RootState,
): ReturnType<typeof createWrappedCoreWorker> | undefined {
    const { workerCacheKey } = state.core;
    const { worker } = workerCache[workerCacheKey ?? -1] || {};
    return worker;
}
