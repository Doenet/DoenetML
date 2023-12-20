import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

export interface CoreState {
    /**
     * Whether core has been initialized.
     */
    initialized: boolean;
    /**
     * Whether core has been started and initialized with a DAST tree
     */
    launched: boolean;
    /**
     * The webworker used by core is stored outside of the redux store (since it is not serializable).
     * This key is used to retrieve it.
     */
    workerCacheKey?: number;
    inErrorState: boolean;
}

// Define the initial state using that type
const initialState: CoreState = {
    initialized: false,
    launched: false,
    workerCacheKey: undefined,
    inErrorState: false,
};

const coreSlice = createSlice({
    name: "core",
    initialState,
    reducers: {
        _setInitialized: (state, action: PayloadAction<boolean>) => {
            state.initialized = action.payload;
        },
        _setWorkerCacheKey: (state, action: PayloadAction<number>) => {
            state.workerCacheKey = action.payload;
        },
        _setInErrorState: (state, action: PayloadAction<boolean>) => {
            state.inErrorState = action.payload;
        },
    },
});

export const coreReducer = coreSlice.reducer;

/**
 * Synchronous actions that directly manipulate data in the store.
 */
export const _coreReducerActions = { ...coreSlice.actions };

export const selfSelector = (state: RootState) => state.core;
