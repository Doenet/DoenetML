/**
 * Theme types and pure (non-React) helpers shared between `@doenet/doenetml`
 * and `@doenet/doenetml-iframe`.
 *
 * `ThemeSetting` is the public, author-facing value of the `darkMode` prop:
 * three-state so a host can either pin a theme (`"light"` / `"dark"`) or
 * defer to the user's OS/browser preference (`"system"`).
 *
 * `ResolvedTheme` is the concrete two-state value the rendering stack
 * consumes: it drives the `data-theme` attribute (CSS custom-property
 * switch in `DoenetML.css`) and is passed to renderers via `DocContext`.
 *
 * `useResolvedTheme` is intentionally NOT exported from here because it
 * depends on React (`useSyncExternalStore`). Each React-bearing package
 * (`@doenet/doenetml`, `@doenet/doenetml-iframe`) imports these types/helpers
 * from `@doenet/utils` and defines its own hook locally to avoid adding a
 * React peer-dependency to `@doenet/utils`.
 */
export type ThemeSetting = "dark" | "light" | "system";
export type ResolvedTheme = "dark" | "light";

const DARK_MODE_QUERY = "(prefers-color-scheme: dark)";

/**
 * Returns the current OS/browser preferred color scheme without subscribing
 * to changes. SSR-safe: returns `"light"` when `window.matchMedia` is absent.
 */
export function getSystemTheme(): ResolvedTheme {
    if (
        typeof window === "undefined" ||
        typeof window.matchMedia !== "function"
    ) {
        return "light";
    }
    return window.matchMedia(DARK_MODE_QUERY).matches ? "dark" : "light";
}

/**
 * Subscribes to OS/browser `prefers-color-scheme` changes. Handles the
 * deprecated Safari < 14 `addListener`/`removeListener` API. SSR-safe.
 * Returns an unsubscribe function.
 */
export function subscribeToSystemTheme(onChange: () => void): () => void {
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
