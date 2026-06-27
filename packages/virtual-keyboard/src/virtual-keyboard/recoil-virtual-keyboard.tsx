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
    theme,
    ownerRef,
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
    /**
     * Resolved theme to apply to the keyboard tray. `"dark"` and `"light"` are
     * the only accepted values; `"system"` must be resolved to one of these
     * before passing here.
     */
    theme?: "dark" | "light";
    /**
     * Element whose focus should be treated as this keyboard instance being
     * active when a document-wide shared tray is used.
     */
    ownerRef: React.RefObject<HTMLElement | null>;
}) {
    React.useEffect(() => {
        if (externalVirtualKeyboardProvided) {
            // If an external keyboard is provided, then we expect keyboard
            // events to be posted directly into this iframe window by the
            // parent wrapper.
            const listener = (
                event: MessageEvent<IframeMessage | undefined>,
            ) => {
                // Use event.source === window.parent rather than comparing
                // event.origin to window.parent.location.origin: accessing
                // window.parent.location throws a DOMException when the
                // parent is cross-origin, which is the normal deployment
                // scenario for an embedded DoenetML iframe.
                if (
                    event.source !== window.parent ||
                    event.data?.subject !== "keyboard"
                ) {
                    return;
                }

                onClick(event.data.keyCommands);
            };

            window.addEventListener("message", listener);

            return () => {
                window.removeEventListener("message", listener);
            };
        }
    }, [externalVirtualKeyboardProvided, onClick]);

    // If an external keyboard is not provided,
    // then we add a reference to the keyboard here
    // that will return the events via a callback.
    return externalVirtualKeyboardProvided ? null : (
        <UniqueKeyboardTray
            onClick={onClick}
            ownerRef={ownerRef}
            theme={theme}
        />
    );
}
