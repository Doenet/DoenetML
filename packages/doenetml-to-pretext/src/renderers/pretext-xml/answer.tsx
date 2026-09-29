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
            {labelContent(label)}
            <AnswerLabelContext.Provider value={label}>
                {children}
            </AnswerLabelContext.Provider>
        </React.Fragment>
    );
};
