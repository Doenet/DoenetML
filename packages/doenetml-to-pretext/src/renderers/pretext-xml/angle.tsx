import React from "react";
import { BasicComponent } from "../types";

type AngleData = { props: { latex: string } };

export const Angle: BasicComponent<AngleData> = ({ node }) => {
    return <m>{node.data.props.latex}</m>;
};
