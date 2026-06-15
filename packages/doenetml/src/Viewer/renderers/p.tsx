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
import { useSubmitActionWithDelay } from "./utils/useSubmitActionWithDelay";

interface PSVs {
    [key: string]: any;
    hidden: boolean;
    _compositeReplacementActiveRange?: any;
    justSubmitted: boolean;
    renderInlineForListItem: boolean;
}

export default React.memo(function P(props: UseDoenetRendererProps) {
    let { id, SVs, children, actions, callAction } =
        useDoenetRenderer<PSVs>(props);

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
        submissionCount: SVs.numSubmissions,
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
        <div
            id={id}
            ref={ref}
            className="para"
            // Keep paragraph spacing contract intact and only collapse the top
            // margin when this paragraph is first in a list-item container.
            style={SVs.renderInlineForListItem ? { marginTop: 0 } : undefined}
        >
            {children}
            {checkWorkComponent}
        </div>
    );
});
