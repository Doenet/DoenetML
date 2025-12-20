import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import type { PPropsInText } from "@doenet/doenetml-worker";

export const P: BasicComponentWithPassthroughChildren<{
    props: PPropsInText;
}> = ({ children, node }) => {
    return (<div {...node.attributes} className="doenetml-p"> {children}</div>);
};
