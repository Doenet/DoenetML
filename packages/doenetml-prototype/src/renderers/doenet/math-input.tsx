import React from "react";
import type { Action } from "@doenet/doenetml-worker";
import { BasicComponent } from "../types";
import { useAppDispatch } from "../../state/hooks";
import { coreActions } from "../../state/redux-slices/core";
import { CommitField, InputLabelProps } from "./_commit-field";

type MathInputData = { props: { text: string } & InputLabelProps };

/** `<mathInput>`: an expression typed as text and sent on Enter or blur;
 * the core parses it, and the field then shows the expression it holds. */
export const MathInput: BasicComponent<MathInputData> = ({ node, htmlId }) => {
    const dispatch = useAppDispatch();
    const { text, ...labelProps } = node.data.props;
    return (
        <CommitField
            className="math-input"
            htmlId={htmlId}
            current={text ?? ""}
            labelProps={labelProps}
            commit={(typed) => {
                const action = {
                    component: "mathInput",
                    actionName: "updateValue",
                    componentIdx: node.data.id,
                    args: { text: typed },
                } as unknown as Action;
                dispatch(coreActions.dispatchAction(action));
            }}
        />
    );
};
