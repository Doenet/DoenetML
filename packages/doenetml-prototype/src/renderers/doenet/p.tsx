import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import type { PProps } from "@doenet/doenetml-worker-rust";

export const P: BasicComponentWithPassthroughChildren<{ props: PProps }> = ({
    children,
}) => {
    return <div className="para">{children}</div>;
};
