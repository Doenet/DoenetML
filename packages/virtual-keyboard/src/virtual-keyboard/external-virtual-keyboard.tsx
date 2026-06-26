import React from "react";

import { UniqueKeyboardTray } from "./unique-keyboard-tray";
import { KeyCommand } from "./keys";

/**
 * A message that is sent from the parent window to the iframe
 */
export type IframeMessage = {
    keyCommands: KeyCommand[];
    subject: "keyboard";
};

/**
 * Virtual keyboard that is connected via `<mathInput>` elements.
 */
export function ExternalVirtualKeyboard({
    theme,
    ownerRef,
}: {
    theme?: "dark" | "light";
    ownerRef: React.RefObject<HTMLElement | null>;
}) {
    return (
        <UniqueKeyboardTray
            ownerRef={ownerRef}
            theme={theme}
            onClick={(events) => {
                if (!(ownerRef.current instanceof HTMLIFrameElement)) {
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
