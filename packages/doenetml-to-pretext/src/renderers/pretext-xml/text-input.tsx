import React from "react";
import type { TextInputPropsInText } from "@doenet/doenetml-worker";
import { BasicComponent } from "../types";
import { TEXT_FILLIN_CHARACTERS } from "./fillin-width";

type TextInputData = { props: TextInputPropsInText };

export const TextInput: BasicComponent<TextInputData> = ({ node }) => {
    const value = node.data.props.immediateValue;
    const characters = Math.max(value.length || 0, TEXT_FILLIN_CHARACTERS);

    return <fillin characters={characters} />;
};
