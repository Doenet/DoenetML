import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import type { PPropsInText } from "@doenet/doenetml-worker";

export const P: BasicComponentWithPassthroughChildren<{
    props: PPropsInText;
}> = ({ children, node }) => {
    return <p {...node.attributes}>{children}</p>;
};
