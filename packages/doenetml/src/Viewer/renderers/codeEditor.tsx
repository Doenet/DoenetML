import React, { useState, useRef, useEffect } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
// @ts-ignore
import { sizeToCSS } from "./utils/css";
import { useInView } from "framer-motion";
import { EditorViewer } from "../../EditorViewer/EditorViewer";

export default React.memo(function CodeEditor(props: UseDoenetRendererProps) {
    let { id, SVs, actions, ignoreUpdate, callAction, fetchExternalDoenetML } =
        useDoenetRenderer(props) as any;

    // @ts-ignore
    CodeEditor.baseStateVariable = "immediateValue";

    const [currentValue, setCurrentValue] = useState(SVs.immediateValue);
    const currentValueRef = useRef(currentValue);
    currentValueRef.current = currentValue;

    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { amount: 0 });

    useEffect(() => {
        callAction({
            action: actions.recordVisibilityChange,
            args: { isVisible: isInView },
        });
    }, [isInView]);

    const immediateDoenetmlChangeCallback = React.useCallback(
        (value: string) => {
            setCurrentValue(value);

            callAction({
                action: actions.updateImmediateValue,
                args: { text: value },
                baseVariableValue: value,
            });
        },
        [actions.updateImmediateValue, callAction],
    );

    const doenetmlChangeCallback = React.useCallback(
        (value: string) => {
            callAction({
                action: actions.updateValue,
                baseVariableValue: currentValueRef.current,
            });
        },
        [actions.updateValue, callAction],
    );

    useEffect(() => {
        return () => {
            callAction({
                action: actions.recordVisibilityChange,
                args: { isVisible: false },
            });
        };
    }, []);

    if (SVs.hidden) {
        return null;
    }

    //Received update from core to immediateValue
    //NOTE: currently causes a scrolling issue
    //https://codemirror.net/doc/manual.html#events
    // cm.scrollTo(x: number, y: number)
    // Scroll the editor to a given (pixel) position. Both arguments may be left as null or undefined to have no effect.
    // cm.getScrollInfo() → {left, top, width, height, clientWidth, clientHeight}
    // Get an {left, top, width, height, clientWidth, clientHeight} object that represents the current scroll position, the size of the scrollable area, and the size of the visible area (minus scrollbars).

    if (!ignoreUpdate && SVs.immediateValue !== currentValue) {
        setCurrentValue(SVs.immediateValue);
    }

    return (
        <div ref={ref}>
            <EditorViewer
                id={id}
                activityId={id}
                prefixForIds={id + "::"}
                doenetML={currentValue}
                width={sizeToCSS(SVs.width)}
                height={sizeToCSS(SVs.height)}
                showViewer={SVs.showResults}
                viewerLocation={SVs.resultsLocation}
                showResponses={false}
                showFormatter={SVs.showFormatter}
                readOnly={SVs.readOnly}
                immediateDoenetmlChangeCallback={
                    immediateDoenetmlChangeCallback
                }
                doenetmlChangeCallback={doenetmlChangeCallback}
                fetchExternalDoenetML={fetchExternalDoenetML}
            />
        </div>
    );
});
