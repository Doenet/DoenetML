/**
 * This file contains Redux information for the main store of the app.
 */

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createLoggingAsyncThunk } from "../hooks";
import React from "react";

export type ComponentInfo = {
    stateValues: Record<string, any>;
    sourceOfUpdate?: {
        local?: boolean;
        sourceInformation?: Record<string, unknown>;
    };
    ignoreUpdate: boolean;
    childrenInstructions: Record<string, any>[];
    prefixForIds: string;
};

/**
 * Type alias to make sure that the type of an action identifier is unique.
 */
export type UniqueActionIdentifier = string & {
    readonly __brand: unique symbol;
};
export function actionIdentifier(
    actionId: string,
    componentIdx: number,
): UniqueActionIdentifier {
    return `${actionId}|${componentIdx}` as UniqueActionIdentifier;
}

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
    name: "main",
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

export const mainThunks = {
    /**
     * Updates the state variables for a specific component.
     */
    updateRendererSVs: createLoggingAsyncThunk(
        "main/updateRendererSVs",
        async (
            {
                coreId,
                componentIdx,
                stateValues,
                childrenInstructions,
                sourceOfUpdate,
                baseStateVariable,
                actionId,
                updatesToIgnoreRef,
                prefixForIds = "",
            }: {
                coreId: string;
                componentIdx: number;
                stateValues: Record<string, any>;
                childrenInstructions?: Record<string, any>[];
                sourceOfUpdate?: Record<string, any>;
                baseStateVariable?: string;
                actionId?: string;
                updatesToIgnoreRef: React.RefObject<
                    Map<UniqueActionIdentifier, string>
                >;
                prefixForIds: string;
            },
            { dispatch, getState },
        ) => {
            let ignoreUpdate = false;

            let rendererName = coreId + componentIdx;

            if (baseStateVariable) {
                const updatesToIgnore = updatesToIgnoreRef.current;

                if (updatesToIgnore.size > 0) {
                    let valueFromRenderer = updatesToIgnore.get(
                        actionIdentifier(actionId || "", componentIdx),
                    );
                    let valueFromCore = stateValues[baseStateVariable];
                    if (
                        valueFromRenderer === valueFromCore ||
                        (Array.isArray(valueFromRenderer) &&
                            Array.isArray(valueFromCore) &&
                            valueFromRenderer.length == valueFromCore.length &&
                            valueFromRenderer.every(
                                (v, i) => valueFromCore[i] === v,
                            ))
                    ) {
                        // console.log(`ignoring update of ${componentIdx} to ${valueFromCore}`)
                        ignoreUpdate = true;
                        // We've decided to ignore the update. Every update has a unique id,
                        // so we should safely be able to remove it from the ignore map.
                        updatesToIgnore.delete(
                            actionIdentifier(actionId || "", componentIdx),
                        );
                    } else {
                        // since value was changed from the time the update was created
                        // don't ignore the remaining pending changes in updatesToIgnore
                        // as we changed the state used to determine they could be ignored
                        updatesToIgnore.clear();
                    }
                }
            }

            let childrenInstructions2: Record<string, any>[];

            if (childrenInstructions === undefined) {
                let previousRendererState =
                    mainSlice.selectors.componentInfo(getState())[rendererName];

                // TODO: create a test that reproduces the situation where `previousRendererState` is not defined at this stage.
                // One case where the variable `previousRendererState` can be `undefined` is in a React dev server
                // where functions are called twice to test robustness.
                // In this case, one can get a new core and a new `coreId` so that `rendererName` no longer corresponds to a saved state.
                childrenInstructions2 =
                    previousRendererState?.childrenInstructions ?? null;
            } else {
                childrenInstructions2 = childrenInstructions;
            }

            let newRendererState: ComponentInfo = {
                stateValues,
                childrenInstructions: childrenInstructions2,
                sourceOfUpdate,
                ignoreUpdate,
                prefixForIds,
            };

            dispatch(
                mainSlice.actions.setComponentInfo({
                    key: rendererName,
                    componentInfo: newRendererState,
                }),
            );
        },
    ),
};
