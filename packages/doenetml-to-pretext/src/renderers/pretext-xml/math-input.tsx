import React from "react";
import { BasicComponent } from "../types";
import { inputLabelContent } from "./utils/input-label";

type MathInputData = { props: { label?: string } };

export const MathInput: BasicComponent<MathInputData> = ({ node }) => {
    const characters = 8;

    return (
        <React.Fragment>
            {inputLabelContent(node.data.props.label)}
            <m>
                <fillin characters={characters} />
            </m>
        </React.Fragment>
    );
};
