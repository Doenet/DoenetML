import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";

export const Document: BasicComponentWithPassthroughChildren = ({
    children,
}) => {
    return <article className="doenet-document">{children}</article>;
};
