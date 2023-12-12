import { configureStore } from "@reduxjs/toolkit";
import { dastReducer } from "./redux-slices/dast";
import { coreReducer } from "./redux-slices/core";

/**
 * This Redux store keeps the state/update state for the whole app.
 */
export const store = configureStore({
    reducer: { dast: dastReducer, core: coreReducer },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
