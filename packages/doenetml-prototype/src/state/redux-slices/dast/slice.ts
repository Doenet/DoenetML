import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { DastError, DastRoot } from "@doenet/parser";
import type {
    ElementUpdates,
    FlatDastRoot,
} from "@doenet/doenetml-worker-rust";

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
    flatDastRoot: FlatDastRoot;
}

// Define the initial state using that type
const initialState: DastState = {
    source: "",
    dastFromSource: { type: "root", children: [] },
    dastErrors: [],
    flatDastRoot: { type: "root", children: [], elements: [], warnings: [] },
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
        _setFlatDastRoot: (state, action: PayloadAction<FlatDastRoot>) => {
            state.flatDastRoot = action.payload;
        },
        /**
         * Upsert elements in flatDastRoot. Payload should be an array of
         * pairs [id, newElement].
         */
        updateElements: (
            state,
            action: PayloadAction<[number, FlatDastRoot["elements"][number]][]>,
        ) => {
            for (const [index, element] of action.payload) {
                state.flatDastRoot.elements[index] = element;
            }
        },
        /**
         * Process an `elementUpdate` coming from Core.
         */
        processElementUpdates: (
            state,
            action: PayloadAction<ElementUpdates>,
        ) => {
            for (const [id, update] of Object.entries(action.payload)) {
                const elm = state.flatDastRoot.elements[Number(id)];
                if (elm == null) {
                    console.error(
                        "Failed to find element in FlatDast with id =",
                        id,
                        "during element update request.",
                    );
                    continue;
                }
                if (elm.type === "error") {
                    throw new Error("Updating errors is not yet implemented");
                }
                if (update.changed_state) {
                    elm.data ??= { id: Number(id), state: {} };
                    elm.data.state ??= {};
                    Object.assign(elm.data.state, update.changed_state);
                }
                if (update.changed_attributes) {
                    console.warn("Updating attributes is not yet implemented");
                }
                if (update.new_children) {
                    elm.children = update.new_children;
                }
            }
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

export const elementsArraySelector = (state: RootState) =>
    selfSelector(state).flatDastRoot.elements;
