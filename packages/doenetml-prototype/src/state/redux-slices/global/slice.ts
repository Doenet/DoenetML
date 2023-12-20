import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

export interface GlobalState {
    /**
     * Whether the component is being rendered via SSR.
     */
    renderingOnServer: boolean;
}

// Define the initial state using that type
const initialState: GlobalState = {
    renderingOnServer: typeof process !== "undefined" && !process?.env?.browser,
};

const dastSlice = createSlice({
    name: "global",
    initialState,
    reducers: {},
});

export const globalReducer = dastSlice.reducer;

/**
 * Synchronous actions that directly manipulate data in the store.
 */
export const _globalReducerActions = { ...dastSlice.actions };

const selfSelector = (state: RootState) => state.global;
export const renderingOnServerSelector = (state: RootState) =>
    selfSelector(state).renderingOnServer;
