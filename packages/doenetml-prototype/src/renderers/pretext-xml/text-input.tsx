import React from "react";
import type { TextInputPropsInText } from "@doenet/doenetml-worker-rust";
import { BasicComponent } from "../types";

type TextInputData = { props: TextInputPropsInText };

export const TextInput: BasicComponent<TextInputData> = ({ node }) => {
    const value = node.data.props.immediateValue;

    return <em>{value}</em>;
};
