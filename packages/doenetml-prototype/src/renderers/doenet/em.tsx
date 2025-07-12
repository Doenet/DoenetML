import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";

export const Em: BasicComponentWithPassthroughChildren = ({ children }) => {
    return <em>{children}</em>;
};
