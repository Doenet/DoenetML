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

    const divisionType = node.data.props.divisionType;

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
        {},
        <React.Fragment>
            {title}
            {children}
        </React.Fragment>,
    );
};
