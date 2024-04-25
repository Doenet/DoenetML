import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import { Element } from "../element";
import type { XrefProps } from "@doenet/doenetml-worker-rust";

export const Xref: BasicComponentWithPassthroughChildren<{
    props: XrefProps;
}> = ({ children, node }) => {
    const referentHtmlId = `division-${node.data.props.referent}`;
    const label = node.data.props.displayText;

    return (
        <a className="xref" href={`#${referentHtmlId}`}>
            {children}
            {label}
        </a>
    );
};
