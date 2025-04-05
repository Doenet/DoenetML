import React from "react";
import { BasicComponent } from "../types";
import type { BooleanPropsInText } from "@doenet/doenetml-worker-rust";

type BooleanData = { props: BooleanPropsInText };

export const Boolean: BasicComponent<BooleanData> = ({ node }) => {
    return <em>{node.data.props.value.toString()}</em>;
};
