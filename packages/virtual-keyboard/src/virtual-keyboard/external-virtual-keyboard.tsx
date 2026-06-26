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
    ownerRef?: React.RefObject<HTMLElement | null>;
} = {}) {
    return (
        <UniqueKeyboardTray
            ownerRef={ownerRef}
            theme={theme}
            onClick={(events) => {
                const iframeWindow =
                    ownerRef?.current instanceof HTMLIFrameElement
                        ? ownerRef.current.contentWindow
                        : null;

                if (iframeWindow) {
                    iframeWindow.postMessage(
                        {
                            keyCommands: events,
                            subject: "keyboard",
                        } satisfies IframeMessage,
                        window.location.origin,
                    );
                    return;
                }

                window.postMessage({
                    keyCommands: events,
                    subject: "keyboard",
                } satisfies IframeMessage);
            }}
        />
    );
}
