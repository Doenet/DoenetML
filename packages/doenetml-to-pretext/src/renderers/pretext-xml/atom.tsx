import React from "react";
import { BasicComponent } from "../types";

type AtomData = { props: { latex: string } };

export const Atom: BasicComponent<AtomData> = ({ node }) => {
    return <m>{node.data.props.latex}</m>;
};
