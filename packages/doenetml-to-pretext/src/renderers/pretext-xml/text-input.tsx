import React from "react";
import type { TextInputPropsInText } from "@doenet/doenetml-worker";
import { BasicComponent } from "../types";
import { TEXT_FILLIN_CHARACTERS } from "./fillin-width";
import { useInputLabel } from "./use-input-label";

type TextInputData = { props: TextInputPropsInText & { label?: string } };

export const TextInput: BasicComponent<TextInputData> = ({ node }) => {
    const value = node.data.props.immediateValue;
    const characters = Math.max(value.length || 0, TEXT_FILLIN_CHARACTERS);
    const displayLabel = useInputLabel(node.data.props.label);

    return (
        <React.Fragment>
            {displayLabel}
            <fillin characters={characters} />
        </React.Fragment>
    );
};
