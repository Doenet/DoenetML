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
export function ExternalVirtualKeyboard() {
    return (
        <UniqueKeyboardTray
            onClick={(events) => {
                window.postMessage({
                    keyCommands: events,
                    subject: "keyboard",
                } satisfies IframeMessage);
            }}
        />
    );
}
