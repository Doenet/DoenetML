/**
 * Helpers for detecting what kind of pointing device the reader is using,
 * which is what distinguishes a phone or tablet (where the operating system
 * raises an on-screen keyboard on focus) from a desktop with a physical
 * keyboard.
 */

/**
 * Matches when the reader's *primary* pointing device is coarse — a finger on
 * a phone or tablet.
 *
 * `(pointer: coarse)` rather than `(any-pointer: coarse)`: a touchscreen
 * laptop matches `any-pointer: coarse` but its primary pointer is the mouse,
 * and its reader has a physical keyboard. Conversely a tablet with a stylus
 * matches `any-pointer: fine` while still being a device whose reader has no
 * physical keyboard, and `(pointer: coarse)` correctly still matches there.
 */
export const COARSE_POINTER_QUERY = "(pointer: coarse)";

/**
 * Accesses `matchMedia` structurally through `globalThis` so this file doesn't
 * reference the DOM `Window` type, keeping `@doenet/utils` usable in TS
 * configs that omit the `dom` lib (the same approach `keyboardShortcuts.ts`
 * takes for `navigator`).
 */
type MinimalMediaQueryList = {
    matches: boolean;
    addEventListener?: (type: "change", listener: () => void) => void;
    removeEventListener?: (type: "change", listener: () => void) => void;
};

function getCoarsePointerQueryList(): MinimalMediaQueryList | null {
    const matchMedia = (
        globalThis as {
            matchMedia?: (query: string) => MinimalMediaQueryList;
        }
    ).matchMedia;

    if (typeof matchMedia !== "function") {
        // Non-browser environment (e.g. SSR, the worker, or a jsdom setup
        // without `matchMedia`). Treat as a conventional pointer device.
        return null;
    }

    return matchMedia(COARSE_POINTER_QUERY);
}

/**
 * Whether the reader's primary pointing device is coarse, i.e. whether this is
 * a touch-first device such as a phone or tablet.
 *
 * Returns `false` when the environment cannot answer the question, so callers
 * default to desktop behavior.
 */
export function hasCoarsePrimaryPointer(): boolean {
    return getCoarsePointerQueryList()?.matches ?? false;
}

/**
 * Calls `listener` whenever the answer from {@link hasCoarsePrimaryPointer}
 * changes — a tablet gaining a trackpad, or a device rotating into a mode the
 * browser reports differently. Returns an unsubscribe function.
 */
export function subscribeToPrimaryPointerType(
    listener: () => void,
): () => void {
    const queryList = getCoarsePointerQueryList();

    if (!queryList?.addEventListener) {
        return () => {};
    }

    queryList.addEventListener("change", listener);

    return () => {
        queryList.removeEventListener?.("change", listener);
    };
}
