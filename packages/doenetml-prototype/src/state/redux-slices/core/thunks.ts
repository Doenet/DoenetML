import * as Comlink from "comlink";
import { createLoggingAsyncThunk } from "../../hooks";
import { Action, CoreWorker } from "@doenet/doenetml-worker-rust";
import { doenetGlobalConfig } from "../../../global-config";
import { RootState } from "../../store";
import { _coreReducerActions, selfSelector } from "./slice";
import { _dastReducerActions } from "../dast";
import { DoenetMLFlags, defaultFlags } from "../../../DoenetML";

/**
 * Create a DoenetCoreWorker that is wrapped in Comlink for a nice async API.
 */
export function createWrappedCoreWorker() {
    const worker = new Worker(doenetGlobalConfig.doenetWorkerUrl, {
        type: "classic",
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
            const { workerCacheKey } = selfSelector(getState());
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
    setFlags: createLoggingAsyncThunk(
        "core/setFlags",
        async (flags: DoenetMLFlags, { dispatch, getState }) => {
            dispatch(_coreReducerActions._setFlags(flags));

            await dispatch(coreThunks._loadWorker());

            const worker = getWorker(getState());
            if (worker == null) {
                throw new Error("No worker loaded");
            }

            try {
                await worker.setFlags({ flags });
            } catch (e) {
                dispatch(_coreReducerActions._setInErrorState(true));
            }
        },
    ),

    /**
     * Launch the DoenetCore webworker with the given source string and DAST tree.
     */
    retrieveDast: createLoggingAsyncThunk(
        "core/retrieveDast",
        async (_, { dispatch, getState }) => {
            let { flags } = selfSelector(getState());

            if (!flags) {
                await dispatch(coreThunks.setFlags(defaultFlags));
                flags = defaultFlags;
            }

            const worker = getWorker(getState());
            if (worker == null) {
                throw new Error("No worker loaded");
            }

            try {
                const flatDast = await worker.returnDast();
                dispatch(_dastReducerActions._setFlatDastRoot(flatDast));
            } catch (e) {
                dispatch(_coreReducerActions._setInErrorState(true));
            }
        },
    ),
    dispatchAction: createLoggingAsyncThunk(
        "core/dispatchAction",
        async (action: Action, { dispatch, getState }) => {
            const worker = getWorker(getState());
            if (worker == null) {
                throw new Error("No worker loaded");
            }

            try {
                const updates = await worker.dispatchAction(action);
                dispatch(
                    _dastReducerActions.processElementUpdates(updates.payload),
                );
            } catch (e) {
                dispatch(_coreReducerActions._setInErrorState(true));
                console.warn(e);
            }
        },
    ),
};

export function getWorker(
    state: RootState,
): ReturnType<typeof createWrappedCoreWorker> | undefined {
    const { workerCacheKey } = selfSelector(state);
    const { worker } = workerCache[workerCacheKey ?? -1] || {};
    return worker;
}
