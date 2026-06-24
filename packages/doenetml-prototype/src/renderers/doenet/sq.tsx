import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";

type SqData = { props: unknown };

export const Sq: BasicComponentWithPassthroughChildren<SqData> = ({
    node,
    children,
    htmlId,
}) => {
    return <React.Fragment>&lsquo;{children}&rsquo;</React.Fragment>;
};
