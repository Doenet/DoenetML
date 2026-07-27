/**
 * Whether an event carries the click-to-navigate modifier.
 *
 * Navigating between the source editor and the rendered viewer (in either
 * direction) is an explicit gesture — Cmd+click on macOS, Ctrl+click on
 * Windows/Linux, the same convention as an editor's go-to-definition — so
 * that plain clicks interact with the document without moving either pane.
 * Cmd/Ctrl+Enter is the keyboard equivalent on a focused graph element.
 *
 * Either modifier is accepted on every platform rather than picking one
 * from the user agent: the "wrong" combination has no competing meaning
 * here, and accepting both keeps the gesture reachable from any keyboard
 * layout (and from headless test browsers, which run on Linux while
 * synthesizing `metaKey`).
 *
 * The parameter is structural so every event shape in play qualifies:
 * native `MouseEvent`s, React synthetic events, and the native events
 * JSXGraph forwards to its own handlers.
 *
 * Note that touch devices have no modifier key, so click-to-navigate is
 * unavailable there.
 */
export function hasNavigationModifier(event: {
    metaKey?: boolean;
    ctrlKey?: boolean;
}): boolean {
    return Boolean(event.metaKey || event.ctrlKey);
}
