import React from "react";
import { BasicComponent } from "../types";

type BooleanData = { state: { value: boolean } };

export const Boolean: BasicComponent<BooleanData> = ({ node }) => {
    return <span>{node.data.state.value.toString()}</span>;
};
