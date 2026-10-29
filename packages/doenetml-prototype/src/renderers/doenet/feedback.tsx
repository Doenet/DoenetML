import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";

type FeedbackData = {
    props: {
        /** The heading, when the author gave one. */
        feedbackText: string | null;
        hide: boolean;
    };
};

/** Feedback: a boxed note shown when its condition holds. */
export const Feedback: BasicComponentWithPassthroughChildren<FeedbackData> = ({
    node,
    children,
    htmlId,
}) => {
    const { feedbackText, hide } = node.data.props;
    if (hide) {
        return null;
    }
    return (
        <aside className="feedback" id={htmlId}>
            {feedbackText ? <strong>{feedbackText}</strong> : null}
            {children}
        </aside>
    );
};
