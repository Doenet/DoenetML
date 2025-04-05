import { createLoggingAsyncThunk } from "../../hooks";
import { _analyticsReducerActions, selfSelector } from "./slice";
import { _dastReducerActions } from "../dast";

export const analyticsThunks = {
    /**
     * Inform the server about a visibility change to an element.
     */
    visibilityChange: createLoggingAsyncThunk(
        "analytics/visibilityChange",
        async (
            change: { elementId: number; state: "visible" | "invisible" },
            { dispatch, getState },
        ) => {
            const { sendAnalytics } = selfSelector(getState());
            if (!sendAnalytics) {
                return;
            }

            console.warn(
                "visibilityChange",
                change,
                "cannot be sent to the server because it is not implemented yet.",
            );
        },
    ),
};
