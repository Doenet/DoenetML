import React from "react";
import { useRecoilValue } from "recoil";

import { focusedMathField, focusedMathFieldReturn } from "../MathInputSelector";
import { translateKeyboardEvent } from "./translate-events";
import { IframeMessage } from "./outside-iframe-keyboard";

/**
 * Virtual keyboard that is connected via Recoil to math elements.
 */
export function RecoilVirtualKeyboard() {
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
        const listener = (event: MessageEvent<IframeMessage | undefined>) => {
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
    }, []);

    return null;
}
