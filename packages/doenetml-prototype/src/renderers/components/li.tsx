import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import type { LiProps } from "@doenet/doenetml-worker-rust";
import "./li.css";
import { generateHtmlId } from "../utils";

export const Li: BasicComponentWithPassthroughChildren<{
    props: LiProps;
}> = ({ children, node, annotation }) => {
    const htmlId = generateHtmlId(node, annotation);
    const label = node.data.props.label;
    return (
        <li id={htmlId}>
            <span className="list-label">{label}</span>
            {children}
        </li>
    );
};
