import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import { AnswerLabelContext } from "./answer-label-context";
import { labelContent } from "./use-input-label";

type AnswerData = { props: { label?: string } };

export const Answer: BasicComponentWithPassthroughChildren<AnswerData> = ({
    node,
    children,
}) => {
    const label = node.data.props.label?.trim() ?? "";
    return (
        <React.Fragment>
            {/* The space after the label is the answer's to supply, whatever input
                follows: one that inherited the label draws nothing of its own, and one
                with a label of its own draws that after this space. */}
            {label ? [labelContent(label), " "] : null}
            <AnswerLabelContext.Provider value={label}>
                {children}
            </AnswerLabelContext.Provider>
        </React.Fragment>
    );
};
