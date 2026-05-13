import React from "react";
import {
    BasicComponentWithPassthroughChildren,
} from "../types";

type AnswerData = { props: unknown };

export const Answer: BasicComponentWithPassthroughChildren<AnswerData> = ({
    children,
}) => {
    return children;
};
