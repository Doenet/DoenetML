import React from "react";
import { BasicComponent } from "../types";

type AbsData = { props: { latex: string } };

export const Abs: BasicComponent<AbsData> = ({ node }) => {
    return <m>{node.data.props.latex}</m>;
};
