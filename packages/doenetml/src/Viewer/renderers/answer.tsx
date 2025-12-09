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
import { MathJax } from "better-react-mathjax";

export default React.memo(function Answer(props: UseDoenetRendererProps) {
    let {
        componentIdx,
        id,
        SVs,
        docId,
        activityId,
        actions,
        children,
        flags,
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

    let label = SVs.label;
    if (SVs.labelHasLatex) {
        label = (
            <MathJax hideUntilTypeset={"first"} inline dynamic>
                {label}
            </MathJax>
        );
    }

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
                flags={flags}
            />
        );
    }

    const validationState = calculateValidationState(SVs);
    let checkWorkComponent = createCheckWorkComponent(
        SVs,
        id,
        validationState,
        submitAnswer,
        true,
    );

    if (label) {
        // if label was not moved via sugar to an input child,
        // then add the label to the check work component
        checkWorkComponent = (
            <label
                style={{
                    display: "inline-flex",
                    maxWidth: "100%",
                }}
            >
                <span style={{ marginRight: "4px" }}>{label}</span>
                {checkWorkComponent}
            </label>
        );
    }

    return (
        <span id={id} style={{ marginBottom: "4px" }}>
            {inputChildrenToRender}
            {checkWorkComponent}
            {answerResponseButton}
        </span>
    );
});
