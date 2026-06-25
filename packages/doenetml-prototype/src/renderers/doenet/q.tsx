import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";

type QData = { props: unknown };

export const Q: BasicComponentWithPassthroughChildren<QData> = ({
    node,
    children,
    htmlId,
}) => {
    return <React.Fragment>&ldquo;{children}&rdquo;</React.Fragment>;
};
