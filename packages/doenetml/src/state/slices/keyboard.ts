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
    /**
     * Whether the reader has asked for the device's own on-screen keyboard in
     * preference to the Doenet virtual keyboard, by closing the tray.
     *
     * Only consulted on touch devices, where the two keyboards compete for the
     * same screen: there, a math input keeps the system keyboard down
     * (`inputmode="none"`) unless this is set. Closing the tray sets it and
     * reopening the tray clears it, so the reader's most recent choice is the
     * one that sticks. The tray opening and closing as focus moves between
     * inputs does not count as such a choice and leaves this alone.
     */
    systemKeyboardRequested: boolean;
}

// Define the initial state using that type
const initialState: KeyboardSlice = {
    keyboardInput: [],
    systemKeyboardRequested: false,
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
        setSystemKeyboardRequested: (state, action: PayloadAction<boolean>) => {
            state.systemKeyboardRequested = action.payload;
        },
    },
    selectors: {
        keyboardInput: (state) => state.keyboardInput,
        systemKeyboardRequested: (state) => state.systemKeyboardRequested,
    },
});
