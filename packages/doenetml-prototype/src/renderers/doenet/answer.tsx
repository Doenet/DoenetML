import React from "react";
import type { Action } from "@doenet/doenetml-worker";
import { BasicComponentWithPassthroughChildren } from "../types";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { renderingOnServerSelector } from "../../state/redux-slices/global";
import { coreActions } from "../../state/redux-slices/core";

type AnswerData = {
    props: { creditAchieved: number; numSubmissions: number };
};

/** `<answer>`: its inputs, a Submit button, and the credit the last
 * submission earned. */
export const Answer: BasicComponentWithPassthroughChildren<AnswerData> = ({
    node,
    children,
    htmlId,
}) => {
    const onServer = useAppSelector(renderingOnServerSelector);
    const dispatch = useAppDispatch();
    const { creditAchieved, numSubmissions } = node.data.props;
    const credit = Number.isNaN(creditAchieved) ? 0 : creditAchieved;
    return (
        <span className="answer-input" id={htmlId}>
            {children}
            {onServer ? null : (
                <button
                    type="button"
                    className="answer-submit"
                    onClick={() => {
                        const action = {
                            component: "answer",
                            actionName: "submitAnswer",
                            componentIdx: node.data.id,
                            args: {},
                        } as unknown as Action;
                        dispatch(coreActions.dispatchAction(action));
                    }}
                >
                    Submit
                </button>
            )}
            {numSubmissions > 0 ? (
                <span
                    className={
                        credit >= 1
                            ? "answer-correct"
                            : credit > 0
                              ? "answer-partial"
                              : "answer-incorrect"
                    }
                >
                    {" "}
                    {Math.round(credit * 100)}%
                </span>
            ) : null}
        </span>
    );
};
