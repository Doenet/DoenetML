import React from "react";

import {
    reportMathInputFocus,
    UniqueKeyboardTray,
} from "./unique-keyboard-tray";
import { KeyCommand } from "./keys";

/**
 * A message that is sent from the parent window to the iframe
 */
export type IframeMessage = {
    keyCommands: KeyCommand[];
    subject: "keyboard";
};

/**
 * A message sent from the iframe up to the parent window, reporting whether a
 * math input inside it has focus.
 *
 * The tray lives in the parent, whose own focus events see no further than
 * "the iframe is focused" — they cannot distinguish a math input from a text
 * input inside it, and the two want opposite things from the tray. So the
 * iframe, which can tell, says so.
 *
 * Posted with a target origin of `"*"`, for the same reason `IframeMessage`
 * is: the two documents are routinely on different origins, and neither can
 * read the other's. Nothing here is sensitive — whether a math input has
 * focus, and where it is on the screen (`inputRect`) — and the parent only
 * acts on messages whose `event.source` is its own iframe.
 */
export type IframeFocusMessage = {
    subject: "keyboard-focus";
    mathInputFocused: boolean;
    /**
     * Where the focused math input is — with its check button, if it has one —
     * in the iframe's viewport, so a keyboard the parent draws can keep it in
     * view. Sent only while a math input is focused, and only by viewers that
     * know to; a parent must not rely on it. Vertical extent only: that is all
     * a keyboard along the bottom of the screen can cover.
     */
    inputRect?: { top: number; bottom: number };
};

/**
 * A message from the parent window asking the iframe to report focus again
 * (an `IframeFocusMessage` with `mathInputFocused: true`) if one of its math
 * inputs has focus. Nothing is sent otherwise.
 *
 * The parent sends it when its iframe has loaded a document. It cannot tell
 * the load of a new document (the one whose input had focus is gone, and
 * nothing says so) from the late load of the same one (whose input took focus
 * before its images finished), so it forgets the focus and asks.
 */
export type IframeFocusQueryMessage = {
    subject: "keyboard-focus-query";
};

/**
 * Virtual keyboard that is connected via `<mathInput>` elements.
 */
export function ExternalVirtualKeyboard({
    theme,
    ownerRef,
}: {
    theme?: "dark" | "light";
    ownerRef: React.RefObject<HTMLIFrameElement | null>;
}) {
    React.useEffect(() => {
        let reportedFocused = false;

        function listener(event: MessageEvent<IframeFocusMessage | undefined>) {
            // Only this keyboard's own iframe may move this keyboard's tray.
            if (
                event.source !== ownerRef.current?.contentWindow ||
                event.data?.subject !== "keyboard-focus"
            ) {
                return;
            }
            reportedFocused = event.data.mathInputFocused;
            reportMathInputFocus(ownerRef, reportedFocused);
        }

        window.addEventListener("message", listener);

        return () => {
            window.removeEventListener("message", listener);
            if (reportedFocused) {
                // This keyboard is going away while its iframe still holds the
                // focused math input. Withdraw the claim, or the tray would
                // stay open for a viewer that is no longer on the page.
                reportMathInputFocus(ownerRef, false);
            }
        };
    }, [ownerRef]);

    return (
        <UniqueKeyboardTray
            ownerRef={ownerRef}
            theme={theme}
            onClick={(events) => {
                if (!ownerRef.current) {
                    return;
                }
                ownerRef.current.contentWindow?.postMessage(
                    {
                        keyCommands: events,
                        subject: "keyboard",
                    } satisfies IframeMessage,
                    // Use "*" rather than window.location.origin: targetOrigin
                    // must match the *iframe document's* origin, not the parent's.
                    // The iframe may be cross-origin, so "*" is the only safe
                    // value here. The message is low-sensitivity (key commands
                    // only) and the recipient already validates event.source.
                    "*",
                );
            }}
        />
    );
}
