import React from "react";
import { BasicComponent } from "../types";
import type { BooleanProps } from "@doenet/doenetml-worker-rust";

type BooleanData = { props: BooleanProps };

export const Boolean: BasicComponent<BooleanData> = ({ node }) => {
    return <span>{node.data.props.value.toString()}</span>;
};
