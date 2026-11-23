import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";

type TagData = {
    props: {
        /** Drawn as a self-closing tag, `<name/>` (a `<tage>`). */
        selfClosed?: boolean;
    };
};

export const Tag: BasicComponentWithPassthroughChildren<TagData> = ({
    node,
    children,
    htmlId,
}) => {
    return (
        <code className="tag" id={htmlId}>
            &lt;<span className="tag-name">{children}</span>
            {node.data.props?.selfClosed ? "/" : ""}&gt;
        </code>
    );
};
