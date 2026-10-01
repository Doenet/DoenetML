import React from "react";
import { BasicComponent } from "../types";
import { useInputLabel } from "./use-input-label";

type MathInputData = { props: { label?: string; labelElementId?: number } };

export const MathInput: BasicComponent<MathInputData> = ({ node }) => {
    const characters = 8;
    const displayLabel = useInputLabel(
        node.data.props.label,
        node.data.props.labelElementId,
    );

    return (
        <React.Fragment>
            {displayLabel}
            <m>
                <fillin characters={characters} />
            </m>
        </React.Fragment>
    );
};
