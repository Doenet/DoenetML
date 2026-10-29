import React from "react";
import type { Action } from "@doenet/doenetml-worker";
import { BasicComponentWithPassthroughChildren } from "../types";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { renderingOnServerSelector } from "../../state/redux-slices/global";
import { coreActions } from "../../state/redux-slices/core";

type HintData = {
    props: {
        /** Whether the student has opened the hint; kept by the core. */
        open: boolean;
    };
};

/**
 * Hint renders a disclosure that shows its children when opened.
 *
 * Sample code
 * -----------
 * ```
   <hint><p>Try factoring first.</p></hint>
  ```
 */
export const Hint: BasicComponentWithPassthroughChildren<HintData> = ({
    node,
    children,
    htmlId,
}) => {
    const onServer = useAppSelector(renderingOnServerSelector);
    const id = node.data.id;
    const open = node.data.props.open;

    const dispatch = useAppDispatch();

    const onToggle = React.useCallback(
        (e: React.SyntheticEvent<HTMLDetailsElement>) => {
            const nowOpen = e.currentTarget.open;
            if (nowOpen === open) {
                return;
            }
            const action: Action = {
                component: "hint",
                componentIdx: id,
                actionName: "toggle",
                args: { open: nowOpen },
            };
            dispatch(coreActions.dispatchAction(action));
        },
        [dispatch, id, open],
    );

    return (
        <details
            className="hint"
            id={htmlId}
            open={open}
            onToggle={onServer ? undefined : onToggle}
        >
            <summary>Hint</summary>
            {open ? children : null}
        </details>
    );
};
