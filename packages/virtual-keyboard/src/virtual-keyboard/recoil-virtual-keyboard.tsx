import React from "react";

import { IframeMessage } from "./external-virtual-keyboard";
import { UniqueKeyboardTray } from "./unique-keyboard-tray";
import { KeyCommand } from "./keys";

/**
 * Virtual keyboard that can be made aware of an externally provided virtual keyboard (e.g., when used
 * in an iframe).
 */
export function ExternalAwareVirtualKeyboard({
    externalVirtualKeyboardProvided = false,
    onClick = () => {},
}: {
    /**
     * Whether an external virtual keyboard (possibly with a different parent because Doenet is running in an iframe)
     * is provided. If true, this component is effectively a no-op.
     */
    externalVirtualKeyboardProvided?: boolean;
    /**
     * Callback function to be called when the keyboard is clicked.
     */
    onClick?: (events: KeyCommand[]) => void;
}) {
    React.useEffect(() => {
        if (externalVirtualKeyboardProvided) {
            // If an external keyboard is provided,
            // then we expect that the keyboard events will be sent via messages on the parent.
            const listener = (
                event: MessageEvent<IframeMessage | undefined>,
            ) => {
                if (
                    event.origin !== window.parent.location.origin ||
                    event.data?.subject !== "keyboard"
                ) {
                    return;
                }

                onClick(event.data.keyCommands);
            };

            window.parent.addEventListener("message", listener);

            return () => {
                window.parent.removeEventListener("message", listener);
            };
        }
    }, [externalVirtualKeyboardProvided]);

    // If an external keyboard is not provided,
    // then we add a reference to the keyboard here
    // that will return the events via a callback.
    return externalVirtualKeyboardProvided ? null : (
        <UniqueKeyboardTray onClick={onClick} />
    );
}
