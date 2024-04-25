import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import type { LiProps } from "@doenet/doenetml-worker-rust";
import "./li.css";

export const Li: BasicComponentWithPassthroughChildren<{
    props: LiProps;
}> = ({ children, node }) => {
    const label = node.data.props.label;
    return (
        <li>
            <span className="list-label">{label}</span>
            {children}
        </li>
    );
};
