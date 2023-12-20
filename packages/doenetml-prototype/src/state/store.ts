import { configureStore } from "@reduxjs/toolkit";
import { dastReducer } from "./redux-slices/dast";
import { coreReducer } from "./redux-slices/core";
import { globalReducer } from "./redux-slices/global";
import { analyticsReducer } from "./redux-slices/analytics";

/**
 * This Redux store keeps the state/update state for the whole app.
 */
export const store = configureStore({
    reducer: {
        dast: dastReducer,
        core: coreReducer,
        global: globalReducer,
        analytics: analyticsReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
