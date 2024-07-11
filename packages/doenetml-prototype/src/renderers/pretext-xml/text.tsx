import React from "react";
import { BasicComponent } from "../types";
import type { TextProps } from "@doenet/doenetml-worker-rust";

type TextData = { props: TextProps };

export const Text: BasicComponent<TextData> = ({ node }) => {
    return <React.Fragment>{node.data.props.value}</React.Fragment>;
};
