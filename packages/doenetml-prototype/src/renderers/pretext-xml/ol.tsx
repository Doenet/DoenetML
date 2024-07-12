import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import type { OlProps } from "@doenet/doenetml-worker-rust";

export const Ol: BasicComponentWithPassthroughChildren<{
    props: OlProps;
}> = ({ children, node }) => {
    return <ol>{children}</ol>;
};
