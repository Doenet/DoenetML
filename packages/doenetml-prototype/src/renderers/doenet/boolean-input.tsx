import React from "react";
import classNames from "classnames";
import { Action } from "@doenet/doenetml-worker";
import { BasicComponent } from "../types";
import { useAppDispatch } from "../../state/hooks";
import { coreActions } from "../../state/redux-slices/core";
import { ariaProps, InputLabelProps, LabeledInput } from "./_labeled-input";
import "./boolean-input.css";

type BooleanInputData = {
    props: {
        asToggleButton: boolean;
        immediateValue: boolean;
        disabled?: boolean;
    } & InputLabelProps;
};

/**
 * BooleanInput component renders a checkbox input for boolean values. 
 * 
 * Sample code
 * -----------
 * ```
   Some stuff <booleanInput><label>Hello there!</label></booleanInput> and more
  <booleanInput asToggleButton><label>Hello there!</label></booleanInput>
  <booleanInput labelPosition="start"><label>Hello there!</label></booleanInput>
  ```
 */
export const BooleanInput: BasicComponent<BooleanInputData> = ({
    node,
    htmlId,
}) => {
    const dispatch = useAppDispatch();
    const {
        immediateValue,
        asToggleButton,
        disabled = false,
        ...labelProps
    } = node.data.props;

    return (
        <LabeledInput
            className={classNames("boolean-input", {
                "as-toggle-button": asToggleButton,
            })}
            htmlId={htmlId}
            labelProps={labelProps}
            server={immediateValue ? "true" : "false"}
        >
            <input
                type="checkbox"
                checked={immediateValue}
                disabled={disabled}
                {...ariaProps(labelProps)}
                onChange={() => {
                    const action: Action = {
                        component: "booleanInput",
                        componentIdx: node.data.id,
                        actionName: "updateBoolean",
                        args: { boolean: !immediateValue },
                    };
                    dispatch(coreActions.dispatchAction(action));
                }}
            />
        </LabeledInput>
    );
};
