import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";

type TagData = { props: unknown };

export const Tag: BasicComponentWithPassthroughChildren<TagData> = ({
    node,
    children,
    htmlId,
}) => {
    return (
        <code className="tag" id={htmlId}>
            &lt;<span className="tag-name">{children}</span>&gt;
        </code>
    );
};
