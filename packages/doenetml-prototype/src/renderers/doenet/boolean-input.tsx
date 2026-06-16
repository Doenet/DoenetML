import React from "react";
import { BasicComponent } from "../types";
import { processLabelWithMath } from "./text-input";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { renderingOnServerSelector } from "../../state/redux-slices/global";
import { Action } from "@doenet/doenetml-worker";
import { coreActions } from "../../state/redux-slices/core";
import "./boolean-input.css";

type BooleanInputData = {
    props: {
        immediateValue: boolean;
        label: string;
        labelHasLatex: boolean;
        labelPosition: "left" | "right";
        disabled?: boolean;
        shortDescription?: string;
    };
};

export const BooleanInput: BasicComponent<BooleanInputData> = ({
    node,
    htmlId,
}) => {
    const onServer = useAppSelector(renderingOnServerSelector);
    const id = node.data.id;
    const {
        immediateValue,
        label,
        labelHasLatex,
        labelPosition,
        disabled = false,
        shortDescription,
    } = node.data.props;

    const dispatch = useAppDispatch();

    const onChange = React.useCallback(() => {
        const action: Action = {
            component: "booleanInput",
            componentIdx: id,
            actionName: "updateBoolean",
            args: { boolean: !immediateValue },
        };
        dispatch(coreActions.dispatchAction(action));
    }, [dispatch, id, immediateValue]);

    const hasLabel = !!label?.trim();
    const displayLabel = processLabelWithMath(label, labelHasLatex);

    if (onServer) {
        return (
            <span className="boolean-input" id={htmlId}>
                {immediateValue ? "true" : "false"}
            </span>
        );
    }

    return (
        <span className="boolean-input" id={htmlId}>
            <label className={`input-label-${labelPosition}`}>
                <span className="input-label">{displayLabel}</span>
                <input
                    type="checkbox"
                    checked={immediateValue}
                    onChange={onChange}
                    disabled={disabled}
                    aria-label={!hasLabel ? shortDescription : undefined}
                    aria-description={hasLabel ? shortDescription : undefined}
                />
            </label>
        </span>
    );
};
