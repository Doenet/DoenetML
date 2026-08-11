import React from "react";

import { IframeFocusMessage, IframeMessage } from "./external-virtual-keyboard";
import {
    reportMathInputFocus,
    UniqueKeyboardTray,
} from "./unique-keyboard-tray";
import { KeyCommand } from "./keys";
import type { Direction, Translator } from "@doenet/i18n";

/**
 * Virtual keyboard that can be made aware of an externally provided virtual keyboard (e.g., when used
 * in an iframe).
 */
export function ExternalAwareVirtualKeyboard({
    externalVirtualKeyboardProvided = false,
    onClick = () => {},
    theme,
    translate,
    direction,
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
     * Chrome translator for the tray's labels. Defaults to English when
     * omitted.
     */
    translate?: Translator;
    /**
     * Writing direction for the tray's own chrome. Defaults to left-to-right
     * when omitted. The keys stay left-to-right regardless — they are
     * mathematical notation.
     */
    direction?: Direction;
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

    // Watch focus entering and leaving this viewer's math inputs, so the tray
    // can follow it on a touch device. `ownerRef` is the element of whichever
    // math input is currently focused, which makes it the signal: a text input
    // taking focus leaves it empty, and the tray gets out of the way of the
    // device's own keyboard.
    React.useEffect(() => {
        let lastReported: boolean | null = null;
        let pending: ReturnType<typeof setTimeout> | undefined;

        function report() {
            const activeElement = document.activeElement;
            const owner = ownerRef.current;
            const mathInputFocused =
                owner !== null &&
                activeElement instanceof Node &&
                owner.contains(activeElement);

            if (mathInputFocused === lastReported) {
                return;
            }
            lastReported = mathInputFocused;

            if (externalVirtualKeyboardProvided) {
                // The tray lives in the embedding page, which cannot see which
                // element inside this iframe has focus. See `IframeFocusMessage`
                // for why the target origin is "*".
                window.parent.postMessage(
                    {
                        subject: "keyboard-focus",
                        mathInputFocused,
                    } satisfies IframeFocusMessage,
                    "*",
                );
            } else {
                reportMathInputFocus(mathInputFocused);
            }
        }

        function scheduleReport() {
            // Focus passes through `<body>` on its way between two elements,
            // so wait for it to land before reading `document.activeElement`.
            // This also coalesces the focusout/focusin pair into one report.
            clearTimeout(pending);
            pending = setTimeout(report, 0);
        }

        document.addEventListener("focusin", scheduleReport);
        document.addEventListener("focusout", scheduleReport);

        return () => {
            clearTimeout(pending);
            document.removeEventListener("focusin", scheduleReport);
            document.removeEventListener("focusout", scheduleReport);
        };
    }, [externalVirtualKeyboardProvided, ownerRef]);

    // If an external keyboard is not provided,
    // then we add a reference to the keyboard here
    // that will return the events via a callback.
    return externalVirtualKeyboardProvided ? null : (
        <UniqueKeyboardTray
            onClick={onClick}
            ownerRef={ownerRef}
            theme={theme}
            translate={translate}
            direction={direction}
        />
    );
}
