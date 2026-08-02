import React, { useContext, useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
// import me from '@doenet/math';
import { ActionButton } from "@doenet/ui-components";
import { ActionButtonGroup } from "@doenet/ui-components";
import { MathJax } from "better-react-mathjax";

import "./matrixInput.css";
import "./mathInput.css";
import {
    calculateValidationState,
    createCheckWorkComponent,
} from "./utils/checkWork";
import { DescriptionPopover } from "./utils/Description";
import { useSubmitActionWithDelay } from "./utils/useSubmitActionWithDelay";
import { useContentT, useT } from "../../utils/i18n";

interface MatrixInputSVs {
    [key: string]: any;
    hidden: boolean;
    disabled: boolean;
    label: string;
    labelHasLatex: boolean;
    labelPosition?: string;
    showSizeControls: boolean;
    numRows: number;
    numColumns: number;
    forceFullCheckWorkButton: boolean;
    justSubmitted: boolean;
    shortDescription?: string;
    descriptionChildInd?: number;
    externalLabelRendererIds?: string[];
}

export default React.memo(function MatrixInput(props: UseDoenetRendererProps) {
    let { id, SVs, actions, children, callAction } =
        useDoenetRenderer<MatrixInputSVs>(props);

    const t = useT();

    // The check-work button follows the document's language, not the
    // reader's — see `useContentT`.
    const tContent = useContentT();

    // need to use a ref for validation state as handlePressEnter
    // does not update to current values
    let validationState = useRef<
        "unvalidated" | "correct" | "incorrect" | "partialcorrect"
    >("unvalidated");

    if (SVs.hidden) {
        return null;
    }

    validationState.current = calculateValidationState(SVs);

    const disabled = SVs.disabled;

    // const inputKey = id + '_input';

    let surroundingBorderColor = getComputedStyle(
        document.documentElement,
    ).getPropertyValue("--mainGray");
    // if (this.focused) {
    //   surroundingBorderColor = "#82a5ff";
    // }

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
        tContent,
    );

    let matrixInputs = [];

    for (let rowInd = 0; rowInd < SVs.numRows; rowInd++) {
        let mathinputRow = [];

        for (let colInd = 0; colInd < SVs.numColumns; colInd++) {
            mathinputRow.push(
                <td
                    key={colInd}
                    className="matrixCell"
                    id={id + "_component_" + rowInd + "_" + colInd}
                >
                    {children[rowInd * SVs.numColumns + colInd]}
                </td>,
            );
        }

        matrixInputs.push(<tr key={rowInd}>{mathinputRow}</tr>);
    }

    let rowNumControls = null;
    if (SVs.showSizeControls) {
        rowNumControls = (
            <span style={{ margin: "0px 4px 4px 0px" }}>
                <ActionButtonGroup>
                    <ActionButton
                        id={id + "_rowDecrement"}
                        value="r-"
                        onClick={() =>
                            callAction({
                                action: actions.updateNumRows,
                                args: { numRows: SVs.numRows - 1 },
                            })
                        }
                        disabled={SVs.numRows < 2 || disabled}
                        ariaLabel={t(
                            "matrix-remove-row",
                            undefined,
                            "Remove row",
                        )}
                    ></ActionButton>
                    <ActionButton
                        id={id + "_rowIncrement"}
                        value="r+"
                        onClick={() =>
                            callAction({
                                action: actions.updateNumRows,
                                args: { numRows: SVs.numRows + 1 },
                            })
                        }
                        disabled={disabled}
                        ariaLabel={t("matrix-add-row", undefined, "Add row")}
                    ></ActionButton>
                </ActionButtonGroup>
            </span>
        );
    }
    let colNumControls = null;
    if (SVs.showSizeControls) {
        colNumControls = (
            <span style={{ margin: "0px 4px 4px 0px" }}>
                <ActionButtonGroup>
                    <ActionButton
                        id={id + "_columnDecrement"}
                        value="c-"
                        onClick={() =>
                            callAction({
                                action: actions.updateNumColumns,
                                args: { numColumns: SVs.numColumns - 1 },
                            })
                        }
                        disabled={SVs.numColumns < 2 || disabled}
                        ariaLabel={t(
                            "matrix-remove-column",
                            undefined,
                            "Remove column",
                        )}
                    ></ActionButton>
                    <ActionButton
                        id={id + "_columnIncrement"}
                        value="c+"
                        onClick={() =>
                            callAction({
                                action: actions.updateNumColumns,
                                args: { numColumns: SVs.numColumns + 1 },
                            })
                        }
                        disabled={disabled}
                        ariaLabel={t(
                            "matrix-add-column",
                            undefined,
                            "Add column",
                        )}
                    ></ActionButton>
                </ActionButtonGroup>
            </span>
        );
    }

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

    const shortDescription = SVs.shortDescription || undefined;
    const externalLabelRendererIds = SVs.externalLabelRendererIds ?? [];
    const groupLabelledByIds = [
        hasLabel ? labelId : null,
        ...externalLabelRendererIds,
    ]
        .filter(Boolean)
        .join(" ");

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
                marginInlineEnd:
                    SVs.labelPosition === "right" ? undefined : "5px",
                marginInlineStart:
                    SVs.labelPosition === "right" ? "5px" : undefined,
            }}
        >
            {label}
        </span>
    ) : null;

    const matrixInputRow = (
        <span
            style={{
                display: "inline-flex",
                alignItems: "flex-start",
                // The input row flows as inline content (see the container
                // comment). `vertical-align: baseline` aligns it with the text
                // baseline of its line.
                verticalAlign: "baseline",
            }}
        >
            {/* A matrix is notation: its columns are numbered left to right in
                every language, and the brackets around it are drawn as
                absolutely-positioned pseudo-elements that assume which side
                they are on. A `<table>` reverses its columns under `rtl`, so
                without this the whole matrix would come out mirrored. */}
            <div className="matrix-input" id={id} dir="ltr">
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
                    <tbody>{matrixInputs}</tbody>
                </table>
            </div>
            <div style={{ marginInlineEnd: "4px" }}></div>
            {rowNumControls}
            {colNumControls}
            {checkWorkComponent}
            {description}
        </span>
    );

    return (
        <React.Fragment>
            <div
                // `display: inline` so the label and matrix flow with the
                // surrounding paragraph text and a wrapping label keeps the
                // matrix after its end rather than beside its first line
                // (#1245). See mathInput.tsx for the full rationale.
                style={{
                    display: "inline",
                    // Only the horizontal gutters take effect; the container is
                    // inline, which ignores vertical margins.
                    margin: "0 4px",
                }}
                id={`${id}-container`}
            >
                {SVs.labelPosition === "right" ? (
                    <>
                        {matrixInputRow}
                        {labelComponent}
                    </>
                ) : (
                    <>
                        {labelComponent}
                        {matrixInputRow}
                    </>
                )}
            </div>
        </React.Fragment>
    );
});
