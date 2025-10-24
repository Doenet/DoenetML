import React, { useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { addCommasForCompositeRanges } from "./utils/composites";
import { useRecordVisibilityChanges } from "../../utils/visibility";
import {
    calculateValidationState,
    createCheckWorkComponent,
} from "./utils/checkWork";

export default React.memo(function Container(props: UseDoenetRendererProps) {
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

        if (checkWorkComponent) {
            checkWorkComponent = <div>{checkWorkComponent}</div>;
        }
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
        <div id={id} ref={ref}>
            {children}
            {checkWorkComponent}
        </div>
    );
});
