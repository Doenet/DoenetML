import React from "react";
import type { Action } from "@doenet/doenetml-worker";
import { BasicComponent } from "../types";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { renderingOnServerSelector } from "../../state/redux-slices/global";
import { coreActions } from "../../state/redux-slices/core";
import { processLabelWithMath } from "./text-input";
import "./text-input.css";

type MathInputData = {
    props: {
        /** The expression the core holds, as text. */
        text: string;
        label: string;
        labelHasLatex: boolean;
        labelPosition: "start" | "end";
        /**
         * Description used for Aria state.
         */
        shortDescription: string;
    };
};

/**
 * MathInput renders a text field for an expression. The text is sent when
 * the student commits it (on Enter or blur); the core parses it, and the
 * field then shows the expression the core holds.
 */
export const MathInput: BasicComponent<MathInputData> = ({ node, htmlId }) => {
    const onServer = useAppSelector(renderingOnServerSelector);
    const id = node.data.id;
    const { label, labelHasLatex, labelPosition, shortDescription } =
        node.data.props;
    const current = node.data.props.text ?? "";

    // What the student has typed and not yet committed
    const [text, setText] = React.useState(current);
    React.useEffect(() => setText(current), [current]);

    const dispatch = useAppDispatch();

    const updateValue = React.useCallback(() => {
        if (text === current) {
            return;
        }
        const action: Action = {
            component: "mathInput",
            componentIdx: id,
            actionName: "updateValue",
            args: { text },
        };
        dispatch(coreActions.dispatchAction(action));
    }, [dispatch, id, text, current]);

    if (node.data.props.text === undefined) {
        return null;
    }

    const hasLabel = !!label?.trim();
    const displayLabel = processLabelWithMath(label, labelHasLatex);

    if (onServer) {
        return (
            <span className="text-input math-input" id={htmlId}>
                {current}
            </span>
        );
    }

    return (
        <span className="text-input math-input input" id={htmlId}>
            <label className={`input-label-${labelPosition}`}>
                <span className="input-label">{displayLabel}</span>
                <input
                    type="text"
                    value={text}
                    aria-label={hasLabel ? undefined : shortDescription}
                    aria-description={hasLabel ? shortDescription : undefined}
                    onChange={(e) => setText(e.target.value)}
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
