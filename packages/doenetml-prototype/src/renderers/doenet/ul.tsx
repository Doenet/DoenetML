import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import type { UlPropsInText } from "@doenet/doenetml-worker";
import "./ul.css";

export const Ul: BasicComponentWithPassthroughChildren<{
    props: UlPropsInText;
}> = ({ children, node }) => {
    return <ul>{children}</ul>;
};
