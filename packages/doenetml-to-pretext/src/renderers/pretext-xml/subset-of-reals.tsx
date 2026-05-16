import React from "react";
import { BasicComponent } from "../types";

type SubsetOfRealsData = { props: { latex: string } };

export const SubsetOfReals: BasicComponent<SubsetOfRealsData> = ({ node }) => {
    return <m>{node.data.props.latex}</m>;
};
