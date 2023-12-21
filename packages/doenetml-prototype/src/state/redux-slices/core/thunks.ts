import * as Comlink from "comlink";
import { createLoggingAsyncThunk } from "../../hooks";
import { CoreWorker } from "@doenet/doenetml-worker-rust";
import { doenetGlobalConfig } from "../../../global-config";
import { RootState } from "../../store";
import { _coreReducerActions, selfSelector } from "./slice";
import { _dastReducerActions } from "../dast";
import { assembleFlatDast } from "../dast/utils/assemble-flat-dast";
import { DoenetMLFlags } from "../../../DoenetML";

/**
 * Create a DoenetCoreWorker that is wrapped in Comlink for a nice async API.
 */
export function createWrappedCoreWorker() {
    // TODO: after merge in #69, change to type: "classic"
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
    getDast: createLoggingAsyncThunk(
        "core/getDast",
        async (_, { dispatch, getState }) => {
            const { flags } = selfSelector(getState());

            if (!flags) {
                throw Error("Cannot get dast before setting flags.");
            }

            const worker = getWorker(getState());
            if (worker == null) {
                throw new Error("No worker loaded");
            }

            try {
                const flatDast = await worker.returnDast();
                dispatch(_dastReducerActions._setFlatDastRoot(flatDast));
                console.log("flatDast", flatDast);
                console.log("assembledDast", assembleFlatDast(flatDast));
            } catch (e) {
                dispatch(_coreReducerActions._setInErrorState(true));
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
