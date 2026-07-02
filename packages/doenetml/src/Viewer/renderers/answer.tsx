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
import { useSubmitActionWithDelay } from "./utils/useSubmitActionWithDelay";
import { MathJax } from "better-react-mathjax";
import { DescriptionPopover } from "./utils/Description";

interface AnswerSVs {
    [key: string]: any;
    hidden: boolean;
    inline: boolean;
    label: string;
    labelHasLatex: boolean;
    justSubmitted: boolean;
    forceFullCheckWorkButton: boolean;
    forceSmallCheckWorkButton: boolean;
    haveBlockInputChild: boolean;
    inputChildIndices: any;
    descriptionChildInd: any;
}

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
    } = useDoenetRenderer<AnswerSVs>(props);

    const { showAnswerResponseButton, answerResponseCounts } =
        useContext(DocContext) || {};

    if (SVs.hidden) {
        return null;
    }

    const validationState = calculateValidationState(SVs);

    const { isPending, submitActionWithPending } = useSubmitActionWithDelay({
        actionKey: "submitAnswer",
        actions,
        callAction,
        validationState,
        justSubmitted: SVs.justSubmitted,
    });

    let label: React.ReactNode = SVs.label;
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

    let checkWorkComponent = createCheckWorkComponent(
        SVs,
        id,
        validationState,
        submitActionWithPending,
        SVs.forceFullCheckWorkButton || !SVs.forceSmallCheckWorkButton,
        isPending,
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
                    // Here the label is the answer's own (it was not moved onto
                    // an input child), so it sits beside the check-work button
                    // rather than an input box. `display: inline` keeps the
                    // label and button flowing with the surrounding paragraph,
                    // and keeps the button from being stranded beside a wrapped
                    // label's first line — the same treatment the inputs apply
                    // for #1245.
                    style={{
                        display: "inline",
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
                // `marginBottom` and `alignItems` only take effect in the
                // `flex` (block-input) branch below; an inline box ignores
                // vertical margins and `align-items`.
                marginBottom: "4px",
                // Inline (not inline-flex) in the inline case so the answer's
                // input(s) and check-work button flow with the surrounding
                // paragraph — text before and after the answer wraps together
                // with the label and input (#1245). Block-input answers keep
                // flex for their stacked layout.
                display:
                    SVs.inline || !SVs.haveBlockInputChild ? "inline" : "flex",
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
