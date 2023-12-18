import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export interface AnalyticsState {
    /**
     * Whether to send analytics (information about the user's usage of Doenet and their correctness on problems, etc.)
     * to a server.
     */
    sendAnalytics: boolean;
}

// Define the initial state using that type
const initialState: AnalyticsState = {
    sendAnalytics: false,
};

const analyticsSlice = createSlice({
    name: "analytics",
    initialState,
    reducers: {
        _setSendAnalytics: (state, action: PayloadAction<boolean>) => {
            state.sendAnalytics = action.payload;
        },
    },
});

export const analyticsReducer = analyticsSlice.reducer;

/**
 * Synchronous actions that directly manipulate data in the store.
 */
export const _analyticsReducerActions = { ...analyticsSlice.actions };

export const selfSelector = (state: RootState) => state.analytics;
