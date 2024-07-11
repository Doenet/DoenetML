import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import type { XrefProps } from "@doenet/doenetml-worker-rust";
import { normalizeAttrs } from "../../utils/pretext/normalize-attrs";

export const Xref: BasicComponentWithPassthroughChildren<{
    props: XrefProps;
}> = ({ children, node }) => {
    const referentHtmlId = `doenet-id-${node.data.props.referent}`;

    return React.createElement(
        "xref",
        normalizeAttrs({ ref: referentHtmlId }),
        <React.Fragment>{children}</React.Fragment>,
    );
};
