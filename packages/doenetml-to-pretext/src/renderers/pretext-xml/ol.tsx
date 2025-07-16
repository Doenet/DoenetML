import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import type { OlPropsInText } from "@doenet/doenetml-worker";

export const Ol: BasicComponentWithPassthroughChildren<{
    props: OlPropsInText;
}> = ({ children, node }) => {
    return <ol>{children}</ol>;
};
