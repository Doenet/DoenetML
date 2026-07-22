import { useSyncExternalStore } from "react";
import { getSystemTheme, subscribeToSystemTheme } from "@doenet/utils";

export type { ThemeSetting, ResolvedTheme } from "@doenet/utils";
import type { ThemeSetting, ResolvedTheme } from "@doenet/utils";

function subscribeToPinnedTheme(): () => void {
    return () => {};
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
    const subscribe =
        setting === "system" ? subscribeToSystemTheme : subscribeToPinnedTheme;
    const systemTheme = useSyncExternalStore(
        subscribe,
        getSystemTheme,
        () => "light" as ResolvedTheme,
    );

    if (setting === "system") {
        return systemTheme;
    }
    return setting;
}
