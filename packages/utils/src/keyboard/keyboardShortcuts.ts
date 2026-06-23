/**
 * Helpers for detecting platform-aware keyboard shortcuts.
 */

/**
 * Whether the current platform is "Mac-like" — macOS or iOS/iPadOS — where the
 * conventional "command" modifier is Cmd (the meta key) rather than Ctrl. iOS
 * and iPadOS are included because external keyboards on those platforms also
 * use Cmd for shortcuts like Cmd+S.
 *
 * Prefers the modern `navigator.userAgentData.platform` and falls back to the
 * deprecated `navigator.platform`. Returns `false` in non-browser
 * environments (e.g. SSR).
 */
export function isMacPlatform(): boolean {
    if (typeof navigator === "undefined") {
        return false;
    }
    const uaPlatform = (
        navigator as Navigator & { userAgentData?: { platform?: string } }
    ).userAgentData?.platform;
    const platform = uaPlatform ?? navigator.platform ?? "";
    // iPadOS Safari reports "MacIntel" (caught by /mac/), but older iPads and
    // iPhones report "iPad"/"iPhone"/"iPod", so match those explicitly.
    return /mac|iphone|ipad|ipod/i.test(platform);
}

/**
 * The subset of a keyboard event that {@link isSaveShortcutKeydown} inspects.
 *
 * Declared structurally (rather than referencing the DOM `KeyboardEvent`) so
 * that `@doenet/utils` stays usable in non-DOM TypeScript configs that don't
 * include the `dom` lib. A real DOM `KeyboardEvent` satisfies this type.
 */
export type SaveShortcutKeyboardEvent = {
    metaKey: boolean;
    ctrlKey: boolean;
    altKey: boolean;
    shiftKey: boolean;
    code: string;
};

/**
 * Whether a keydown event is the platform's "save" shortcut: Cmd+S on macOS,
 * Ctrl+S elsewhere. AltGr/Alt combinations are excluded so that, on layouts
 * where AltGr+S produces a character (and AltGr reports `ctrlKey === true`),
 * the character is still inserted. Shift is also excluded so that Cmd/Ctrl+Shift+S
 * ("Save As") does not trigger the shortcut.
 *
 * This mirrors the "Mod-s" convention used by code editors such as CodeMirror,
 * and is used to trigger a viewer refresh from the editor. `event.code` is used
 * (rather than `event.key`) so the shortcut is keyboard-layout independent.
 */
export function isSaveShortcutKeydown(
    event: SaveShortcutKeyboardEvent,
): boolean {
    const modifier = isMacPlatform() ? event.metaKey : event.ctrlKey;
    return (
        modifier && !event.altKey && !event.shiftKey && event.code === "KeyS"
    );
}
