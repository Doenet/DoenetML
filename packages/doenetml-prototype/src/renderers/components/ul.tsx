import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import type { UlProps } from "@doenet/doenetml-worker-rust";

export const Ul: BasicComponentWithPassthroughChildren<{
    props: UlProps;
}> = ({ children, node }) => {
    return <ul>{children}</ul>;
};
