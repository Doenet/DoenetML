import React from "react";
import type { TextInputPropsInText } from "@doenet/doenetml-worker";
import { BasicComponent } from "../types";

type TextInputData = { props: TextInputPropsInText };

export const TextInput: BasicComponent<TextInputData> = ({ node }) => {
    const value = node.data.props.immediateValue;
    const characters = Math.max(value.length || 0, 8);

    return <fillin characters={characters} />;
};
