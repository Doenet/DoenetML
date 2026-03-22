import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { addCommasForCompositeRanges } from "./utils/composites";
import {
    calculateValidationState,
    createCheckWorkComponent,
} from "./utils/checkWork";
import { useSubmitActionWithDelay } from "./utils/useSubmitActionWithDelay";

export default React.memo(function ContainerInline(
    props: UseDoenetRendererProps,
) {
    let { id, SVs, children, actions, callAction } = useDoenetRenderer(props);

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
