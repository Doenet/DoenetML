import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import type { LiPropsInText } from "@doenet/doenetml-worker";
import { generateHtmlId } from "../utils";

export const Li: BasicComponentWithPassthroughChildren<{
    props: LiPropsInText;
}> = ({ children, node, annotation, ancestors }) => {
    const htmlId = generateHtmlId(node, annotation, ancestors);
    const label = node.data.props.label;
    console.log("li rendering", node, ancestors);
    return <li {...{ "xml:id": htmlId }}>{children}</li>;
};
