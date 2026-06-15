import React from "react";
import type { Action, TextInputPropsInText } from "@doenet/doenetml-worker";
import { BasicComponent } from "../types";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { renderingOnServerSelector } from "../../state/redux-slices/global";
import "./text-input.css";
import { coreActions } from "../../state/redux-slices/core";
import { _ServerSafeMath } from "./_server-safe-math";

/** Validation state for answer submissions */
export type ValidationState =
    | "unvalidated"
    | "correct"
    | "incorrect"
    | "partialcorrect";

type TextInputData = {
    props: {
        immediateValue: string;
        label: string;
        labelHasLatex: boolean;
        labelPosition: "left" | "right";
        /**
         * Whether to use a textarea instead of an input.
         */
        expanded: boolean;
        /**
         * Description used for Aria state.
         */
        shortDescription: string;
        validationState: ValidationState;
    };
};

export const TextInput: BasicComponent<TextInputData> = ({ node, htmlId }) => {
    console.log("Rendering TextInput with id", node.data.id, node);
    const onServer = useAppSelector(renderingOnServerSelector);
    const id = node.data.id;
    const value = node.data.props.immediateValue;
    const hasLabel = !!node.data.props.label;
    const shortDescription = node.data.props.shortDescription;

    const dispatch = useAppDispatch();

    const updateValue = React.useCallback(() => {
        let action: Action = {
            component: "textInput",
            actionName: "updateValue",
            componentIdx: id,
        };
        dispatch(coreActions.dispatchAction(action));
    }, [dispatch, value]);

    const displayLabel = processLabelWithMath(
        node.data.props.label,
        node.data.props.labelHasLatex,
    );

    const InputComponent: React.FC<
        React.InputHTMLAttributes<HTMLInputElement> &
            React.TextareaHTMLAttributes<HTMLTextAreaElement>
    > = React.useCallback(
        (props) => {
            if (node.data.props.expanded) {
                return <textarea {...props} />;
            } else {
                return <input type="text" {...props} />;
            }
        },
        [node.data.props.expanded],
    );

    if (onServer) {
        return (
            <span className="text-input" id={htmlId}>
                {value}
            </span>
        );
    }

    // TODO: change style to gray out when disabled

    return (
        <span className="text-input input" id={htmlId}>
            <label className={`input-label-${node.data.props.labelPosition}`}>
                <span className="input-label">{displayLabel}</span>
                <InputComponent
                    value={value}
                    aria-label={hasLabel ? undefined : shortDescription}
                    aria-description={hasLabel ? shortDescription : undefined}
                    disabled={
                        false //disabled
                    }
                    onChange={(e) => {
                        const action: Action = {
                            component: "textInput",
                            componentIdx: id,
                            actionName: "updateImmediateValue",
                            args: { text: e.target.value },
                        };
                        dispatch(coreActions.dispatchAction(action));
                    }}
                    onBlur={updateValue}
                    onKeyUp={(e) => {
                        if (e.key === "Enter") {
                            updateValue();
                        }
                    }}
                />
            </label>
        </span>
    );
};

/**
 * Creates a React node out of a label string that (possibly) contains math.
 * If `labelHasLatex` is false, no math processing is attempted.
 */
export function processLabelWithMath(
    label: string | undefined,
    labelHasLatex: boolean,
): React.ReactNode {
    label = label?.trim() || "";
    if (!label) {
        return null;
    }
    if (!labelHasLatex) {
        return label;
    }
    // If a label contains math, it is delimted by `\(` and `\)`.
    // We split the label on those delimiters, and wrap the math parts in a math component.
    const labelParts = label.split(/\\\(|\\\)/);
    return labelParts.map((part, index) => {
        if (index % 2 === 0) {
            return part;
        } else {
            return <_ServerSafeMath key={index}>{part}</_ServerSafeMath>;
        }
    });
}
