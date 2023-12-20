import { extractDastErrors, lezerToDast } from "@doenet/parser";
import { createLoggingAsyncThunk } from "../../hooks";
import { _dastReducerActions } from "./slice";
import { coreThunks } from "../core/thunks";
import { normalizeDocumentDast } from "./utils/normalize-dast";

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
        },
    ),
    setSourceAndStartWorker: createLoggingAsyncThunk(
        "dast/setSourceAndStartWorker",
        async (source: string, { dispatch, getState }) => {
            await dispatch(dastThunks.setSource(source));
            await dispatch(coreThunks.launchCore());
        },
    ),
};
