import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import type { LiPropsInText } from "@doenet/doenetml-worker";
import { generateHtmlId } from "../utils";
import { InParagraphContext } from "./paragraph-context";

export const Li: BasicComponentWithPassthroughChildren<{
    props: LiPropsInText;
}> = ({ children, node, annotation, ancestors }) => {
    const htmlId = generateHtmlId(node, annotation, ancestors);
    const label = node.data.props.label;
    // A list item holds blocks of its own, even in a list inside a paragraph.
    return (
        <li {...{ "xml:id": htmlId }}>
            <InParagraphContext.Provider value={false}>
                {children}
            </InParagraphContext.Provider>
        </li>
    );
};
