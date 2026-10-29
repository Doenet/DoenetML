import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";

type RefData = {
    props: {
        /** The web address it links to; null when it links to none. */
        url: string | null;
    };
};

/**
 * Ref renders its children as a link, when it links to a web address.
 */
export const Ref: BasicComponentWithPassthroughChildren<RefData> = ({
    node,
    children,
    htmlId,
}) => {
    return (
        <a className="ref" id={htmlId} href={node.data.props.url ?? undefined}>
            {children}
        </a>
    );
};
