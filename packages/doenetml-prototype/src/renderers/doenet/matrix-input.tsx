import React from "react";
import type { Action } from "@doenet/doenetml-worker";
import { BasicComponentWithPassthroughChildren } from "../types";
import { useAppDispatch } from "../../state/hooks";
import { coreActions } from "../../state/redux-slices/core";
import { InputLabelProps, processLabelWithMath } from "./_labeled-input";
import "./matrix-input.css";

type MatrixInputData = {
    props: InputLabelProps & {
        numRows: number;
        numColumns: number;
        /** Whether the student may add and remove rows and columns. */
        showSizeControls: boolean;
    };
};

/**
 * MatrixInput: its rows of boxes, each box a math input of its own, as a
 * grid in brackets beside its label; with `showSizeControls`, buttons that
 * add and remove a row or a column (`updateNumRows`, `updateNumColumns`).
 */
export const MatrixInput: BasicComponentWithPassthroughChildren<
    MatrixInputData
> = ({ node, children, htmlId }) => {
    const dispatch = useAppDispatch();
    const {
        label,
        labelHasLatex,
        labelPosition,
        shortDescription,
        numRows,
        numColumns,
        showSizeControls,
    } = node.data.props;
    const labelId = htmlId ? `${htmlId}-label` : undefined;
    const hasLabel = !!label?.trim();
    const labelElement = hasLabel ? (
        <span className="input-label" id={labelId}>
            {processLabelWithMath(label, labelHasLatex)}
        </span>
    ) : null;

    const resize = (
        actionName: "updateNumRows" | "updateNumColumns",
        args: Record<string, number>,
    ) => {
        const action: Action = {
            component: "matrixInput",
            componentIdx: node.data.id,
            actionName,
            args,
        };
        dispatch(coreActions.dispatchAction(action));
    };
    const sizeControl = (
        name: string,
        n: number,
        actionName: "updateNumRows" | "updateNumColumns",
        arg: string,
    ) => (
        <span className="matrix-size-control">
            <button
                type="button"
                className="matrix-size-button"
                aria-label={`Remove a ${name}`}
                disabled={!(n > 1)}
                onClick={() => resize(actionName, { [arg]: n - 1 })}
            >
                −
            </button>
            <span>
                {Number.isFinite(n) ? n : ""} {name}s
            </span>
            <button
                type="button"
                className="matrix-size-button"
                aria-label={`Add a ${name}`}
                onClick={() => resize(actionName, { [arg]: n + 1 })}
            >
                +
            </button>
        </span>
    );

    const grid = (
        <span
            className="matrix-input-grid"
            role="group"
            aria-labelledby={hasLabel ? labelId : undefined}
            aria-label={hasLabel ? undefined : shortDescription}
            aria-description={hasLabel ? shortDescription : undefined}
        >
            {children}
        </span>
    );
    return (
        <span className="matrix-input" id={htmlId}>
            {labelPosition === "end" ? null : labelElement}
            {grid}
            {labelPosition === "end" ? labelElement : null}
            {showSizeControls ? (
                <span className="matrix-size-controls">
                    {sizeControl("row", numRows, "updateNumRows", "numRows")}
                    {sizeControl(
                        "column",
                        numColumns,
                        "updateNumColumns",
                        "numColumns",
                    )}
                </span>
            ) : null}
        </span>
    );
};
