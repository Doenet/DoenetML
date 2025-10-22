import React, { useContext } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { DocContext } from "../DocViewer";
import { AnswerResponseButton } from "./utils/AnswerResponseButton";
import {
    calculateValidationState,
    createCheckWorkComponent,
} from "./utils/checkWork";

export default React.memo(function Answer(props: UseDoenetRendererProps) {
    let {
        componentIdx,
        id,
        SVs,
        docId,
        activityId,
        actions,
        children,
        callAction,
    } = useDoenetRenderer(props);

    const { showAnswerResponseButton, answerResponseCounts } =
        useContext(DocContext) || {};

    if (SVs.hidden) {
        return null;
    }

    const submitAnswer = () =>
        callAction({
            action: actions.submitAnswer,
        });

    // BADBADBAD: need to redo how getting the input child
    // without using the internal guts of componentInstructions
    // is just asking for trouble

    let inputChildrenToRender = null;
    if (SVs.inputChildren.length > 0) {
        let inputChildNames = SVs.inputChildren.map((x: any) => x.componentIdx);
        inputChildrenToRender = children.filter(
            //child might be null or a string
            (child) =>
                child &&
                typeof child !== "string" &&
                inputChildNames.includes(
                    // @ts-ignore
                    child.props.componentInstructions.componentIdx,
                ),
        );
    }

    let answerResponseButton = null;
    if (showAnswerResponseButton) {
        answerResponseButton = (
            <AnswerResponseButton
                answerId={id}
                answerComponentIdx={componentIdx}
                docId={docId}
                activityId={activityId}
                numResponses={answerResponseCounts?.[id]}
            />
        );
    }

    const validationState = calculateValidationState(SVs);
    const checkWorkComponent = createCheckWorkComponent(
        SVs,
        id,
        validationState,
        submitAnswer,
        true,
    );

    return (
        <span id={id} style={{ marginBottom: "4px" }}>
            {inputChildrenToRender}
            {checkWorkComponent}
            {answerResponseButton}
        </span>
    );
});
