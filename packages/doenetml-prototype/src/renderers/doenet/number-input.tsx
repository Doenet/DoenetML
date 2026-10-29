import React from "react";
import type { Action } from "@doenet/doenetml-worker";
import { BasicComponent } from "../types";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { renderingOnServerSelector } from "../../state/redux-slices/global";
import { coreActions } from "../../state/redux-slices/core";
import { processLabelWithMath } from "./text-input";
import "./text-input.css";

type NumberInputData = {
    props: {
        /** NaN when no number is entered. */
        value: number;
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
 * NumberInput renders a text field for a number. The number is sent when
 * the student commits it (on Enter or blur), not on every keystroke; empty
 * text is no number.
 */
export const NumberInput: BasicComponent<NumberInputData> = ({
    node,
    htmlId,
}) => {
    const onServer = useAppSelector(renderingOnServerSelector);
    const id = node.data.id;
    const { value, label, labelHasLatex, labelPosition, shortDescription } =
        node.data.props;
    const current =
        value === undefined || Number.isNaN(value) ? "" : String(value);

    // What the student has typed and not yet committed
    const [text, setText] = React.useState(current);
    React.useEffect(() => setText(current), [current]);

    const dispatch = useAppDispatch();

    const updateValue = React.useCallback(() => {
        if (text === current) {
            return;
        }
        const n = text.trim() === "" ? null : Number(text);
        if (n !== null && Number.isNaN(n)) {
            return;
        }
        const action: Action = {
            component: "numberInput",
            componentIdx: id,
            actionName: "updateValue",
            args: { value: n },
        };
        dispatch(coreActions.dispatchAction(action));
    }, [dispatch, id, text, current]);

    if (value === undefined) {
        return null;
    }

    const hasLabel = !!label?.trim();
    const displayLabel = processLabelWithMath(label, labelHasLatex);

    if (onServer) {
        return (
            <span className="text-input number-input" id={htmlId}>
                {current}
            </span>
        );
    }

    return (
        <span className="text-input number-input input" id={htmlId}>
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
