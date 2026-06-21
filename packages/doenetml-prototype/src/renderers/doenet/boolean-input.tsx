import React from "react";
import { BasicComponent } from "../types";
import { processLabelWithMath } from "./text-input";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { renderingOnServerSelector } from "../../state/redux-slices/global";
import { Action } from "@doenet/doenetml-worker";
import { coreActions } from "../../state/redux-slices/core";
import "./boolean-input.css";
import classNames from "classnames";

type BooleanInputData = {
    props: {
        asToggleButton: boolean;
        immediateValue: boolean;
        label: string;
        labelHasLatex: boolean;
        labelPosition: "left" | "right";
        disabled?: boolean;
        shortDescription?: string;
    };
};

/**
 * BooleanInput component renders a checkbox input for boolean values. 
 * 
 * Sample code
 * -----------
 * ```
   Some stuff <booleanInput><label>Hello there!</label></booleanInput> and more
  <booleanInput asToggleButton><label>Hello there!</label></booleanInput>
  <booleanInput labelPosition="left"><label>Hello there!</label></booleanInput>
  ```
 */
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

    const containerClasses = classNames("boolean-input", {
        "as-toggle-button": node.data.props.asToggleButton,
    });

    if (onServer) {
        return (
            <span className={containerClasses} id={htmlId}>
                {immediateValue ? "true" : "false"}
            </span>
        );
    }

    return (
        <span className={containerClasses} id={htmlId}>
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
