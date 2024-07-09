import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import { Element } from "../element";
import type { DivisionProps } from "@doenet/doenetml-worker-rust";
import { generateHtmlId } from "../utils";

export const Division: BasicComponentWithPassthroughChildren<{
    props: DivisionProps;
}> = ({ children, node, annotation, ancestors }) => {
    const htmlId = generateHtmlId(node, annotation, ancestors);
    const titleElmId = node.data.props.title;
    const codeNumber = node.data.props.codeNumber;
    const xrefLabel = node.data.props.xrefLabel;
    const displayName = `${xrefLabel.label}${
        codeNumber ? ` ${codeNumber}.` : ""
    }`;

    const title =
        titleElmId != null ? (
            <Element id={titleElmId} ancestors={ancestors} />
        ) : (
            ""
        );

    return (
        <div className="section" id={htmlId}>
            <title>
                {displayName} {title}
            </title>
            {children}
        </div>
    );
};