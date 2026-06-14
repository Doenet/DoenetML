import * as Comlink from "comlink";
import { createLoggingAsyncThunk } from "../../hooks";
import type {
    Action,
    ActionResponse,
    CoreWorker,
} from "@doenet/doenetml-worker";
import { doenetGlobalConfig } from "../../../global-config";
import { RootState } from "../../store";
import { _coreReducerActions, selfSelector } from "./slice";
import type { CoreType } from "./slice";
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

export const workerCache: {
    worker: Comlink.Remote<CoreWorker>;
    coreType: CoreType;
}[] = [];
// XXX: temporary for debugging
(window as any).wc = workerCache;

export const coreThunks = {
    /**
     * Create an instance of the DoenetCore webworker. No initialization is done.
     */
    _loadWorker: createLoggingAsyncThunk(
        "core/loadWorker",
        async (_: void, { dispatch, getState }) => {
            const { workerCacheKey, coreType } = selfSelector(getState());
            const cachedWorker = workerCache[workerCacheKey ?? -1];
            // Reuse the cached worker only if it is running the requested core.
            // `setCoreType` is applied once at creation, so a worker created for
            // a different core cannot be reused after `coreType` changes.
            if (cachedWorker?.worker && cachedWorker.coreType === coreType) {
                // There's already a worker loaded for this core
                return;
            }

            // The selected worker runs a different core. Before allocating a new
            // one, reuse any previously-created worker for the requested core
            // (e.g. after switching cores back and forth) so the cache doesn't
            // grow and leave duplicate workers running.
            const existingKey = workerCache.findIndex(
                (entry) => entry?.worker && entry.coreType === coreType,
            );
            if (existingKey !== -1) {
                dispatch(_coreReducerActions._setWorkerCacheKey(existingKey));
                return;
            }

            // We need to load a new worker

            const worker = createWrappedCoreWorker();
            await worker.setCoreType(coreType);
            const key = workerCache.length;
            workerCache[key] = { worker, coreType };
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
                console.warn("Error while setting flags", e);
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
                console.warn("Error while retrieving DAST", e);
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

            const { coreType } = selfSelector(getState());

            try {
                if (coreType === "javascript") {
                    // The JavaScript core pushes renderer updates asynchronously
                    // rather than returning them; `dispatchActionJavascriptFlat`
                    // bridges that to the same `Record<componentIdx, update>`
                    // shape the rust core returns in `ActionResponse["payload"]`.
                    const updates = await worker.dispatchActionJavascriptFlat({
                        actionName: action.actionName,
                        componentIdx: action.componentIdx,
                        args: action.args ?? {},
                    });
                    // The JS-core update map mirrors the rust
                    // `ActionResponse["payload"]` shape that
                    // `processElementUpdates` consumes (the reducer reads
                    // `changedState`/`newChildren` loosely). The generated rust
                    // type and the JS-shaped type differ only nominally, so cast.
                    dispatch(
                        _dastReducerActions.processElementUpdates(
                            updates as unknown as ActionResponse["payload"],
                        ),
                    );
                } else {
                    const updates = await worker.dispatchAction(action);
                    dispatch(
                        _dastReducerActions.processElementUpdates(
                            updates.payload,
                        ),
                    );
                }
            } catch (e) {
                dispatch(_coreReducerActions._setInErrorState(true));
                console.warn("Error while dispatching action", e);
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
