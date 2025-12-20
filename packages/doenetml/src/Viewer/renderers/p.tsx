import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { useRef } from "react";
import { addCommasForCompositeRanges } from "./utils/composites";
import { useRecordVisibilityChanges } from "../../utils/visibility";
import {
    calculateValidationState,
    createCheckWorkComponent,
} from "./utils/checkWork";

export default React.memo(function P(props: UseDoenetRendererProps) {
    let { id, SVs, children, actions, callAction } = useDoenetRenderer(props);

    const ref = useRef(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    if (SVs.hidden) {
        return null;
    }

    let checkWorkComponent = null;

    if (actions.submitAllAnswers) {
        const submitAllAnswers = () =>
            callAction({
                action: actions.submitAllAnswers,
            });

        const validationState = calculateValidationState(SVs);
        checkWorkComponent = createCheckWorkComponent(
            SVs,
            id,
            validationState,
            submitAllAnswers,
            true,
        );
    }

    if (SVs._compositeReplacementActiveRange) {
        children = addCommasForCompositeRanges({
            children,
            compositeReplacementActiveRange:
                SVs._compositeReplacementActiveRange,
            startInd: 0,
            endInd: children.length - 1,
        });
    }

    return (
        <div id={id} ref={ref} className="doenetml-p">
            {children}
            {checkWorkComponent}
        </div>
    );
});
