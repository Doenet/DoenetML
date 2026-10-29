import { createSlice, original } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { DastError, DastRoot } from "@doenet/parser";
import type {
    ActionResponse,
    FlatDastRootWithErrors,
} from "@doenet/doenetml-worker";

type ElementUpdates = ActionResponse["payload"];
type ElementUpdateWithNewElement = {
    newFlatDastElement?: FlatDastRootWithErrors["elements"][number];
};

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
    flatDastRoot: FlatDastRootWithErrors;
}

// Define the initial state using that type
const initialState: DastState = {
    source: "",
    dastFromSource: { type: "root", children: [], sources: [] },
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
        _setFlatDastRoot: (
            state,
            action: PayloadAction<FlatDastRootWithErrors>,
        ) => {
            state.flatDastRoot = action.payload;
        },
        /**
         * Upsert elements in flatDastRoot. Payload should be an array of
         * pairs [id, newElement].
         */
        updateElements: (
            state,
            action: PayloadAction<
                [number, FlatDastRootWithErrors["elements"][number]][]
            >,
        ) => {
            for (const [index, element] of action.payload) {
                state.flatDastRoot.elements[index] = element;
            }
        },
        /**
         * Process an `elementUpdate` coming from Core.
         *
         * Written against the state as it was (`original`), not through
         * immer's drafts: an update can change thousands of elements, and a
         * draft per element, finalized afterwards, cost more than the rest
         * of the update (ADR 0020 in `packages/cells-core`). The elements
         * array is copied once, and each changed element and its props are
         * copied, not mutated.
         */
        processElementUpdates: (
            state,
            action: PayloadAction<ElementUpdates>,
        ) => {
            const root = original(state.flatDastRoot)!;
            const elements = root.elements.slice();
            for (const [id, update] of Object.entries(action.payload)) {
                const updateWithNewElement = update as typeof update &
                    ElementUpdateWithNewElement;
                // A JS-bridge synthetic wrapper (`<asList>`/`<_fragment>`) may
                // not yet exist in `elements`; the bridge ships the whole
                // element so we can upsert it before any parent references it.
                if (updateWithNewElement.newFlatDastElement) {
                    elements[Number(id)] =
                        updateWithNewElement.newFlatDastElement;
                    continue;
                }

                const elm = elements[Number(id)];
                if (elm == null) {
                    console.error(
                        "Failed to find element in FlatDast with id =",
                        id,
                        "during element update request.",
                    );
                    continue;
                }

                // XXX The serializer in Core plays a trick where it treats errors and elements
                // as elements. Then at serialization time, it changes the type of an error to `"error"`.
                // The Typescript type exporting doesn't understand this trick, so we special case it manually.
                // @ts-ignore
                if (elm.type === "error") {
                    throw new Error("Updating errors is not yet implemented");
                }
                const changed: any = { ...elm };
                // XXX: Check the types to see if this is even possible
                const changedState = (update as any).changedState;
                if (changedState) {
                    const data: any = elm.data ?? { id: Number(id) };
                    changed.data = {
                        ...data,
                        props: { ...data.props, ...changedState },
                    };
                }
                // XXX: Check the types to see if this is even possible
                if ((update as any).changedAttributes) {
                    console.warn("Updating attributes is not yet implemented");
                }
                if (update.newChildren) {
                    changed.children = update.newChildren;
                }
                elements[Number(id)] = changed;
            }
            state.flatDastRoot = { ...root, elements };
        },
    },
});

export const dastReducer = dastSlice.reducer;

/**
 * Synchronous actions that directly manipulate data in the store.
 */
export const _dastReducerActions = { ...dastSlice.actions };

const selfSelector = (state: RootState) => state.dast;
export const dastSelector = (state: RootState) =>
    selfSelector(state).dastFromSource;
export const flatDastSelector = (state: RootState) =>
    selfSelector(state).flatDastRoot;
export const doenetSourceSelector = (state: RootState) =>
    selfSelector(state).source;
export const errorsSelector = (state: RootState) =>
    selfSelector(state).dastErrors;

export const elementsArraySelector = (state: RootState) =>
    selfSelector(state).flatDastRoot.elements;
