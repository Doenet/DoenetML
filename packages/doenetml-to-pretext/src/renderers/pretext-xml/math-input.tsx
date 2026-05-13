import React from "react";
import { BasicComponent } from "../types";

type MathInputData = { props: unknown };

export const MathInput: BasicComponent<MathInputData> = ({ node }) => {
    const characters = 8;

    return (
        <m>
            <fillin characters={characters} />
        </m>
    );
};
