import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import { Element } from "../element";
import type { DivisionPropsInText } from "@doenet/doenetml-worker-rust";
import { generateHtmlId } from "../utils";

export const Division: BasicComponentWithPassthroughChildren<{
    props: DivisionPropsInText;
}> = ({ children, node, annotation, ancestors }) => {
    const htmlId = generateHtmlId(node, annotation, ancestors);
    const titleElmId = node.data.props.title;
    const divisionType = node.data.props.divisionType;

    // If the node had a name, we want to put an `xml:id` attribute on the element
    // We use `htmlId` as the value of the `xml:id` attribute because it will always be globally unique
    // as required by PreTeXt
    const xmlId = node.name && htmlId;

    const additionalAttrs = { "xml:id": xmlId };

    const title =
        titleElmId != null ? (
            // We put a newline before a title just to make the formatting of the document look a little better
            <React.Fragment>
                {"\n    "}
                <Element id={titleElmId} ancestors={ancestors} />
            </React.Fragment>
        ) : (
            ""
        );

    return React.createElement(
        divisionType,
        { ...node.attributes, ...additionalAttrs },
        <React.Fragment>
            {title}
            {children}
        </React.Fragment>,
    );
};
