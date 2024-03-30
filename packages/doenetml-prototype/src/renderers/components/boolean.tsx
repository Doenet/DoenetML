import React from "react";
import { BasicComponent } from "../types";

type BooleanData = { props: { value: boolean } };

export const Boolean: BasicComponent<BooleanData> = ({ node }) => {
    return <span>{node.data.props.value.toString()}</span>;
};
