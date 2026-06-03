import React from "react";
import { BasicComponent } from "../types";

type DisplayDoenetMLData = { props: { text: string } };

export const DisplayDoenetML: BasicComponent<DisplayDoenetMLData> = ({
    node,
}) => {
    return <React.Fragment>{node.data.props.text}</React.Fragment>;
};
