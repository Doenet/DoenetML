import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { addCommasForCompositeRanges } from "./utils/composites";
import {
    calculateValidationState,
    createCheckWorkComponent,
} from "./utils/checkWork";

export default React.memo(function ContainerInline(
    props: UseDoenetRendererProps,
) {
    let { id, SVs, children, actions, callAction } = useDoenetRenderer(props);

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
        <span id={id}>
            {children}
            {checkWorkComponent}
        </span>
    );
});
