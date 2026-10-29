import React from "react";
import type { Action } from "@doenet/doenetml-worker";
import { BasicComponentWithPassthroughChildren } from "../types";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { renderingOnServerSelector } from "../../state/redux-slices/global";
import { coreActions } from "../../state/redux-slices/core";

type AnswerData = {
    props: {
        /** The credit the last submission earned, from 0 to 1. */
        creditAchieved: number;
        numSubmissions: number;
    };
};

/**
 * Answer renders its inputs, a Submit button, and the credit the last
 * submission earned.
 */
export const Answer: BasicComponentWithPassthroughChildren<AnswerData> = ({
    node,
    children,
    htmlId,
}) => {
    const onServer = useAppSelector(renderingOnServerSelector);
    const id = node.data.id;
    const { creditAchieved, numSubmissions } = node.data.props;
    const credit = Number.isNaN(creditAchieved) ? 0 : creditAchieved;

    const dispatch = useAppDispatch();

    const submitAnswer = React.useCallback(() => {
        const action: Action = {
            component: "answer",
            componentIdx: id,
            actionName: "submitAnswer",
            args: {},
        };
        dispatch(coreActions.dispatchAction(action));
    }, [dispatch, id]);

    if (onServer) {
        return (
            <span className="answer-input" id={htmlId}>
                {children}
            </span>
        );
    }

    return (
        <span className="answer-input" id={htmlId}>
            {children}
            <button
                type="button"
                className="answer-submit"
                onClick={submitAnswer}
            >
                Submit
            </button>
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
