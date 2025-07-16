import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { AsyncThunkPayloadCreator, createAsyncThunk } from "@reduxjs/toolkit";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * A wrapper around `createAsyncThunk` that logs to the console
 * when an error is thrown. Errors thrown in thunks created with `createAsyncThunk` are
 * throw silently. (You are expected to catch the `rejected` status to deal with the error.)
 */
export const createLoggingAsyncThunk = <Returned, ThunkArg = void>(
    typePrefix: string,
    payloadCreator: AsyncThunkPayloadCreator<
        Returned,
        ThunkArg,
        { state: RootState }
    >,
) => {
    const wrappedPayloadCreator: typeof payloadCreator = (async (...args) => {
        try {
            return await payloadCreator(...args);
        } catch (e) {
            console.warn(e);
            throw e;
        }
    }) as typeof payloadCreator;
    return createAsyncThunk(typePrefix, wrappedPayloadCreator);
};
