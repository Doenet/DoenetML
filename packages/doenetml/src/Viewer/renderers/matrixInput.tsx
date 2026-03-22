// @ts-nocheck
import React, { useContext, useRef } from "react";
import useDoenetRenderer from "../useDoenetRenderer";
// import me from 'math-expressions';
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

export default React.memo(function MatrixInput(props) {
    let { id, SVs, actions, children, callAction } = useDoenetRenderer(props);

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
                        ariaLabel="Remove row"
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
                        ariaLabel="Add row"
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
                        ariaLabel="Remove column"
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
                        ariaLabel="Add column"
                    ></ActionButton>
                </ActionButtonGroup>
            </span>
        );
    }

    let label = SVs.label;
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

    const matrixInputRow = (
        <span style={{ display: "inline-flex", alignItems: "flex-start" }}>
            <div className="matrix-input" id={id}>
                <table
                    aria-labelledby={hasLabel ? labelId : undefined}
                    aria-label={!hasLabel ? shortDescription : undefined}
                    aria-description={hasLabel ? shortDescription : undefined}
                    aria-details={descriptionId}
                >
                    <tbody>{matrixInputs}</tbody>
                </table>
            </div>
            <div style={{ marginRight: "4px" }}></div>
            {rowNumControls}
            {colNumControls}
            {checkWorkComponent}
            {description}
        </span>
    );

    return (
        <React.Fragment>
            <div
                style={{
                    display: "inline-flex",
                    maxWidth: "100%",
                    margin: "0px 4px 4px 4px",
                    alignItems: "baseline",
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
