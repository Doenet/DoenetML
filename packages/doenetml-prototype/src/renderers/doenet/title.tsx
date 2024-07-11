import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";

export const Title: BasicComponentWithPassthroughChildren<{}> = ({
    children,
}) => {
    return <span className="referenced-title">{children}</span>;
};
