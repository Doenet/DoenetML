import React from "react";
import type { Action } from "@doenet/doenetml-worker";
import { BasicComponent } from "../types";
import { useAppDispatch } from "../../state/hooks";
import { coreActions } from "../../state/redux-slices/core";
import { CommitField, InputLabelProps } from "./_labeled-input";

type MathInputData = {
    props: {
        /** The expression the core holds, as text. */
        text: string;
    } & InputLabelProps;
};

/**
 * MathInput renders a text field for an expression. The text is sent when
 * the student commits it (on Enter or blur); the core parses it, and the
 * field then shows the expression the core holds.
 */
export const MathInput: BasicComponent<MathInputData> = ({ node, htmlId }) => {
    const dispatch = useAppDispatch();
    const { text, ...labelProps } = node.data.props;
    if (text === undefined) {
        return null;
    }
    return (
        <CommitField
            className="text-input math-input"
            htmlId={htmlId}
            labelProps={labelProps}
            current={text}
            commit={(text) => {
                const action: Action = {
                    component: "mathInput",
                    componentIdx: node.data.id,
                    actionName: "updateValue",
                    args: { text },
                };
                dispatch(coreActions.dispatchAction(action));
            }}
        />
    );
};
