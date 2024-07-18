import React from "react";
import { BasicComponent } from "../types";
import type { TextPropsInText } from "@doenet/doenetml-worker-rust";

type TextData = { props: TextPropsInText };

export const Text: BasicComponent<TextData> = ({ node }) => {
    return <React.Fragment>{node.data.props.value}</React.Fragment>;
};
