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
import { useDelayedSubmissionPending } from "./utils/useDelayedSubmissionPending";

export default React.memo(function P(props: UseDoenetRendererProps) {
    let { id, SVs, children, actions, callAction } = useDoenetRenderer(props);

    const ref = useRef(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    if (SVs.hidden) {
        return null;
    }

    let checkWorkComponent = null;
    const validationState = calculateValidationState(SVs);
    const submitAllAnswers = React.useCallback(() => {
        if (!actions.submitAllAnswers) {
            return;
        }

        callAction({
            action: actions.submitAllAnswers,
        });
    }, [actions.submitAllAnswers, callAction]);
    const { isPending, submitActionWithPending: submitAllAnswersWithPending } =
        useDelayedSubmissionPending({
            submitAction: submitAllAnswers,
            validationState,
            justSubmitted: SVs.justSubmitted,
        });

    if (actions.submitAllAnswers) {
        checkWorkComponent = createCheckWorkComponent(
            SVs,
            id,
            validationState,
            submitAllAnswersWithPending,
            true,
            isPending,
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
        <div id={id} ref={ref} className="para">
            {children}
            {checkWorkComponent}
        </div>
    );
});
