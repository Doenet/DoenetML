import React from "react";
import { BasicComponent } from "../types";
import type { BooleanPropsInText } from "@doenet/doenetml-worker";

type BooleanData = { props: BooleanPropsInText };

export const Boolean: BasicComponent<BooleanData> = ({ node }) => {
    return <span>{node.data.props.value.toString()}</span>;
};
