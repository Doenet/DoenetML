import React from "react";
import type { Action } from "@doenet/doenetml-worker";
import { BasicComponent } from "../types";
import { useAppDispatch } from "../../state/hooks";
import { coreActions } from "../../state/redux-slices/core";
import { CommitField, InputLabelProps } from "./_labeled-input";

type NumberInputData = {
    props: {
        /** NaN when no number is entered. */
        value: number;
    } & InputLabelProps;
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
    const dispatch = useAppDispatch();
    const { value, ...labelProps } = node.data.props;
    if (value === undefined) {
        return null;
    }
    return (
        <CommitField
            className="text-input number-input"
            htmlId={htmlId}
            labelProps={labelProps}
            current={Number.isNaN(value) ? "" : String(value)}
            commit={(text) => {
                const n = text.trim() === "" ? null : Number(text);
                if (n !== null && Number.isNaN(n)) {
                    return;
                }
                const action: Action = {
                    component: "numberInput",
                    componentIdx: node.data.id,
                    actionName: "updateValue",
                    args: { value: n },
                };
                dispatch(coreActions.dispatchAction(action));
            }}
        />
    );
};
