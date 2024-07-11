import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";

export const Title: BasicComponentWithPassthroughChildren<{}> = ({
    children,
}) => {
    return <title>{children}</title>;
};
