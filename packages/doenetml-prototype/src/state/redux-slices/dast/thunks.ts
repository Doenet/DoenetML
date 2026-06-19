import {
    extractDastErrors,
    lezerToDast,
    normalizeDocumentDast,
} from "@doenet/parser";
import { createLoggingAsyncThunk } from "../../hooks";
import { _dastReducerActions } from "./slice";
import { coreThunks, getWorker } from "../core/thunks";
import { DoenetMLFlags } from "../../../DoenetML";
import { _coreReducerActions } from "../core";
import type { CoreType } from "../core/slice";

export const dastThunks = {
    setSource: createLoggingAsyncThunk(
        "dast/setSource",
        async (source: string, { dispatch, getState }) => {
            dispatch(_dastReducerActions._setSource(source));

            // We parse the source string to get the DAST tree.
            // This will get sent to the webworker
            const newDast = normalizeDocumentDast(lezerToDast(source));
            dispatch(_dastReducerActions._setDastFromSource(newDast));

            const errors = extractDastErrors(newDast);
            dispatch(_dastReducerActions._setDastErrors(errors));

            await dispatch(coreThunks._loadWorker());

            const worker = getWorker(getState());
            if (worker == null) {
                throw new Error("No worker loaded");
            }

            try {
                await worker.setSource({ source, dast: newDast });
            } catch (e) {
                console.error("Error when setting source in Core.", e);
                dispatch(_coreReducerActions._setInErrorState(true));
            }
        },
    ),
    setSourceAndStartWorker: createLoggingAsyncThunk(
        "dast/setSourceAndStartWorker",
        async (
            {
                source,
                flags,
                coreType = "rust",
            }: { source: string; flags: DoenetMLFlags; coreType?: CoreType },
            { dispatch },
        ) => {
            // Set the core type before `setSource` starts the worker, since
            // `_loadWorker` reads it from the store to call `setCoreType`.
            dispatch(_coreReducerActions._setCoreType(coreType));
            await dispatch(dastThunks.setSource(source));
            await dispatch(coreThunks.setFlags(flags));
            await dispatch(coreThunks.retrieveDast());
        },
    ),
};
