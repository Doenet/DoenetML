import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import type { LiPropsInText } from "@doenet/doenetml-worker";
import "./li.css";
import { generateHtmlId } from "../utils";

export const Li: BasicComponentWithPassthroughChildren<{
    props: LiPropsInText;
}> = ({ children, node, annotation, ancestors }) => {
    const htmlId = generateHtmlId(node, annotation, ancestors);
    const label = node.data.props.label;
    return (
        <li id={htmlId}>
            <span className="list-label">{label}</span>
            {children}
        </li>
    );
};
