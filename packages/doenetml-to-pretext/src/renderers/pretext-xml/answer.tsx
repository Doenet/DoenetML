import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";

type AnswerData = { props: { label?: string } };

export const Answer: BasicComponentWithPassthroughChildren<AnswerData> = ({
    node,
    children,
}) => {
    const label = node.data.props.label || null;
    return (
        <React.Fragment>
            {label}
            {children}
        </React.Fragment>
    );
};
