import React, { useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { MathJax } from "better-react-mathjax";

import "./fractionInput.css";
import "./mathInput.css";
import {
    calculateValidationState,
    createCheckWorkComponent,
} from "./utils/checkWork";
import { addValidationStateToShortDescription } from "./utils/validationState";
import { DescriptionPopover } from "./utils/Description";
import { useSubmitActionWithDelay } from "./utils/useSubmitActionWithDelay";

interface FractionInputSVs {
    [key: string]: any;
    hidden: boolean;
    disabled: boolean;
    label: string;
    labelHasLatex: boolean;
    labelPosition?: string;
    forceFullCheckWorkButton: boolean;
    justSubmitted: boolean;
    colorCorrectness: boolean;
    shortDescription?: string;
    descriptionChildInd?: number;
    externalLabelRendererIds?: string[];
}

export default React.memo(function FractionInput(
    props: UseDoenetRendererProps,
) {
    let { id, SVs, actions, children, callAction } =
        useDoenetRenderer<FractionInputSVs>(props);

    // need to use a ref for validation state as handlePressEnter
    // does not update to current values
    let validationState = useRef<
        "unvalidated" | "correct" | "incorrect" | "partialcorrect"
    >("unvalidated");

    if (SVs.hidden) {
        return null;
    }

    validationState.current = calculateValidationState(SVs);

    const { isPending, submitActionWithPending } = useSubmitActionWithDelay({
        actionKey: "submitAnswer",
        actions,
        callAction,
        validationState: validationState.current,
        justSubmitted: SVs.justSubmitted,
    });

    const checkWorkComponent = createCheckWorkComponent(
        SVs,
        id,
        validationState.current,
        submitActionWithPending,
        SVs.forceFullCheckWorkButton,
        isPending,
    );

    let label: React.ReactNode = SVs.label;
    const hasLabel =
        typeof SVs.label === "string" ? SVs.label.trim() !== "" : !!SVs.label;
    const labelId = `${id}-label`;
    if (SVs.labelHasLatex) {
        label = (
            <MathJax hideUntilTypeset={"first"} inline dynamic>
                {label}
            </MathJax>
        );
    }

    let shortDescription = SVs.shortDescription || undefined;
    const externalLabelRendererIds = SVs.externalLabelRendererIds ?? [];
    const groupLabelledByIds = [
        hasLabel ? labelId : null,
        ...externalLabelRendererIds,
    ]
        .filter(Boolean)
        .join(" ");

    if (SVs.colorCorrectness) {
        shortDescription = addValidationStateToShortDescription(
            validationState.current,
            shortDescription,
        );
    }

    const descriptionChild =
        SVs.descriptionChildInd !== undefined &&
        SVs.descriptionChildInd !== -1 &&
        children[SVs.descriptionChildInd];

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

    const labelComponent = hasLabel ? (
        <span
            id={labelId}
            style={{
                marginRight: SVs.labelPosition === "right" ? undefined : "5px",
                marginLeft: SVs.labelPosition === "right" ? "5px" : undefined,
            }}
        >
            {label}
        </span>
    ) : null;

    const fractionInputRow = (
        <span
            style={{
                display: "inline-flex",
                // Vertically center the check-work button next to the fraction
                // rather than pinning it to the top.
                alignItems: "center",
                verticalAlign: "middle",
            }}
        >
            <div className="fraction-input" id={id}>
                <table
                    aria-labelledby={groupLabelledByIds || undefined}
                    aria-label={
                        !groupLabelledByIds ? shortDescription : undefined
                    }
                    aria-description={
                        groupLabelledByIds ? shortDescription : undefined
                    }
                    aria-details={descriptionId}
                >
                    <tbody>
                        <tr>
                            <td className="fractionNumerator">{children[0]}</td>
                        </tr>
                        <tr>
                            <td className="fractionVinculum"></td>
                        </tr>
                        <tr>
                            <td className="fractionDenominator">
                                {children[1]}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style={{ marginRight: "4px" }}></div>
            {checkWorkComponent}
            {description}
        </span>
    );

    return (
        <React.Fragment>
            <div
                // `display: inline` so the label and fraction flow with the
                // surrounding paragraph text. See mathInput.tsx for the full
                // rationale.
                style={{
                    display: "inline",
                    margin: "0 4px",
                }}
                id={`${id}-container`}
            >
                {SVs.labelPosition === "right" ? (
                    <>
                        {fractionInputRow}
                        {labelComponent}
                    </>
                ) : (
                    <>
                        {labelComponent}
                        {fractionInputRow}
                    </>
                )}
            </div>
        </React.Fragment>
    );
});
