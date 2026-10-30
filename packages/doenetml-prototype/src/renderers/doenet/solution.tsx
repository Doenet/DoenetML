import React from "react";
import type { Action } from "@doenet/doenetml-worker";
import { BasicComponentWithPassthroughChildren } from "../types";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { renderingOnServerSelector } from "../../state/redux-slices/global";
import { coreActions } from "../../state/redux-slices/core";

type SolutionData = {
    props: {
        /** Whether the student has revealed it; kept by the core. */
        open: boolean;
        canBeClosed: boolean;
        /** "Solution", or what the author named it. */
        sectionName: string;
        hide: boolean;
    };
};

/**
 * Solution: a disclosure the student reveals, which the core records
 * (`revealSolution`), and closes again when it may be.
 */
export const Solution: BasicComponentWithPassthroughChildren<SolutionData> = ({
    node,
    children,
    htmlId,
}) => {
    const onServer = useAppSelector(renderingOnServerSelector);
    const dispatch = useAppDispatch();
    const id = node.data.id;
    const { open, canBeClosed, sectionName, hide } = node.data.props;

    const onToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
        const nowOpen = e.currentTarget.open;
        if (nowOpen === open || (!nowOpen && !canBeClosed)) {
            return;
        }
        const action: Action = {
            component: "solution",
            componentIdx: id,
            actionName: nowOpen ? "revealSolution" : "closeSolution",
            args: {},
        };
        dispatch(coreActions.dispatchAction(action));
    };

    if (hide) {
        return null;
    }
    return (
        <details
            className="solution"
            id={htmlId}
            open={open}
            onToggle={onServer ? undefined : onToggle}
        >
            <summary>{sectionName}</summary>
            {open ? children : null}
        </details>
    );
};
