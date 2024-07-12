import React from "react";
import type { TextInputProps } from "@doenet/doenetml-worker-rust";
import { BasicComponent } from "../types";

type TextInputData = { props: TextInputProps };

export const TextInput: BasicComponent<TextInputData> = ({ node }) => {
    const value = node.data.props.immediateValue;

    return <em>{value}</em>;
};
