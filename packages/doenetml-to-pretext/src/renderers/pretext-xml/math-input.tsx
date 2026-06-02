import React from "react";
import { BasicComponent } from "../types";

type MathInputData = { props: { label: string } };

export const MathInput: BasicComponent<MathInputData> = ({ node }) => {
    const characters = 8;
    const label = node.data.props.label;

    return (
        <React.Fragment>
            {label ? label + " " : null}
            <m>
                <fillin characters={characters} />
            </m>
        </React.Fragment>
    );
};
