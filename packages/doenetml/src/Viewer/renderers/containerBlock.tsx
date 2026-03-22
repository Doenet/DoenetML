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
import { useSubmitActionWithDelay } from "./utils/useSubmitActionWithDelay";

export default React.memo(function Container(props: UseDoenetRendererProps) {
    let { id, SVs, children, actions, callAction } = useDoenetRenderer(props);

    const ref = useRef(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    if (SVs.hidden) {
        return null;
    }

    let checkWorkComponent = null;
    const validationState = calculateValidationState(SVs);
    const { isPending, submitActionWithPending } = useSubmitActionWithDelay({
        actionKey: "submitAllAnswers",
        actions,
        callAction,
        validationState,
        justSubmitted: SVs.justSubmitted,
    });

    if (actions.submitAllAnswers) {
        checkWorkComponent = createCheckWorkComponent(
            SVs,
            id,
            validationState,
            submitActionWithPending,
            true,
            isPending,
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
