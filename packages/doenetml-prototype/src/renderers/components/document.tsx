import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";

export const Document: BasicComponentWithPassthroughChildren = ({
    children,
}) => {
    return <React.Fragment>{children}</React.Fragment>;
};
