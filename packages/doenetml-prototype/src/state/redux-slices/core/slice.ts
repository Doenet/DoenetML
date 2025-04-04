import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { DoenetMLFlags } from "../../../DoenetML";

export interface CoreState {
    /**
     * Flags specifying the behavior of core
     */
    flags?: DoenetMLFlags;
    /**
     * The webworker used by core is stored outside of the redux store (since it is not serializable).
     * This key is used to retrieve it.
     */
    workerCacheKey?: number;
    inErrorState: boolean;
}

// Define the initial state using that type
const initialState: CoreState = {
    flags: undefined,
    workerCacheKey: undefined,
    inErrorState: false,
};

const coreSlice = createSlice({
    name: "core",
    initialState,
    reducers: {
        _setFlags: (state, action: PayloadAction<DoenetMLFlags>) => {
            state.flags = action.payload;
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
