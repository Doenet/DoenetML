import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import { Element } from "../element";

export const Section: BasicComponentWithPassthroughChildren<{
    titleElmId?: number;
}> = ({ children, node, visibilityRef }) => {
    const titleElmId = node.data.titleElmId;

    const title = titleElmId != null ? <Element id={titleElmId} /> : "Section";

    return (
        <div className="section" ref={visibilityRef}>
            <h3>{title}</h3>
            {children}
        </div>
    );
};
