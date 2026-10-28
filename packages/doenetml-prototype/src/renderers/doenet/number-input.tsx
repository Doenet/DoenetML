import React from "react";
import type { Action } from "@doenet/doenetml-worker";
import { BasicComponent } from "../types";
import { useAppDispatch } from "../../state/hooks";
import { coreActions } from "../../state/redux-slices/core";
import { CommitField, InputLabelProps } from "./_commit-field";

type NumberInputData = { props: { value: number } & InputLabelProps };

/** `<numberInput>`: a number typed and sent on Enter or blur. Empty text is
 * no number. */
export const NumberInput: BasicComponent<NumberInputData> = ({
    node,
    htmlId,
}) => {
    const dispatch = useAppDispatch();
    const { value, ...labelProps } = node.data.props;
    return (
        <CommitField
            className="number-input"
            htmlId={htmlId}
            current={Number.isNaN(value) ? "" : String(value)}
            labelProps={labelProps}
            commit={(text) => {
                const n = text.trim() === "" ? null : Number(text);
                if (n !== null && Number.isNaN(n)) return;
                const action = {
                    component: "numberInput",
                    actionName: "updateValue",
                    componentIdx: node.data.id,
                    args: { value: n },
                } as unknown as Action;
                dispatch(coreActions.dispatchAction(action));
            }}
        />
    );
};
