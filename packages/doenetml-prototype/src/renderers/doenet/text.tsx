import React from "react";
import { BasicComponent } from "../types";
import type { TextPropsInText } from "@doenet/doenetml-worker";

type TextData = { props: TextPropsInText };

export const Text: BasicComponent<TextData> = ({ node }) => {
    return <span>{node.data.props.value}</span>;
};
