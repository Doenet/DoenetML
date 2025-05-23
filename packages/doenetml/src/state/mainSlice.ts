/**
 * This file contains Redux information for the main store of the app.
 */

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

export type ComponentInfo = {
    stateValues: Record<string, unknown>;
    sourceOfUpdate?: {
        local?: boolean;
        sourceInformation?: Record<string, unknown>;
    };
    ignoreUpdate: boolean;
    childrenInstructions: Record<string, any>[];
    prefixForIds: string;
};

// Define a type for the slice state
export interface MainSlice {
    /**
     * A map of component names/ids to information that the component needs to render.
     * This information was previously using Recoil.
     */
    componentInfo: Record<string, ComponentInfo>;
}

// Define the initial state using that type
const initialState: MainSlice = {
    componentInfo: {},
};

export const mainSlice = createSlice({
    name: "mainSlice",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        setComponentInfo: (
            state,
            action: PayloadAction<{
                key: string;
                componentInfo: ComponentInfo;
            }>,
        ) => {
            let newVal: ComponentInfo = action.payload.componentInfo;
            state.componentInfo[action.payload.key] = newVal;
        },
    },
    selectors: {
        componentInfo: (state) => state.componentInfo,
    },
});

mainSlice.actions;
