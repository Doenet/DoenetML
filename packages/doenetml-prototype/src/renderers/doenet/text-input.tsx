import React from "react";
import type { Action } from "@doenet/doenetml-worker";
import { BasicComponent } from "../types";
import { useAppDispatch } from "../../state/hooks";
import { coreActions } from "../../state/redux-slices/core";
import { ariaProps, InputLabelProps, LabeledInput } from "./_labeled-input";

/** Validation state for answer submissions */
export type ValidationState =
    "unvalidated" | "correct" | "incorrect" | "partialcorrect";

type TextInputData = {
    props: {
        immediateValue: string;
        /**
         * Whether to use a textarea instead of an input.
         */
        expanded: boolean;
        validationState: ValidationState;
    } & InputLabelProps;
};

/** A text field. Every keystroke is sent; Enter and blur commit it. */
export const TextInput: BasicComponent<TextInputData> = ({ node, htmlId }) => {
    const dispatch = useAppDispatch();
    const id = node.data.id;
    const { immediateValue: value, expanded, ...labelProps } = node.data.props;

    const updateValue = () => {
        const action: Action = {
            component: "textInput",
            actionName: "updateValue",
            componentIdx: id,
        };
        dispatch(coreActions.dispatchAction(action));
    };

    // TODO: change style to gray out when disabled
    const control = {
        value,
        ...ariaProps(labelProps),
        onChange: (
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => {
            const action: Action = {
                component: "textInput",
                componentIdx: id,
                actionName: "updateImmediateValue",
                args: { text: e.target.value },
            };
            dispatch(coreActions.dispatchAction(action));
        },
        onBlur: updateValue,
        onKeyUp: (e: React.KeyboardEvent) => {
            if (e.key === "Enter") {
                updateValue();
            }
        },
    };

    return (
        <LabeledInput
            className="text-input"
            htmlId={htmlId}
            labelProps={labelProps}
            server={value}
        >
            {expanded ? (
                <textarea {...control} />
            ) : (
                <input type="text" {...control} />
            )}
        </LabeledInput>
    );
};
