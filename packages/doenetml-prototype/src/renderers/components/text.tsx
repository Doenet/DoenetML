import React from "react";
import { BasicComponent } from "../types";

type TextData = { props: { value: string } };

export const Text: BasicComponent<TextData> = ({ node }) => {
    return <span>{node.data.props.value}</span>;
};
