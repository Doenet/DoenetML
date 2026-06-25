import { useSyncExternalStore } from "react";

/**
 * Theme handling for DoenetML viewers/editors.
 *
 * `ThemeSetting` is the public, author-facing value of the `darkMode` prop. It
 * is three-state so a host can either pin a theme (`"light"` / `"dark"`) or
 * defer to the user's OS/browser preference (`"system"`).
 *
 * `ResolvedTheme` is the concrete two-state value the rest of the rendering
 * stack consumes: it is what gets written to the `data-theme` attribute (which
 * drives the CSS custom-property switch in `DoenetML.css`) and what is handed to
 * renderers via `DocContext.darkMode` so JSXGraph object colors can pick between
 * their light/dark variants.
 */
export type ThemeSetting = "dark" | "light" | "system";
export type ResolvedTheme = "dark" | "light";

const DARK_MODE_QUERY = "(prefers-color-scheme: dark)";

function getSystemTheme(): ResolvedTheme {
    if (
        typeof window === "undefined" ||
        typeof window.matchMedia !== "function"
    ) {
        return "light";
    }
    return window.matchMedia(DARK_MODE_QUERY).matches ? "dark" : "light";
}

function subscribeToSystemTheme(onChange: () => void): () => void {
    if (
        typeof window === "undefined" ||
        typeof window.matchMedia !== "function"
    ) {
        return () => {};
    }

    const mediaQuery = window.matchMedia(DARK_MODE_QUERY);

    // Safari < 14 only supports the deprecated addListener/removeListener API.
    if (typeof mediaQuery.addEventListener === "function") {
        mediaQuery.addEventListener("change", onChange);
        return () => mediaQuery.removeEventListener("change", onChange);
    }

    mediaQuery.addListener(onChange);
    return () => mediaQuery.removeListener(onChange);
}

/**
 * Resolves a `ThemeSetting` to a concrete `ResolvedTheme`.
 *
 * When the setting is `"system"`, the resolved value tracks the
 * `prefers-color-scheme` media query and updates live when the user changes
 * their OS/browser preference. `useSyncExternalStore` keeps the subscription
 * tear-free and SSR-safe (the server snapshot is always `"light"`).
 */
export function useResolvedTheme(setting: ThemeSetting): ResolvedTheme {
    const systemTheme = useSyncExternalStore(
        subscribeToSystemTheme,
        getSystemTheme,
        () => "light" as ResolvedTheme,
    );

    if (setting === "system") {
        return systemTheme;
    }
    return setting;
}
