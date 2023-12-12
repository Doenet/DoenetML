import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { DastError, DastRoot } from "@doenet/parser";

// Define a type for the slice state
export interface DastState {
    /**
     * The DoenetML source string.
     */
    source: string;
    /**
     * The DAST tree derived from the source string.
     */
    dastFromSource: DastRoot;
    dastErrors: DastError[];
}

// Define the initial state using that type
const initialState: DastState = {
    source: "",
    dastFromSource: { type: "root", children: [] },
    dastErrors: [],
};

const dastSlice = createSlice({
    name: "dast",
    initialState,
    reducers: {
        _setSource: (state, action: PayloadAction<string>) => {
            state.source = action.payload;
        },
        _setDastFromSource: (state, action: PayloadAction<DastRoot>) => {
            state.dastFromSource = action.payload;
        },
        _setDastErrors: (state, action: PayloadAction<DastError[]>) => {
            state.dastErrors = action.payload;
        },
    },
});

export const dastReducer = dastSlice.reducer;

/**
 * Synchronous actions that directly manipulate data in the store.
 */
export const _dastReducerActions = { ...dastSlice.actions };

const selfSelector = (state: RootState) => state.dast;
export const errorsSelector = (state: RootState) =>
    selfSelector(state).dastErrors;
