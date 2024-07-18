import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import { Element } from "../element";
import type { DivisionPropsInText } from "@doenet/doenetml-worker-rust";
import { generateHtmlId } from "../utils";

export const Division: BasicComponentWithPassthroughChildren<{
    props: DivisionPropsInText;
}> = ({ children, node, visibilityRef, annotation, ancestors }) => {
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
        <div className="section" ref={visibilityRef} id={htmlId}>
            <Header depth={node.data.props.divisionDepth}>
                {displayName} {title}
            </Header>
            {children}
        </div>
    );
};

const Header: React.FunctionComponent<
    React.PropsWithChildren<{ depth: number }>
> = ({ depth, children }) => {
    if (depth > 5) {
        depth = 5;
    }
    if (depth < 0) {
        depth = 0;
    }
    depth += 1;

    return React.createElement(`h${depth}`, {}, children);
};
