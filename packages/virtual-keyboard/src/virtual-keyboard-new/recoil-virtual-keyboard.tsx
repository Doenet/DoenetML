import React from "react";
import { useRecoilValue } from "recoil";

import { focusedMathField, focusedMathFieldReturn } from "../MathInputSelector";
import { UniqueKeyboardTray } from "./unique-keyboard-tray";
import { translateKeyboardEvent } from "./translate-events";

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
                callback(e.focusedMathField, e.timestamp);
            }
        }
    }, [recoilEvents]);

    return (
        <UniqueKeyboardTray
            onClick={(events, timestamp) => {
                setRecoilEvents(translateKeyboardEvent(events, timestamp));
            }}
        />
    );
}
