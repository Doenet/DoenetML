import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

export interface GlobalState {
    /**
     * Whether the component is being rendered via SSR.
     */
    renderingOnServer: boolean;
    /**
     * Whether dark mode is the preferred theme.
     */
    darkMode: boolean;
    /**
     * Whether components should be rendered in Doenet mode (interactive webpage) or PreTeXt mode (static XML for export).
     */
    renderMode: "doenet" | "pretext";
}

// Define the initial state using that type
const initialState: GlobalState = {
    renderingOnServer: typeof process !== "undefined" && !process?.env?.browser,
    darkMode: false,
    renderMode: "doenet",
};

const dastSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        _setDarkMode: (state, action: PayloadAction<boolean>) => {
            state.darkMode = action.payload;
        },
        _setRenderMode: (
            state,
            action: PayloadAction<GlobalState["renderMode"]>,
        ) => {
            state.renderMode = action.payload;
        },
    },
});

export const globalReducer = dastSlice.reducer;

/**
 * Synchronous actions that directly manipulate data in the store.
 */
export const _globalReducerActions = { ...dastSlice.actions };

const selfSelector = (state: RootState) => state.global;
export const renderingOnServerSelector = (state: RootState) =>
    selfSelector(state).renderingOnServer;
export const renderModeSelector = (state: RootState) =>
    selfSelector(state).renderMode;
