import React, { useState, useRef, useEffect } from "react";
import useDoenetRenderer, { rendererState } from "../useDoenetRenderer";
// @ts-ignore
import { sizeToCSS } from "./utils/css";
import { useInView } from "framer-motion";
import { useSetRecoilState } from "recoil";
import { EditorViewer } from "../../EditorViewer/EditorViewer";

export default React.memo(function CodeEditor(props) {
    let {
        name,
        id,
        SVs,
        children,
        actions,
        ignoreUpdate,
        rendererName,
        callAction,
    } = useDoenetRenderer(props) as any;

    // @ts-ignore
    CodeEditor.baseStateVariable = "immediateValue";

    const setRendererState = useSetRecoilState(rendererState(rendererName));

    let currentValue = useRef(SVs.immediateValue);

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
            currentValue.current = value;

            setRendererState((was) => {
                let newObj = { ...was };
                newObj.ignoreUpdate = true;
                return newObj;
            });

            callAction({
                action: actions.updateImmediateValue,
                args: { text: value },
                baseVariableValue: value,
            });
        },
        [actions.updateImmediateValue, callAction, setRendererState],
    );

    const doenetmlChangeCallback = React.useCallback(
        (value: string) => {
            callAction({
                action: actions.updateValue,
                baseVariableValue: currentValue.current,
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

    if (!ignoreUpdate && SVs.immediateValue !== currentValue.current) {
        currentValue.current = SVs.immediateValue;
    }

    return (
        <div ref={ref} style={{ border: "1px solid" }}>
            <EditorViewer
                id={id}
                doenetML={currentValue.current}
                width={sizeToCSS(SVs.width)}
                height={sizeToCSS(SVs.height)}
                showViewer={SVs.showResults}
                viewerLocation={SVs.resultsLocation}
                showFormatter={SVs.showFormatter}
                showErrorsWarnings={SVs.errorsAndWarnings}
                immediateDoenetmlChangeCallback={
                    immediateDoenetmlChangeCallback
                }
                doenetmlChangeCallback={doenetmlChangeCallback}
            />
        </div>
    );
});
