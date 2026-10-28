import React from "react";
import type { Action } from "@doenet/doenetml-worker";
import { BasicComponentWithPassthroughChildren } from "../types";
import { useAppDispatch } from "../../state/hooks";
import { coreActions } from "../../state/redux-slices/core";

type HintData = { props: { open: boolean } };

/** `<hint>`: a disclosure whose open state is the student's, kept by the
 * core. */
export const Hint: BasicComponentWithPassthroughChildren<HintData> = ({
    node,
    children,
    htmlId,
}) => {
    const dispatch = useAppDispatch();
    const open = node.data.props.open;
    return (
        <details
            className="hint"
            id={htmlId}
            open={open}
            onToggle={(e) => {
                const now = (e.currentTarget as HTMLDetailsElement).open;
                if (now === open) return;
                const action = {
                    component: "hint",
                    actionName: "toggle",
                    componentIdx: node.data.id,
                    args: { open: now },
                } as unknown as Action;
                dispatch(coreActions.dispatchAction(action));
            }}
        >
            <summary>Hint</summary>
            {open ? children : null}
        </details>
    );
};
