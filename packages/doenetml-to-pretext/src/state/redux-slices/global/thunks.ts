import { globalActions } from ".";
import { createLoggingAsyncThunk } from "../../hooks";
import { _globalReducerActions } from "./slice";

export const globalThunks = {
    watchForDarkModePreferenceChange: createLoggingAsyncThunk(
        "global/watchForDarkModePreferenceChange",
        async (_: void, { dispatch }) => {
            if (typeof window !== "undefined" && window.matchMedia) {
                const mediaQuery = window.matchMedia(
                    "(prefers-color-scheme: dark)",
                );
                const listener = (e: MediaQueryListEvent) => {
                    dispatch(globalActions.setDarkMode(mediaQuery.matches));
                };
                mediaQuery.addEventListener("change", listener);
                dispatch(globalActions.setDarkMode(mediaQuery.matches));
            }
        },
    ),
    setDarkMode: createLoggingAsyncThunk(
        "global/setDarkMode",
        async (darkMode: boolean, { dispatch }) => {
            console.log("setDarkMode", darkMode);
            document.querySelector("html")?.classList.toggle("dark", darkMode);
            dispatch(_globalReducerActions._setDarkMode(darkMode));
        },
    ),
};
