import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import { Element } from "../element";
import type { DivisionProps } from "@doenet/doenetml-worker-rust";

export const Division: BasicComponentWithPassthroughChildren<{
    props: DivisionProps;
}> = ({ children, node, visibilityRef }) => {
    const htmlId = `division-${node.data.id}`;
    const titleElmId = node.data.props.title;
    const codeNumber = node.data.props.codeNumber;
    const xrefLabel = node.data.props.xrefLabel;
    const displayName = `${xrefLabel.label}${
        codeNumber ? ` ${codeNumber}.` : ""
    }`;

    const title = titleElmId != null ? <Element id={titleElmId} /> : "";

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
