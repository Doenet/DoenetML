import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";

export const Text: BasicComponentWithPassthroughChildren = ({ children }) => {
    return <span>{children}</span>;
};
