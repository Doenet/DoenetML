import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import { Element } from "../element";
import type { SectionProps } from "@doenet/doenetml-worker-rust";

export const Section: BasicComponentWithPassthroughChildren<{
    props: SectionProps;
}> = ({ children, node, visibilityRef }) => {
    const titleElmId = node.data.props.title;
    const codeNumber = node.data.props.codeNumber;
    const displayName = `Section${codeNumber ? ` ${codeNumber}.` : ""}`;

    const title = titleElmId != null ? <Element id={titleElmId} /> : "";

    return (
        <div className="section" ref={visibilityRef}>
            <h3>
                {displayName} {title}
            </h3>
            {children}
        </div>
    );
};
