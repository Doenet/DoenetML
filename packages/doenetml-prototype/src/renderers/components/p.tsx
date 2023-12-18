import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";

export const P: BasicComponentWithPassthroughChildren = ({ children }) => {
    return <div className="para">{children}</div>;
};
