import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { KeyCommand } from "@doenet/virtual-keyboard";

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
export interface KeyboardSlice {
    /**
     * Commands sent from the virtual keyboard but not yet processed by a component.
     */
    keyboardInput: KeyCommand[];
}

// Define the initial state using that type
const initialState: KeyboardSlice = {
    keyboardInput: [],
};

export const keyboardSlice = createSlice({
    name: "keyboard",
    initialState,
    reducers: {
        setKeyboardInput: (state, action: PayloadAction<KeyCommand[]>) => {
            state.keyboardInput = action.payload;
        },
        clearKeyboardInput: (state) => {
            state.keyboardInput = [];
        },
    },
    selectors: {
        keyboardInput: (state) => state.keyboardInput,
    },
});
