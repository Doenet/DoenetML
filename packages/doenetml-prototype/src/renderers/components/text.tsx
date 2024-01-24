import React from "react";
import { BasicComponent } from "../types";

type TextData = { state: { value: string } };

export const Text: BasicComponent<TextData> = ({ node }) => {
    return <span>{node.data.state.value}</span>;
};
