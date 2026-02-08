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
import { DescriptionPopover } from "./utils/Description";

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

    const inputChildrenToRender = SVs.inputChildIndices.map(
        (ind: number) => children[ind],
    );

    const descriptionChild =
        SVs.descriptionChildInd !== -1 && children[SVs.descriptionChildInd];

    let descriptionId: string | undefined = undefined;
    let description: React.ReactNode | null = null;

    if (descriptionChild) {
        descriptionId = `${id}-description-content`;
        description = (
            <DescriptionPopover>
                <div id={descriptionId}>{descriptionChild}</div>
            </DescriptionPopover>
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
        SVs.forceFullCheckworkButton || !SVs.forceSmallCheckworkButton,
    );

    if (checkWorkComponent) {
        if (description) {
            // associate description with check work component
            checkWorkComponent = (
                <span
                    aria-details={descriptionId}
                    data-test="Details Associated"
                >
                    {checkWorkComponent}
                </span>
            );
        }

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
    }

    return (
        <span
            id={id}
            style={{
                marginBottom: "4px",
                display:
                    SVs.inline || !SVs.haveBlockInputChild
                        ? "inline-flex"
                        : "flex",
                alignItems: "start",
            }}
        >
            {inputChildrenToRender}
            {checkWorkComponent}
            {answerResponseButton}
            {description}
        </span>
    );
});
