import React from "react";
import { useRecoilValue } from "recoil";

import { focusedMathField, focusedMathFieldReturn } from "../MathInputSelector";
import { translateKeyboardEvent } from "./translate-events";
import { IframeMessage } from "./external-virtual-keyboard";
import { UniqueKeyboardTray } from "./unique-keyboard-tray";

/**
 * Virtual keyboard that is connected via Recoil to math elements.
 */
export function RecoilVirtualKeyboard({
    externalVirtualKeyboardProvided = false,
}: {
    externalVirtualKeyboardProvided?: boolean;
}) {
    const callback = useRecoilValue(focusedMathField);
    const returnCallback = useRecoilValue(focusedMathFieldReturn);
    const [recoilEvents, setRecoilEvents] = React.useState<
        ReturnType<typeof translateKeyboardEvent>
    >([]);
    const callbackRef = React.useRef<Function>(callback);

    React.useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    React.useEffect(() => {
        const callback = callbackRef.current;
        for (const e of recoilEvents) {
            if (
                e.focusedMathFieldReturn != null &&
                typeof returnCallback === "function"
            ) {
                returnCallback();
            }
            if (e.focusedMathField && typeof callback === "function") {
                callback(e.focusedMathField);
            }
        }
    }, [recoilEvents]);

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

                setRecoilEvents(translateKeyboardEvent(event.data.keyCommands));
            };

            window.parent.addEventListener("message", listener);

            return () => {
                window.parent.removeEventListener("message", listener);
            };
        }
    }, []);

    // If an external keyboard is not provided,
    // then we add a reference to the keyboard here
    // that will return the events via a callback.
    return externalVirtualKeyboardProvided ? null : (
        <UniqueKeyboardTray
            onClick={(events) => {
                setRecoilEvents(translateKeyboardEvent(events));
            }}
        />
    );
}
