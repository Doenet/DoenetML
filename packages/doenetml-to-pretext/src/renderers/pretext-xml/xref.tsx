import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import type { XrefPropsInText } from "@doenet/doenetml-worker";
import { normalizeAttrs } from "../../utils/pretext/normalize-attrs";

export const Xref: BasicComponentWithPassthroughChildren<{
    props: XrefPropsInText;
}> = ({ children, node }) => {
    const referentHtmlId = `doenet-id-${node.data.props.referent}`;

    return React.createElement(
        "xref",
        normalizeAttrs({ ref: referentHtmlId }),
        <React.Fragment>{children}</React.Fragment>,
    );
};
