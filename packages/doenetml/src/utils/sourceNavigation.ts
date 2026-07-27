/**
 * Whether an event carries the click-to-navigate modifier.
 *
 * Navigating between the source editor and the rendered viewer (in either
 * direction) is an explicit gesture — Cmd+click on macOS, Ctrl+click on
 * Windows/Linux, the same convention as an editor's go-to-definition — so
 * that plain clicks interact with the document without moving either pane.
 * Cmd/Ctrl+Enter is the keyboard equivalent on a focused graph element.
 * Touch devices have no modifier key, so the gesture is unavailable there.
 *
 * Either modifier is accepted on every platform rather than picking one
 * from the user agent: the "wrong" combination has no competing meaning
 * here, and accepting both keeps the gesture reachable from any keyboard.
 *
 * The parameter is structural so it accepts every event shape in play:
 * native `MouseEvent`s, React synthetic events, and the native events
 * JSXGraph forwards to its own handlers.
 */
export function hasNavigationModifier(event: {
    metaKey?: boolean;
    ctrlKey?: boolean;
}): boolean {
    return Boolean(event.metaKey || event.ctrlKey);
}
