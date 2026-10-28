import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";

type RefData = { props: { url: string | null } };

/** `<ref>`: its children as a link, when it links to a web address. */
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
