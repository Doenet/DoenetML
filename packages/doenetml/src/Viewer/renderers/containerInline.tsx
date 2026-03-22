import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { addCommasForCompositeRanges } from "./utils/composites";
import {
    calculateValidationState,
    createCheckWorkComponent,
} from "./utils/checkWork";
import { useDelayedSubmissionPending } from "./utils/useDelayedSubmissionPending";

export default React.memo(function ContainerInline(
    props: UseDoenetRendererProps,
) {
    let { id, SVs, children, actions, callAction } = useDoenetRenderer(props);

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
        <span id={id}>
            {children}
            {checkWorkComponent}
        </span>
    );
});
